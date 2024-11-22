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
	console.log('permissions', permissions);

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
		const userId = formData.get('userId');
		const role = formData.get('role');

		const { error: assignError } = await supabase
			.from('user_roles')
			.insert({ user_id: userId, role });

		if (assignError) {
			throw error(400, 'Failed to assign role');
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
