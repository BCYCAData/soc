import { error, redirect, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { getUserPermissions } from '$lib/server/auth.utilities';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.emergency.reports')) {
		console.error('Forbidden attempt on /admin/emergency/reports:', user);
		redirect(403, '/personal-profile');
	}
	const { data: streetsData, error: getStreetsError } = await supabase.rpc('get_street_list', {});
	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		error(400, getStreetsError.message);
	}
	if (streetsData.length > 0) {
		const streetList = streetsData.map(({ streets }: { streets: string }) => streets);
		return {
			streetList
		};
	}
	error(400, 'Something went wrong retrieving the Street List data');
};

export const actions: Actions = {
	generateStreetReport: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user, user_role } = await getSessionAndUser();
		if (!user || !user_role) {
			return { success: false, error: 'Unauthorized' };
		}
		const permissions = await getUserPermissions(supabase, user.id, user_role);
		if (!permissions.includes('admin.users')) {
			return { success: false, error: 'Forbidden' };
		}
		const formData = await request.formData();
		const street = formData.get('property_address_street') as string;
		const { data: streetData, error: streetError } = await supabase.rpc(
			'get_rfs_property_data_for_street',
			{
				street_input: street
			}
		);
		if (streetError) {
			console.log('get error streetData:', streetError);
			error(400, streetError.message);
		}
		if (streetData.length > 0) {
			const propertyList = streetData.map(
				({ property_id }: { property_id: number }) => property_id
			);
			const { data: residentData, error: residentError } = await supabase.rpc(
				'get_rfs_user_data_for_porperties',
				{
					property_ids: propertyList
				}
			);
			if (residentError) {
				console.log('get error residentData:', residentError);
				error(400, residentError.message);
			}
			return {
				selectedStreet: street,
				streetData: streetData
			};
		}
		error(400, 'Could not POST Street data');
	}
};
