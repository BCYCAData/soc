import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.tinonee.events')) {
		console.error('Forbidden attempt on /admin/tinonee/events:', user);
		redirect(403, '/personal-profile');
	}
	const { data: tinoneeEventsData, error: tinoneeEventsError } = await supabase.rpc(
		'get_user_tinonee_events_data',
		{}
	);
	if (tinoneeEventsError) {
		console.log('error get Tinonee Meeting Choices Data:', tinoneeEventsError);
		error(400, tinoneeEventsError.message);
	}
	return {
		tinoneeEventsData: tinoneeEventsData
	};
};
