import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSessionAndUser: () => Promise<{
				session: Session | null;
				user: User | null;
				user_roles: string[] | null;
				coordinatesKYNG: string[] | null;
			}>;
			session: Session | null;
			user: User | null;
			user_roles: string[] | null;
			coordinatesKYNG: string[] | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
