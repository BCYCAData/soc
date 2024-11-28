import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSessionAndUser } }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(302, '/auth/signin');
	}
};
