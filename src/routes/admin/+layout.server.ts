import { error, redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from '../$types';
import { getUserPermissions } from '$lib/server/auth.utilities';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSessionAndUser } }) => {
	const { user, user_role } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}

	let permissions = await getUserPermissions(supabase, user.id, user_role || '');

	const { data: adminMessagesData, error: adminMessagesError } = await supabase.rpc(
		'get_admin_messages_for_user',
		{
			id_input: user.id as string
		}
	);
	if (adminMessagesError) {
		console.log('error get Admin Messages for User:', adminMessagesError);
		error(400, adminMessagesError.message);
	}

	return {
		permissions,
		adminMessages: adminMessagesData || []
	};
};
