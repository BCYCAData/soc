<script lang="ts">
	// import { AppShell } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarProfileMenu from '$components/navigation/sidemenu/SidebarProfileMenu.svelte';

	// import 'iconify-icon';

	import { profileSidebarPathLables, profileSidebarMenuItems } from '$lib/menu-items';
	import type { ProfileMenuItem } from '$lib/types';

	// let classesHeader = $derived('w-full');
	// let classesPageHeader = $derived('w-full');
	// let classesSidebarLeft = $derived('w-1/6 bg-stone-200');
	// let classesMain = $derived('mx-4');
	// let classesSidebarRight = $derived('w-1/6  bg-stone-200');

	interface Props {
		data: any;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let profileMessagesData: { id: number; message: string; created_at: string }[] = $state([]);

	if (data?.profileMessagesData) {
		profileMessagesData = data.profileMessagesData;
	}

	const profiles = {
		community_bcyca_profile: data.communityProfiles?.community_bcyca_profile_id,
		community_tinonee_profile: data.communityProfiles?.community_tinonee_profile_id,
		community_mondrook_profile: data.communityProfiles?.community_mondrook_profile_id,
		community_external_profile: data.communityProfiles?.community_external_profile_id
	};

	const filterByIds: string[] = [];

	if (!profiles.community_bcyca_profile) {
		filterByIds.push('bcyca');
	}
	if (!profiles.community_tinonee_profile) {
		filterByIds.push('tinonee');
	}
	if (!profiles.community_mondrook_profile) {
		filterByIds.push('mondrook');
	}
	if (!profiles.community_external_profile) {
		filterByIds.push('external');
	}

	const nonNullProfilesCount = Object.values(profiles).filter((profile) => profile !== null).length;
	let communityText = 'Community';
	if (nonNullProfilesCount > 1) {
		communityText = 'Communities';
	}

	const filteredProfileSidebarMenuItems = profileSidebarMenuItems('My Community').map((item) => {
		if (item.id === 'my-community') {
			return {
				...item,
				subItems: item.subItems?.filter((subItem) => !filterByIds.includes(subItem.id))
			};
		}
		return { ...item };
	});
</script>

<div class="app-shell bg-orange-200">
	<header
		class="app-shell-header mx-auto flex max-h-[45px] min-h-[45px] items-center bg-orange-100"
	>
		<h3 class="mx-auto font-bold text-orange-900">Strengthen OUR Community</h3>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={profileSidebarPathLables} />
	</div>
	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Profile Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<SidebarProfileMenu
						siderbarMenuItems={filteredProfileSidebarMenuItems.filter(
							(item): item is ProfileMenuItem => item.icon !== null && typeof item.icon === 'string'
						)}
					/>
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
			<MessageContainer messagesData={profileMessagesData} />
		</div>
	</div>
</div>

<style lang="postcss">
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.app-shell-header {
		/* Add any additional styles for the header */
	}

	.app-shell-breadcrumbs {
		/* Add styles for the breadcrumbs container if needed */
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
