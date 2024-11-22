import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.mondrook.events')) {
		console.error('Forbidden attempt on /admin/mondrook/events:', user);
		redirect(403, '/personal-profile');
	}
	const { data: mondrookEventsData, error: mondrookEventsError } = await supabase.rpc(
		'get_user_mondrook_events_data',
		{}
	);
	if (mondrookEventsError) {
		console.log('error get Mondrook Meeting Choices Data:', mondrookEventsError);
		error(400, mondrookEventsError.message);
	}
	return {
		mondrookEventsData: mondrookEventsData
	};
};
