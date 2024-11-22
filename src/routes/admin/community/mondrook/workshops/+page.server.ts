import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.mondrook.workshops')) {
		console.error('Forbidden attempt on /admin/mondrook/workshops:', user);
		redirect(403, '/personal-profile');
	}
	const { data: mondrookWorkshopsData, error: mondrookWorkshopsError } = await supabase.rpc(
		'get_user_mondrook_workshops_data',
		{}
	);
	if (mondrookWorkshopsError) {
		console.log('error get Mondrook Workshop Choices Data:', mondrookWorkshopsError);
		error(400, mondrookWorkshopsError.message);
	}
	return { mondrookWorkshopsData: mondrookWorkshopsData };
};
