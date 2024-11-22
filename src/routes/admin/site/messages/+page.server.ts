import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserPermissions } from '$lib/server/auth.utilities';
import type { SupabaseClient } from '@supabase/supabase-js';

interface ListItem {
	user_id: string;
	lut_text: string;
}

interface ListsData {
	emailList: ListItem[];
	addressList: ListItem[];
	streetList: ListItem[];
	communityList: ListItem[];
	suburbList: ListItem[];
}

type MessageContext = 'users' | 'admins' | 'both';

const REQUIRED_PERMISSION = 'admin.site.messages';

async function validateUserPermissions(
	supabase: SupabaseClient,
	getSessionAndUser: () => Promise<any>,
	requiredPermission: string
) {
	const { user, user_role } = await getSessionAndUser();
	if (!user || !user_role) {
		throw error(401, 'Unauthorized access');
	}
	const permissions = await getUserPermissions(supabase, user.id, user_role);
	if (!permissions.includes(requiredPermission)) {
		throw error(403, 'Insufficient permissions');
	}
	return { user, user_role, permissions };
}

async function sendMessage(supabase: any, message: string, context?: MessageContext, ids?: string) {
	const { data: response, error: sendError } = await supabase.rpc('insert_message', {
		message_text: message,
		context_text: context,
		ids
	});

	if (sendError) throw error(400, sendError.message);
	if (response !== 200) throw error(400, 'Message sending failed');

	return response;
}

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser } }) => {
	try {
		await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);
		const [listsResponse, messagesResponse] = await Promise.all([
			supabase.rpc('get_lists'),
			supabase.rpc('get_app_messages')
		]);
		if (listsResponse.error) throw error(400, listsResponse.error.message);
		if (messagesResponse.error) throw error(400, messagesResponse.error.message);
		const listsData = listsResponse.data as ListsData;
		return {
			emailList: listsData?.emailList ?? [],
			addressList: listsData?.addressList ?? [],
			streetList: listsData?.streetList ?? [],
			communityList: listsData?.communityList ?? [],
			suburbList: listsData?.suburbList ?? [],
			appMessages: messagesResponse.data ?? []
		};
	} catch (err) {
		console.error('Load error:', err);
		throw error(500, 'Failed to load messages data');
	}
};

export const actions: Actions = {
	sendMessageToAllUsers: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const context = formData.get('messageContext')?.toString() as MessageContext;
			if (!message?.trim() || !context) {
				throw error(400, 'Message and context are required');
			}
			await sendMessage(supabase, message, context);
			return { success: true };
		} catch (err) {
			console.error('Send to all users error:', err);
			throw error(500, 'Failed to send message to all users');
		}
	},
	sendMessageToEmailList: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				throw error(400, 'Message, context, and target recipients are required');
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true };
		} catch (err) {
			console.error('Send to email list error:', err);
			throw error(500, 'Failed to send message to selected users');
		}
	},
	sendMessageToAllUsersAtAddress: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				throw error(400, 'Message, context, and target recipients are required');
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true };
		} catch (err) {
			console.error('Send to email list error:', err);
			throw error(500, 'Failed to send message to selected users');
		}
	},
	sendMessageToAllUsersInStreet: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				throw error(400, 'Message, context, and target recipients are required');
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true };
		} catch (err) {
			console.error('Send to email list error:', err);
			throw error(500, 'Failed to send message to selected users');
		}
	},
	sendMessageToAllUsersInCommunity: async ({
		request,
		locals: { supabase, getSessionAndUser }
	}) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				throw error(400, 'Message, context, and target recipients are required');
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true };
		} catch (err) {
			console.error('Send to email list error:', err);
			throw error(500, 'Failed to send message to selected users');
		}
	},
	sendMessageToAllUsersInSuburb: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				throw error(400, 'Message, context, and target recipients are required');
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true };
		} catch (err) {
			console.error('Send to email list error:', err);
			throw error(500, 'Failed to send message to selected users');
		}
	},
	revokeMessages: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		try {
			await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);

			const formData = await request.formData();
			const idInput = formData.get('revoke_ids')?.toString();

			if (!idInput) {
				throw error(400, 'No messages selected for revocation');
			}

			const revokedIds = idInput.split(',');

			const { data: response, error: revokeError } = await supabase.rpc('revoke_app_messages', {
				revoked_ids: revokedIds
			});

			if (revokeError) throw error(400, revokeError.message);
			if (response !== 200) throw error(400, 'Message revocation failed');

			return { success: true };
		} catch (err) {
			console.error('Revoke messages error:', err);
			throw error(500, 'Failed to revoke selected messages');
		}
	}
};
