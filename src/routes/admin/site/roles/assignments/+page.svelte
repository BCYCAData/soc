<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	interface Role {
		id: bigint;
		user_id: string;
		role: string;
		email: string;
	}

	interface Permission {
		role: string;
		permission: string;
	}

	interface User {
		id: string;
		email: string;
	}

	let { data } = $props<{
		data: {
			roles: Role[];
			permissions: Permission[];
			users: User[];
		};
	}>();

	let selectedRole = $state('');
	let selectedUser = $state('');

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
		{#snippet control()}Current Role Assignments{/snippet}
		{#snippet panel()}
			<table class="w-full">
				<thead>
					<tr>
						<th>User</th>
						<th>Role</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.roles as role}
						<tr>
							<td>{role.email}</td>
							<td>{role.role}</td>
							<td>
								<form method="POST" action="?/removeRole" use:enhance={handleSubmit}>
									<input type="hidden" name="roleId" value={role.id} />
									<button type="submit" class="text-red-600 hover:text-red-800">Remove</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/snippet}
	</Accordion.Item>
	<Accordion.Item value="1" classes="bg-orange-100 font-medium">
		{#snippet control()}Assign New Role{/snippet}
		{#snippet panel()}
			<form method="POST" action="?/assignRole" use:enhance={handleSubmit} class="space-y-4">
				<div>
					<label for="userId">User</label>
					<select name="userId" bind:value={selectedUser} required>
						<option value="">Select User</option>
						{#each data.users as user}
							<option value={user.id}>{user.email}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="role">Role</label>
					<select name="role" bind:value={selectedRole} required>
						<option value="">Select Role</option>
						{#each [...new Set(data.permissions.map((p: Permission) => p.role))] as role}
							<option value={role}>{role}</option>
						{/each}
					</select>
				</div>
				<button type="submit" class="btn-primary btn">Assign Role</button>
			</form>
		{/snippet}
	</Accordion.Item>
</Accordion>
