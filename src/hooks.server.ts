import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';
import { rateLimit } from '$lib/server/auth.utilities';
import { validateRequest } from '$lib/server/auth.utilities';

import { type Handle } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

import type { Session, User } from '@supabase/supabase-js';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.getSessionAndUser = async (): Promise<{
		session: Session | null;
		user: User | null;
		user_role: string | null;
		coordinatesKYNG: string[] | null;
	}> => {
		try {
			const {
				data: { session }
			} = await event.locals.supabase.auth.getSession();
			if (!session) {
				return {
					session: null,
					user: null,
					user_role: null,
					coordinatesKYNG: null
				};
			}
			const {
				data: { user },
				error
			} = await event.locals.supabase.auth.getUser();
			if (error || !user) {
				console.error('Error fetching user:', error);
				return {
					session: null,
					user: null,
					user_role: null,
					coordinatesKYNG: null
				};
			}
			// const { user: _, ...sessionWithoutUser } = session;
			// console.log('user from hooks', user);
			// const sessionWithUserFromUser: Session = {
			// 	...sessionWithoutUser,
			// 	user: { ...user, id: user.id }
			// };
			const { user_role, coordinates_kyng } = JSON.parse(atob(session.access_token.split('.')[1]));

			// Fetch the permission from the role_permissions table
			// const { data: permissionData, error: permissionError } = await event.locals.supabase
			// 	.from('role_permissions')
			// 	.select('permission')
			// 	.eq('role', user_role)
			// 	.single();

			// if (permissionError) {
			// 	console.error('Error fetching permission:', permissionError);
			// 	return {
			// 		session: session,
			// 		user,
			// 		user_role,
			// 		coordinatesKYNG: null
			// 	};
			// }

			return {
				session,
				user,
				user_role,
				coordinatesKYNG: coordinates_kyng
			};
		} catch (error) {
			console.error('Error in getSessionAndUser:', error);
			return {
				session: null,
				user: null,
				user_role: null,
				coordinatesKYNG: null
			};
		}
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

// const authGuard: Handle = async ({ event, resolve }) => {
// 	const { session, user, permissions, coordinatesKYNG } = await event.locals.getSessionAndUser();
// 	event.locals.session = session;
// 	event.locals.user = user;
// 	event.locals.permissions = permissions;
// 	event.locals.coordinatesKYNG = coordinatesKYNG;

// 	if (!session && event.url.pathname.startsWith('/private')) {
// 		throw redirect(303, '/auth');
// 	}

// 	if (session && event.url.pathname === '/auth') {
// 		throw redirect(303, '/private');
// 	}

// 	return resolve(event);
// };

const originalConsoleWarn = console.warn;

console.warn = function (...args) {
	const shouldLog = args.every((arg) => {
		if (typeof arg === 'string') {
			return !arg.includes('Using the user object');
		}
		return true;
	});
	if (shouldLog) {
		originalConsoleWarn.apply(console, args);
	}
};

// const rateLimitMiddleware: Handle = async ({ event, resolve }) => {
// 	rateLimit(event.getClientAddress());
// 	return resolve(event);
// };

// const validateRequestMiddleware: Handle = async ({ event, resolve }) => {
// 	return validateRequest({ event, resolve });
// };

// export const handle: Handle = sequence(rateLimitMiddleware, validateRequestMiddleware, supabase);

export const handle: Handle = sequence(supabase);
