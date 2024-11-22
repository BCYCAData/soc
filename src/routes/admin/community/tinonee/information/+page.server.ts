import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.tinonee.information')) {
		console.error('Forbidden attempt on /admin/tinonee/information:', user);
		redirect(403, '/personal-profile');
	}
	const { data: tinoneeInformationData, error: tinoneeInformationError } = await supabase.rpc(
		'get_user_tinonee_information_data',
		{}
	);
	if (tinoneeInformationError) {
		console.log('error get Tinonee Information Sheet Choices Data:', tinoneeInformationError);
		error(400, tinoneeInformationError.message);
	}
	return {
		tinoneeInformationData: tinoneeInformationData
	};
};
