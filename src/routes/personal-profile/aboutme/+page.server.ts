import { redirect } from '@sveltejs/kit';
import { getAboutMeFormData } from '$lib/server/form.utilities';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) return redirect(401, '/auth/signin');
		const formData = await request.formData();
		const profileAboutMeFormData = getAboutMeFormData(formData);
		const { error: aboutMeDataError } = await supabase
			.from('user_profile')
			.update(profileAboutMeFormData)
			.eq('id', user.id);
		if (aboutMeDataError) {
			console.log('error profileAboutMe update user_profile: ', aboutMeDataError);
			return {
				profileAboutMeFormData,
				success: false,
				error: true,
				errorMessage: `${aboutMeDataError.message}`
			};
		}
		return { profileAboutMeFormData, success: true, error: false, errorMessage: '' };
	}
};
