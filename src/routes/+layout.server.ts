import { getUserPermissions, hasAdminPermission } from '$lib/server/auth.utilities';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';
import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { CommunityRequestOption } from '$lib/profileOptions';

interface SupabaseResponse {
	index_value: number;
	lable: string;
	community_request_options_concordance: {
		table_name: string;
		object_name: string;
		field_name: string;
	};
}

export const load: LayoutServerLoad = async ({
	locals: { getSessionAndUser, supabase },
	cookies
}) => {
	const { session, user, user_roles, coordinatesKYNG } = await getSessionAndUser();
	if (!session) {
		return {
			session: null,
			user: null,
			user_roles: null,
			coordinatesKYNG: null
		};
	}
	const getCommunityRequestOptions = async () => {
		const { data, error: requestError } = await supabase.from('community_request_options_lut')
			.select(`
				index_value,
				lable,
				community_request_options_concordance!public_community_request_options_lut_concordance_fkey (
				table_name,
				object_name,
				field_name
				)
			`);

		if (requestError) {
			console.error('Failed to fetch community request options:', requestError);

			const emailSubject: PostgRestErrorEmailSubject = {
				type: 'GET data error :: Community Request Options',
				user: `User:: ${user?.id}`,
				time: new Date().toLocaleString()
			};

			sendPostgRestErrorEmail(emailSubject, requestError);
			throw error(400, `Failed to fetch community request options: ${requestError.message}`);
		}
		return ((data as unknown as SupabaseResponse[]) || []).map((item) => ({
			index_value: item.index_value,
			lable: item.lable,
			community_request_options_concordance: item.community_request_options_concordance
		})) as CommunityRequestOption[];
	};
	const communityRequestOptions: CommunityRequestOption[] = await getCommunityRequestOptions();

	let permissions = await getUserPermissions(supabase, user?.id, user_roles || []);

	return {
		session,
		cookies: cookies.getAll(),
		user: session?.user,
		isAdmin: hasAdminPermission(permissions),
		coordinatesKYNG,
		communityRequestOptions
	};
};
