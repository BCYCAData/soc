import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.site.roles')) {
		console.error('Forbidden attempt on /admin/site/roles:', user);
		redirect(403, '/personal-profile');
	}
	return {
		siteAdminRolesData: user?.app_metadata?.roles
	};
};
