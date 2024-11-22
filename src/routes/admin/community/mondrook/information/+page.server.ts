import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.mondrook.information')) {
		console.error('Forbidden attempt on /admin/mondrook/information:', user);
		redirect(403, '/personal-profile');
	}
	const { data: mondrookInformationData, error: mondrookInformationError } = await supabase.rpc(
		'get_user_mondrook_information_data',
		{}
	);
	if (mondrookInformationError) {
		console.log('error get Mondrook Information Sheet Choices Data:', mondrookInformationError);
		error(400, mondrookInformationError.message);
	}
	return {
		mondrookInformationData: mondrookInformationData
	};
};
