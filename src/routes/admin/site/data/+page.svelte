<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let selectedTemplate: any = $state(null);
	let editMode = $state(false);
	let showFieldsModal = $state(false);

	let templates = $derived(data.templates);
	let { geometryTypes, fieldTypes, categories } = $derived(data.initialData);

	function handleTemplateSelect(template: any) {
		selectedTemplate = template;
		editMode = true;
	}

	function resetForm() {
		selectedTemplate = null;
		editMode = false;
	}
</script>

<svelte:head>
	<title>Site Data Administration</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Feature Templates Management</h1>

	<!-- Template List -->
	<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each templates as template}
			<div
				class="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
				onclick={() => handleTemplateSelect(template)}
				onkeydown={(e) => e.key === 'Enter' && handleTemplateSelect(template)}
				tabindex="0"
				role="button"
			>
				<h3 class="font-semibold">{template.name}</h3>
				<p class="text-sm text-gray-600">{template.description}</p>
				<div class="mt-2 flex gap-2">
					<span class="rounded bg-blue-100 px-2 py-1 text-xs">
						{template.geometry_type}
					</span>
					<span class="rounded bg-green-100 px-2 py-1 text-xs">
						{template.category}
					</span>
				</div>
				<div class="mt-2 text-sm">
					Fields: {template.template_fields?.length || 0}
				</div>
			</div>
		{/each}
	</div>

	<!-- Template Form -->
	<form
		method="POST"
		action={editMode ? '?/updateTemplate' : '?/createTemplate'}
		use:enhance
		class="mx-auto max-w-lg rounded-lg border p-6"
	>
		{#if editMode}
			<input type="hidden" name="id" value={selectedTemplate.id} />
		{/if}

		<div class="space-y-4">
			<div>
				<label for="name" class="block text-sm font-medium">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={selectedTemplate?.name || ''}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium">Description</label>
				<textarea
					id="description"
					name="description"
					value={selectedTemplate?.description || ''}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					rows="3"
				></textarea>
			</div>

			<div>
				<label for="geometry_type" class="block text-sm font-medium">Geometry Type</label>
				<select
					id="geometry_type"
					name="geometry_type"
					value={selectedTemplate?.geometry_type || ''}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				>
					{#each geometryTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium">Category</label>
				<select
					id="category"
					name="category"
					value={selectedTemplate?.category || ''}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>

			{#if editMode}
				<div>
					<label class="flex items-center">
						<input
							type="checkbox"
							name="is_active"
							checked={selectedTemplate?.is_active}
							class="rounded border-gray-300"
						/>
						<span class="ml-2 text-sm">Active</span>
					</label>
				</div>
			{/if}

			<div class="flex gap-4">
				<button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
					{editMode ? 'Update' : 'Create'} Template
				</button>

				{#if editMode}
					<button
						type="button"
						onclick={() => (showFieldsModal = true)}
						class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Manage Fields
					</button>

					<button
						type="button"
						onclick={resetForm}
						class="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
					>
						Cancel
					</button>
				{/if}
			</div>
		</div>
	</form>

	<!-- Fields Modal -->
	{#if showFieldsModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
				<h2 class="mb-4 text-xl font-bold">Manage Template Fields</h2>

				<form method="POST" action="?/manageFields" use:enhance class="space-y-4">
					<input type="hidden" name="template_id" value={selectedTemplate.id} />

					<!-- Fields management interface -->
					<!-- Add your fields management UI here -->

					<div class="flex justify-end gap-4">
						<button
							type="button"
							onclick={() => (showFieldsModal = false)}
							class="rounded-md bg-gray-200 px-4 py-2 text-gray-800"
						>
							Close
						</button>
						<button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white">
							Save Fields
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
