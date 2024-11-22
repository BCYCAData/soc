import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { UserProfile } from '$lib/form.types';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';
import { getUserPermissions } from '$lib/server/auth.utilities';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSessionAndUser } }) => {
	const { user, user_role, coordinatesKYNG } = await getSessionAndUser();
	if (!user) {
		console.log('User not found');
		redirect(401, '/auth/signin');
	}

	let { data: user_profile, error: userProfileError } = await supabase.rpc('get_profile_for_user', {
		id_input: user.id
	});

	if (userProfileError) {
		console.log('GET data error Personal Profile:', userProfileError);
		let emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Personal Profile.`,
			user: `User:: ${user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, userProfileError);
		error(400, `GET data error Personal Profile:  Error ${userProfileError.message}`);
	}

	if (!user_profile) {
		error(404, 'Personal profile data not found');
	}

	const hadUserPostalAddress = user_profile.had_user_postal_address || false;
	const communityProfiles: Record<string, string | null> = {
		community_bcyca_profile_id: user_profile.community_bcyca_profile?.bcyca_profile_id || null,
		community_tinonee_profile_id:
			user_profile.community_tinonee_profile?.tinonee_profile_id || null,
		community_mondrook_profile_id:
			user_profile.community_mondrook_profile?.mondrook_profile_id || null,
		community_external_profile_id:
			user_profile.community_external_profile?.external_profile_id || null
	};

	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{ id_input: user.id }
	);

	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		error(400, profileMessagesError.message);
	}

	return {
		profileMessages,
		user_profile: user_profile as UserProfile,
		hadUserPostalAddress,
		communityProfiles
	};
};
