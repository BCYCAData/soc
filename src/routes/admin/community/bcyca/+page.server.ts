import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(302, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.bcyca')) {
		console.error('Forbidden attempt on /admin/bcyca:', user);
		redirect(403, '/personal-profile');
	}

	return {
		bcycaAdminData: {}
	};
};
