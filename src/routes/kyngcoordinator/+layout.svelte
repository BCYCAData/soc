<script lang="ts">
	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarKyngMenu from '$components/navigation/sidemenu/SidebarKYNGMenu.svelte';
	import { kyngSidebarPathLables, kyngSidebarMenuItems } from '$lib/menu-items.js';
	import type { AdminMenuItem } from '$lib/types.js';

	interface Props {
		data: any;
		children?: import('svelte').Snippet;
	}
	interface KYNGArea {
		kyngAreaId: string;
		kyngName: string;
	}
	let { data, children }: Props = $props();
	let { kyngMessages, coordinatesKYNG } = data;

	let modifiedMenuItems: AdminMenuItem[] = $derived(
		coordinatesKYNG.flatMap((area: KYNGArea) =>
			kyngSidebarMenuItems.map((menuItem) => {
				const updatedMenuItem = { ...menuItem };
				if (updatedMenuItem.link?.includes('{kyng_area}')) {
					updatedMenuItem.link = updatedMenuItem.link.replace('{kyng_area}', area.kyngAreaId);
				}
				if (updatedMenuItem.name?.includes('Area Name')) {
					updatedMenuItem.name = area.kyngName;
				}
				if (updatedMenuItem.subItems) {
					updatedMenuItem.subItems = updatedMenuItem.subItems.map((subItem) => {
						const updatedSubItem = { ...subItem };
						if (updatedSubItem.link?.includes('{kyng_area}')) {
							updatedSubItem.link = updatedSubItem.link.replace('{kyng_area}', area.kyngAreaId);
						}
						if (updatedSubItem.name?.includes('Area Name')) {
							updatedSubItem.name = area.kyngName;
						}
						return updatedSubItem;
					});
				}
				return updatedMenuItem;
			})
		)
	);
</script>

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h3 class="font-bold text-orange-900">Burrell Creek Youth & Community Association Inc.</h3>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={kyngSidebarPathLables} />
	</div>

	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Coordinator Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<SidebarKyngMenu siderbarMenuItems={modifiedMenuItems} />
				</div>
				<div class="text-l flex flex-row justify-around pt-2">Un-Registered Properties</div>
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={kyngMessages} />
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
