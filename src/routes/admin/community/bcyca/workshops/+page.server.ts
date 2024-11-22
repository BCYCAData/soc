import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.bcyca.workshops')) {
		console.error('Forbidden attempt on /admin/bcyca/workshops:', user);
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
	const { data: bcycaWorkshopsData, error: bcycaWorkshopsError } = await supabase.rpc(
		'get_user_bcyca_workshops_data',
		{}
	);
	if (bcycaWorkshopsError) {
		console.log('error get BCYCA Workshop Choices Data:', bcycaWorkshopsError);
		error(400, bcycaWorkshopsError.message);
	}
	return { bcycaWorkshopsData: bcycaWorkshopsData };
};
