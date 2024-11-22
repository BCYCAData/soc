<script lang="ts">
	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import SidebarAdminMenu from '$components/navigation/sidemenu/SidebarAdminMenu.svelte';
	import { adminSidebarPathLables, adminSidebarMenuItems } from '$lib/menu-items.js';
	import type { LayoutData } from './$types';
	import type { AdminMenuItem } from '$lib/types';
	import MessageContainer from '$components/message/MessageContainer.svelte';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let { adminMessages, permissions } = $derived(data);

	let filteredMenuItems: AdminMenuItem[] = $derived(
		adminSidebarMenuItems
			.filter((item: AdminMenuItem) => {
				if (isAdminMenuItem(item)) {
					return permissions?.includes(item.permission);
				}
				return true;
			})
			.map((item: AdminMenuItem) => {
				if (item.subItems) {
					return {
						...item,
						subItems: item.subItems.filter((subItem: AdminMenuItem) => {
							if (isAdminMenuItem(subItem)) {
								return permissions?.includes(subItem.permission);
							}
							return true;
						})
					};
				}
				return item;
			})
	);

	function isAdminMenuItem(item: AdminMenuItem): item is AdminMenuItem {
		return (
			(item as AdminMenuItem).permission !== undefined &&
			(item as AdminMenuItem).permission !== 'kyng'
		);
	}
</script>

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h2 class="h2 font-bold text-primary-600">Admin Dashboard</h2>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={adminSidebarPathLables} />
	</div>

	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Admin Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<SidebarAdminMenu siderbarMenuItems={filteredMenuItems} />
				</div>
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={adminMessages} />
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
		height: 100%;
	}
</style>
