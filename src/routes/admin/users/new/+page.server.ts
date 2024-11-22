import { error, redirect } from '@sveltejs/kit';

// import { render } from 'svelty-email';
// import nodemailer from 'nodemailer';

import Tester from '$components/email_templates/Tester.svelte';

import type { PageServerLoad } from './$types.js';
import type { Actions } from './$types.js';
import { getUserPermissions } from '$lib/server/auth.utilities.js';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		redirect(401, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions.includes('admin.users.newusers')) {
		console.error('Forbidden attempt on /admin/users/newusers:', user);
		redirect(403, '/personal-profile');
	}
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } = await supabase.rpc(
		'get_user_vetting_data',
		{}
	);

	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		error(400, usersAdminNewUsersError.message);
	}
	return {
		usersAdminNewUsersData: usersAdminNewUsersData
	};
};
export const actions: Actions = {
	newusersemail: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user, user_role } = await getSessionAndUser();
		if (!user || !user_role) {
			return { success: false, error: 'Unauthorized' };
		}
		const permissions = await getUserPermissions(supabase, user.id, user_role);
		if (!permissions.includes('admin.users')) {
			return { success: false, error: 'Forbidden' };
		}
		// else {
		// const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
		// 	if (session) {
		// 		const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
		// 		const userRole = jwt.user_role;
		// 		if (userRole?.split('_')[0] !== 'admin') {
		// 			error(403, { message: 'Forbidden' });
		// 		}
		// 	}
		// 	data.subscription.unsubscribe();
		// });
		// }
		// const transporter = nodemailer.createTransport({
		// 	service: 'hotmail',
		// 	auth: {
		// 		user: 'socdatadev@outlook.com',
		// 		pass: 'CommunityInformationInfrastructure'
		// 	}
		// });
		// const emailHtml = await render({
		// 	template: template,
		// 	props: {
		// 		firstName: 'John'
		// 	}
		// });
		// const mailOptions: nodemailer.SendMailOptions = {
		// 	from: 'socdatadev@outlook.com',
		// 	to: 'socdata@outlook.com, alankeown@southernphone.com.au',
		// 	subject: 'Test Email',
		// 	html: emailHtml
		// };
		// transporter.sendMail(mailOptions, (error, info) => {
		// 	if (error) {
		// 		console.log(error);
		// 	} else {
		// 		console.log('Email sent: ' + info.response);
		// 	}
		// });
		// const body = Object.fromEntries(await request.formData());
		// const { error: err } = await supabase.auth.signInWithPassword({
		// 	email: body.email as string,
		// 	password: body.password as string
		// });
		// if (err) {
		// 	if (err instanceof AuthApiError && err.status === 400) {
		// 		return fail(400, {
		// 			error: 'Invalid credentials'
		// 		});
		// 	}
		// 	return fail(500, {
		// 		message: 'Server error. Try again later.'
		// 	});
		// }
		// throw redirect(303, '/profile');
	}
};
