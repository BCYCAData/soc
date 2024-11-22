import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.external.events')) {
		console.error('Forbidden attempt on /admin/external/events:', user);
		redirect(403, '/personal-profile');
	}
	const { data: externalEventsData, error: externalEventsError } = await supabase.rpc(
		'get_user_external_events_data',
		{}
	);
	if (externalEventsError) {
		console.log('error get External Meeting Choices Data:', externalEventsError);
		error(400, externalEventsError.message);
	}
	return {
		externalEventsData: externalEventsData
	};
};
