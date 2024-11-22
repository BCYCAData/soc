import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user }, params }) => {
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const { data: propertyGeometryData, error: propertyGeometryError } = await supabase.rpc(
		'get_property_geometry',
		{ id_input: params.propertyid }
	);
	if (propertyGeometryError) {
		console.log('error get Property Geometry:', propertyGeometryError);
		error(400, propertyGeometryError);
	}
	return { propertyGeometryData };
};
