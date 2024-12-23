import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

import {
	getCommunityOptions,
	type CommunityRequestOption,
	type TransformedOptionsData
} from '$lib/profileOptions';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch }
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch },
				cookies: {
					getAll: () => data.cookies || [],
					setAll: (cookieStrings) => {}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!session) {
		return {
			session,
			user,
			supabase,
			communityRequestOptions: []
		};
	}

	const communityRequestOptions: TransformedOptionsData = getCommunityOptions(
		data.communityRequestOptions?.filter(
			(item) => item.community_request_options_concordance !== null
		) as unknown as CommunityRequestOption[]
	);
	const optionsData = {
		userOptionsData: communityRequestOptions.find((item) => item.table_name === 'user_profile'),
		communityBCYCAOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_bcyca_profile'
		),
		communityExternalOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_external_profile'
		),
		communityMondrookOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_mondrook_profile'
		),
		communityTinoneeOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_tinonee_profile'
		)
	};

	return {
		session,
		supabase,
		user,
		isAdmin: data.isAdmin,
		coordinatesKYNG: data.coordinatesKYNG,
		optionsData
	};
};
