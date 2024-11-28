import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(302, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.tinonee.workshops')) {
		console.error('Forbidden attempt on /admin/tinonee/workshops:', user);
		redirect(403, '/personal-profile');
	}
	const { data: tinoneeWorkshopsData, error: tinoneeWorkshopsError } = await supabase.rpc(
		'get_user_tinonee_workshops_data',
		{}
	);
	if (tinoneeWorkshopsError) {
		console.log('error get Tinonee Workshop Choices Data:', tinoneeWorkshopsError);
		error(400, tinoneeWorkshopsError.message);
	}
	return { tinoneeWorkshopsData: tinoneeWorkshopsData };
};
