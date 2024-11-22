<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let selectedRole = $state('');
	let newRole = $state('');
	let selectedPermissions = $state<string[]>([]);

	function flattenPermissions(tree: object, prefix = ''): string[] {
		return Object.entries(tree).flatMap(([key, value]) => {
			const currentPath = prefix ? `${prefix}.${key}` : key;
			if (Object.keys(value).length === 0) {
				return [currentPath];
			}
			return [currentPath, ...flattenPermissions(value, currentPath)];
		});
	}

	const allPermissions = flattenPermissions(data.permissionTree);

	function handleRoleSelect(role: string) {
		selectedRole = role;
		const roleData = data.rolePermissions.find((r) => r.role === role);
		selectedPermissions = roleData?.permission.split(',') || [];
	}

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	};

	const value = $state(['']);
</script>

<Accordion spaceY="space-y-1" {value} collapsible>
	<Accordion.Item value="0" classes="bg-orange-100 font-medium">
		{#snippet control()}Current Roles{/snippet}
		{#snippet panel()}
			{#each data.rolePermissions as { role }}
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<button
							class="text-left {selectedRole === role ? 'font-bold' : ''}"
							onclick={() => handleRoleSelect(role)}
						>
							{role}
						</button>
						<form method="POST" action="?/deleteRole" use:enhance={handleSubmit}>
							<input type="hidden" name="role" value={role} />
							<button type="submit" class="text-red-600 hover:text-red-800">Delete</button>
						</form>
					</div>

					{#if selectedRole === role}
						<div class="card bg-orange-50 p-4">
							<h2 class="mb-4 text-xl font-bold">Edit Permissions for {selectedRole}</h2>
							<form method="POST" action="?/updatePermissions" use:enhance class="space-y-4">
								<input type="hidden" name="role" value={selectedRole} />
								<div class="max-h-96 space-y-2 overflow-y-auto">
									{#each allPermissions as permission}
										<label class="flex items-center">
											<input
												type="checkbox"
												name="permissions"
												value={permission}
												bind:group={selectedPermissions}
											/>
											<span class="ml-2">{permission}</span>
										</label>
									{/each}
								</div>
								<input type="hidden" name="permissions" value={selectedPermissions.join(',')} />
								<button type="submit" class="btn-primary btn">Update Permissions</button>
							</form>
						</div>
					{/if}
				</div>
			{/each}
		{/snippet}
	</Accordion.Item>
	<Accordion.Item value="2" classes="bg-orange-100 font-medium">
		{#snippet control()}Add New Role{/snippet}
		{#snippet panel()}
			<form method="POST" action="?/addRole" use:enhance class="space-y-4">
				<div>
					<label for="role">Role Name</label>
					<input
						type="text"
						name="role"
						bind:value={newRole}
						class="w-full rounded border p-2"
						required
					/>
				</div>
				<div>
					<label for="permissions">Permissions</label>
					<div class="max-h-96 space-y-2 overflow-y-auto">
						{#each allPermissions as permission}
							<label class="flex items-center">
								<input
									type="checkbox"
									name="permissions"
									value={permission}
									bind:group={selectedPermissions}
								/>
								<span class="ml-2">{permission}</span>
							</label>
						{/each}
					</div>
				</div>
				<input type="hidden" name="permissions" value={selectedPermissions.join(',')} />
				<button type="submit" class="btn-primary btn">Add Role</button>
			</form>
		{/snippet}
	</Accordion.Item>
</Accordion>
