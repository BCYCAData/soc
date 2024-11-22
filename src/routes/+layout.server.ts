import { getUserPermissions, hasAdminPermission } from '$lib/server/auth.utilities';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';
import { error, redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { CommunityRequestOption } from '$lib/profileOptions';

export const load: LayoutServerLoad = async ({
	locals: { getSessionAndUser, supabase },
	cookies
}) => {
	const { session, user, user_role, coordinatesKYNG } = await getSessionAndUser();
	if (!user) {
		console.log('User not found');
		throw redirect(301, '/auth/signin');
	}

	const getCommunityRequestOptions = async () => {
		const { data, error: requestError } = await supabase.from('community_request_options_lut')
			.select(`
      index_value,
      lable,
      community_request_options_concordance(
        table_name,
        object_name,
        field_name
      )
    `);

		if (requestError) {
			console.error('Failed to fetch community request options:', requestError);

			const emailSubject: PostgRestErrorEmailSubject = {
				type: 'GET data error :: Community Request Options',
				user: `User:: ${user.id}`,
				time: new Date().toLocaleString()
			};

			sendPostgRestErrorEmail(emailSubject, requestError);
			throw error(400, `Failed to fetch community request options: ${requestError.message}`);
		}
		return (data || []).map((item) => ({
			...item,
			community_request_options_concordance: item.community_request_options_concordance[0] || {
				table_name: '',
				object_name: '',
				field_name: ''
			}
		}));
	};
	const communityRequestOptions: CommunityRequestOption[] = await getCommunityRequestOptions();

	let permissions = await getUserPermissions(supabase, user.id, user_role || '');

	return {
		session,
		cookies: cookies.getAll(),
		user: session?.user,
		isAdmin: hasAdminPermission(permissions),
		coordinatesKYNG,
		communityRequestOptions
	};
};
