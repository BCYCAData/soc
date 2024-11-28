import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(302, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.bcyca.events')) {
		console.error('Forbidden attempt on /admin/bcyca/events:', user);
		redirect(403, '/personal-profile');
	}

	const { data: bcycaEventsData, error: bcycaEventsError } = await supabase.rpc(
		'get_user_bcyca_events_data',
		{}
	);
	if (bcycaEventsError) {
		console.log('error get BCYCA Meeting Choices Data:', bcycaEventsError);
		error(400, bcycaEventsError.message);
	}
	return {
		bcycaEventsData: bcycaEventsData
	};
};
