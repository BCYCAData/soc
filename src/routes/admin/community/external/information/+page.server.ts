import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.external.information')) {
		console.error('Forbidden attempt on /admin/external/information:', user);
		redirect(403, '/personal-profile');
	}
	// else {
	// 	const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
	// 		if (session) {
	// 			const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
	// 			const userRole = jwt.user_role;
	// 			if (userRole?.split('_')[0] !== 'admin') {
	// 				error(403, { message: 'Forbidden' });
	// 			}
	// 		}
	// 		data.subscription.unsubscribe();
	// 	});
	// }
	const { data: externalInformationData, error: externalInformationError } = await supabase.rpc(
		'get_user_external_information_data',
		{}
	);
	if (externalInformationError) {
		console.log('error get External Information Sheet Choices Data:', externalInformationError);
		error(400, externalInformationError.message);
	}
	return {
		externalInformationData: externalInformationData
	};
};
