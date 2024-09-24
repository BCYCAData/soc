<script lang="ts">
	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarProfileMenu from '$components/navigation/sidemenu/SidebarProfileMenu.svelte';

	import { profileSidebarPathLables, profileSidebarMenuItems } from '$lib/menu-items';
	import type { ProfileMenuItem, ProfileMessageData } from '$lib/types';
	import type { PageData } from './$types';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let profileMessages: ProfileMessageData = $state(data.profileMessages);

	const profiles = {
		community_bcyca_profile: data?.user_profile.community_bcyca_profile?.bcyca_profile_id || null,
		community_tinonee_profile:
			data?.user_profile.community_tinonee_profile?.tinonee_profile_id || null,
		community_mondrook_profile:
			data?.user_profile.community_mondrook_profile?.mondrook_profile_id || null,
		community_external_profile:
			data?.user_profile.community_external_profile?.external_profile_id || null
	};

	type ProfileKey = keyof typeof profiles;
	const profileChecks: { key: ProfileKey; id: string }[] = [
		{ key: 'community_bcyca_profile', id: 'bcyca' },
		{ key: 'community_tinonee_profile', id: 'tinonee' },
		{ key: 'community_mondrook_profile', id: 'mondrook' },
		{ key: 'community_external_profile', id: 'external' }
	];

	const filterByIds = profileChecks
		.filter((check) => !profiles[check.key])
		.map((check) => check.id);

	const nonNullProfilesCount = Object.values(profiles).filter((profile) => profile !== null).length;
	let communityText = 'Community';
	if (nonNullProfilesCount > 1) {
		communityText = 'Communities';
	}

	const generateDynamicMenuItems = (properties: PropertyProfile[]): ProfileMenuItem[] => {
		const baseMenuItems = profileSidebarMenuItems('Community', properties);
		return [...baseMenuItems];
	};

	const dynamicProfileSidebarMenuItems = generateDynamicMenuItems(
		data.user_profile.property_profile
	);

	const filteredProfileSidebarMenuItems: ProfileMenuItem[] = dynamicProfileSidebarMenuItems
		.map((item): ProfileMenuItem => {
			if (item.id === 'my-community') {
				return {
					...item,
					subItems: item.subItems?.filter((subItem) => !filterByIds.includes(subItem.id))
				};
			}
			return item;
		})
		.filter(
			(item): item is ProfileMenuItem => item.icon !== null && typeof item.icon.icon !== 'string'
		);
</script>

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h2 class="h2 font-bold text-primary-600">Strengthen OUR Community</h2>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs
			pathLables={profileSidebarPathLables}
			properties={data.user_profile.property_profile}
		/>
	</div>
	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Profile Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<SidebarProfileMenu siderbarMenuItems={filteredProfileSidebarMenuItems} />
				</div>
				<p class="ml-2">
					Please make sure you click every heading in the menu on the left <br />
					<b>and</b>
					check your answers to all the questions.
				</p>
				<p class="ml-2">
					Remember this is <b>your</b>
					data. To help keep
					<b>you</b>
					prepared.
				</p>
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={profileMessages} />
		</div>
	</div>
</div>

<style lang="postcss">
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.app-shell-main {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.app-shell-sidebar-left,
	.app-shell-sidebar-right {
		overflow-y: auto;
	}

	.app-shell-content {
		flex: 1;
		overflow-y: auto;
	}
</style>
