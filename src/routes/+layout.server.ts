import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';
import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { supabase, session, permissions, coordinatesKYNG },
	cookies
}) => {
	let communityRequestOptionsData;
	const communityRequestOptionsQuery = await supabase
		.from('community_request_options_lut')
		.select(
			`index_value,lable,community_request_options_concordance(table_name,object_name,field_name)`
		);
	const { data: communityRequestOptionsQueryData, error: communityRequestOptionsQueryError } =
		communityRequestOptionsQuery;

	if (communityRequestOptionsQueryError) {
		console.log('GET data error Community Request Options:', communityRequestOptionsQueryError);
		let emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Community Request Options.`,
			user: `User:: $user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, communityRequestOptionsQueryError);
		error(
			400,
			`GET data error Community Request Options:  Error ${communityRequestOptionsQueryError.message}`
		);
	}
	if (communityRequestOptionsQueryData && communityRequestOptionsQueryData.length > 0) {
		communityRequestOptionsData = communityRequestOptionsQueryData;
	}
	return {
		session,
		cookies: cookies.getAll(),
		permissions,
		coordinatesKYNG,
		communityRequestOptionsData
	};
};
