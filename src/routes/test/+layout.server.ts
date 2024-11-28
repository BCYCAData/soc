import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// export const load: LayoutServerLoad = async ({ locals: { supabase, getSessionAndUser} }) => {
// 	if (!user) {
// 		redirect(302, '/auth/signin');
// 	}

// 	// let { data: user_profile, error: userProfileError } = await supabase.rpc('get_profile_for_user', {
// 	// 	id_input: user.id
// 	// });
// 	// console.log('user_profile', user_profile);
// 	// console.log('userProfileError', userProfileError);
// 	// return {
// 	// 	user_profile
// 	// };
// };
