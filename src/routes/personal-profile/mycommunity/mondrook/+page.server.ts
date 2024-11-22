import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(401, '/auth/signin');
		}
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileMondrookMyCommunityFormData = getMyCommunityMondrookFormData(formData);
		const havePostalAddress = profileMondrookMyCommunityFormData.stay_in_touch_choices?.includes(5);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myCommunityMondrookUserProfileError } = await supabase
				.from('community_mondrook_profile')
				.update({
					stay_in_touch_choices: profileMondrookMyCommunityFormData.stay_in_touch_choices,
					other_comments: profileMondrookMyCommunityFormData.other_comments
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myCommunityMondrookUserProfileError) {
				console.log(
					'error profileMondrookMyCommunity update community_mondrook_profile: ',
					myCommunityMondrookUserProfileError
				);
				error(
					400,
					`error profileMondrookMyCommunityupdate user_profile: ${myCommunityMondrookUserProfileError.message}`
				);
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileMondrookMyCommunityFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMondrookMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMondrookMyCommunityFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileMondrookMyCommunityupdateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						error(
							400,
							`error profileMondrookMyCommunityupdate UserPostalAddress: ${userPostalAddressUpdateError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
					const { error: userPostalAddressDeleteError } = await supabase
						.from('user_postal_address')
						.delete()
						.eq('user_id', user.id);
					if (userPostalAddressDeleteError) {
						console.log(
							'error profileMondrookMyCommunitydelete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						error(
							400,
							`error profileMondrookMyCommunitydelete UserPostalAddress ${userPostalAddressDeleteError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
					const { error: userPostalAddressUpsertError } = await supabase
						.from('user_postal_address')
						.upsert({
							user_id: user.id,
							postal_address_street:
								profileMondrookMyCommunityFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMondrookMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMondrookMyCommunityFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileMondrookMyCommunityupsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						error(
							400,
							`error profileMondrookMyCommunityupsertUserPostalAddress: ${userPostalAddressUpsertError.message}`
						);
					}
				}
			}
		}
		return {
			profileMondrookMyCommunityFormData,
			success: true
		};
	}
};
