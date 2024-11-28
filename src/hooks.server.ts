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
		user_roles: string[] | null;
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
					user_roles: null,
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
					user_roles: null,
					coordinatesKYNG: null
				};
			}

			const { user_roles, coordinates_kyng } = JSON.parse(atob(session.access_token.split('.')[1]));
			console.log('hooks coordinates_kyng', coordinates_kyng);
			return {
				session,
				user,
				user_roles,
				coordinatesKYNG: coordinates_kyng
			};
		} catch (error) {
			console.error('Error in getSessionAndUser:', error);
			return {
				session: null,
				user: null,
				user_roles: null,
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
