<script lang="ts">
	import type { Component } from 'svelte';
	import { onMount } from 'svelte';
	import { ChevronDown } from 'lucide-svelte';

	interface ProfileMenuItem {
		id: string;
		name: string;
		link: string;
		icon: string;
		initialOpen?: boolean;
		subItems?: ProfileMenuItem[];
	}

	interface Props {
		siderbarMenuItems: ProfileMenuItem[];
	}

	let { siderbarMenuItems }: Props = $props();
	let activeSubmenus: string[] = $state(
		siderbarMenuItems.filter((item) => item.initialOpen).map((item) => item.id)
	);
	let activeSubSubmenus: { [key: string]: string[] } = $state({});
	let iconComponents: { [key: string]: Component | null } = {};

	onMount(async () => {
		for (const item of siderbarMenuItems) {
			await loadIcon(item.icon);
			if (item.subItems) {
				for (const subItem of item.subItems) {
					await loadIcon(subItem.icon);
					if (subItem.subItems) {
						for (const nestedSubItem of subItem.subItems) {
							await loadIcon(nestedSubItem.icon);
						}
					}
				}
			}
		}
	});

	async function loadIcon(iconName: string) {
		if (!iconComponents[iconName]) {
			try {
				const pascalCaseIconName = iconName
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join('');

				const module = await import(`lucide-svelte/icons/${pascalCaseIconName}.svelte`);
				iconComponents[iconName] = module.default;
			} catch (error) {
				console.error(`Failed to load icon: ${iconName}`, error);
				iconComponents[iconName] = null;
			}
		}
	}

	function toggleSubmenu(id: string) {
		if (activeSubmenus.includes(id)) {
			activeSubmenus = activeSubmenus.filter((item) => item !== id);
		} else {
			activeSubmenus = [id];
		}
		activeSubSubmenus[id] = [];
	}

	function toggleSubSubmenu(parentId: string, id: string) {
		if (activeSubSubmenus[parentId]?.includes(id)) {
			activeSubSubmenus[parentId] = activeSubSubmenus[parentId].filter((item) => item !== id);
		} else {
			activeSubSubmenus[parentId] = [id];
		}
	}
</script>

<div class="flex flex-col rounded-lg bg-orange-600">
	{#each siderbarMenuItems as item}
		<div>
			<a
				role="button"
				tabindex="0"
				href={item.link}
				class="menu-item flex cursor-pointer items-center rounded-full p-2"
				onclick={() => toggleSubmenu(item.id)}
				onkeydown={() => toggleSubmenu(item.id)}
			>
				{#if iconComponents[item.icon]}
					<svelte:component this={iconComponents[item.icon]} class="text-2xl text-stone-50" />
				{/if}
				<span class="ml-2 text-stone-50">{item.name}</span>
				{#if item.subItems}
					<ChevronDown
						class="caret ml-auto {activeSubmenus.includes(item.id) ? 'rotate' : ''}"
						size={24}
						color="#FAFAF9"
						strokeWidth={2}
					/>
				{/if}
			</a>
			{#if activeSubmenus.includes(item.id) && item.subItems}
				<div class="submenu pl-5">
					{#each item.subItems as subItem}
						<div>
							<a
								role="button"
								tabindex="0"
								href={subItem.link}
								class="menu-item flex cursor-pointer items-center rounded-full p-2"
								onclick={() => toggleSubSubmenu(item.id, subItem.id)}
								onkeydown={() => toggleSubSubmenu(item.id, subItem.id)}
							>
								{#if iconComponents[subItem.icon]}
									<svelte:component
										this={iconComponents[subItem.icon]}
										class="text-2xl text-stone-50"
									/>
								{/if}
								<span class="ml-2 text-stone-50">{subItem.name}</span>
								{#if subItem.subItems}
									<ChevronDown
										class="caret ml-auto {activeSubSubmenus[item.id]?.includes(subItem.id)
											? 'rotate'
											: ''}"
										size={24}
										color="#FAFAF9"
										strokeWidth={2}
									/>
								{/if}
							</a>
							{#if activeSubSubmenus[item.id]?.includes(subItem.id) && subItem.subItems}
								<div class="submenu pl-5">
									{#each subItem.subItems as nestedSubItem}
										<div>
											<a
												role="button"
												tabindex="0"
												href={nestedSubItem.link}
												class="menu-item flex cursor-pointer items-center rounded-full p-2"
												onclick={() => toggleSubSubmenu(subItem.id, nestedSubItem.id)}
												onkeydown={() => toggleSubSubmenu(subItem.id, nestedSubItem.id)}
											>
												{#if iconComponents[nestedSubItem.icon]}
													<svelte:component
														this={iconComponents[nestedSubItem.icon]}
														class="text-2xl text-stone-50"
													/>
												{/if}
												<span class="ml-2 text-stone-50">{nestedSubItem.name}</span>
											</a>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.menu-item:hover {
		background-color: #fdba74;
		transform: scale(1.02);
	}
	.caret.rotate {
		transform: rotate(90deg);
	}
</style>
