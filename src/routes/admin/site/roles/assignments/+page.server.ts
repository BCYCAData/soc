import { error } from '@sveltejs/kit';
import { getUserPermissions } from '$lib/server/auth.utilities';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageServerLoad, Actions } from './$types';

interface UserRole {
	id: bigint;
	user_id: string;
	role: string;
	email: string;
}

interface User {
	id: string;
	email: string;
}

const REQUIRED_PERMISSION = 'admin.site.messages';

async function validateUserPermissions(
	supabase: SupabaseClient,
	getSessionAndUser: () => Promise<any>,
	requiredPermission: string
) {
	const { user, user_roles } = await getSessionAndUser();
	if (!user || !user_roles) {
		throw error(401, 'Unauthorized access');
	}
	const permissions = await getUserPermissions(supabase, user.id, user_roles);

	if (!permissions.includes(requiredPermission)) {
		throw error(403, 'Insufficient permissions');
	}
	return { user, user_roles, permissions };
}

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser } }) => {
	await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);
	const { data: roles, error: rolesError } = await supabase.rpc('get_user_roles');

	const { data: permissions, error: permissionsError } = await supabase
		.from('role_permissions')
		.select('*');

	if (rolesError || permissionsError) {
		throw error(500, 'Failed to load roles data');
	}
	const users =
		roles?.map(
			(role: UserRole): User => ({
				id: role.user_id,
				email: role.email
			})
		) || [];

	return {
		roles,
		permissions,
		users: [...new Map(users.map((user: User) => [user.id, user])).values()]
	};
};

export const actions: Actions = {
	assignRole: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);
		const formData = await request.formData();
		const target_data = formData.get('target_data');
		if (!target_data) {
			throw error(400, 'Target data is missing');
		}
		const user_id = JSON.parse(target_data as string)[0];
		const role = formData.get('role');

		const { error: assignError } = await supabase.from('user_roles').upsert({ user_id, role });

		if (assignError) {
			console.log('assignError', assignError);
			throw error(400, assignError.details);
		}

		return { success: true };
	},
	removeRole: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);
		const formData = await request.formData();
		const roleId = formData.get('roleId');

		const { error: removeError } = await supabase.from('user_roles').delete().eq('id', roleId);

		if (removeError) {
			throw error(400, 'Failed to remove role');
		}

		return { success: true };
	},

	updatePermissions: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		await validateUserPermissions(supabase, getSessionAndUser, REQUIRED_PERMISSION);
		const formData = await request.formData();
		const role = formData.get('role');
		const permissions = formData.get('permissions');

		const { error: updateError } = await supabase
			.from('role_permissions')
			.upsert({ role, permission: permissions });

		if (updateError) {
			throw error(400, 'Failed to update permissions');
		}

		return { success: true };
	}
};
