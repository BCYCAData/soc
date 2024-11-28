<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		items?: { id?: string; value: string; label: string }[];
		placeholder?: string;
		name?: string;
		required?: boolean;
		value?: string;
	}

	let {
		items = [],
		placeholder = 'Search...',
		name = '',
		required = false,
		value = $bindable('')
	}: Props = $props();

	let searchTerm = $state('');
	let showDropdown = $state(false);
	let inputElement: HTMLInputElement;

	let filteredItems = $derived(
		items.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)
	);

	function handleInput() {
		showDropdown = true;
		const selectedItem = items.find(
			(item) => (item.id && item.id === value) || item.value === value
		);
		if (selectedItem) {
			searchTerm = selectedItem.label;
		}
	}

	function handleSelect(item: (typeof items)[0]) {
		value = item.id || item.value;
		searchTerm = item.label;
		showDropdown = false;
		// Using dispatch event syntax
		const selectEvent = new CustomEvent('select', { detail: item });
		inputElement.dispatchEvent(selectEvent);
	}

	function handleFocus() {
		showDropdown = true;
	}

	function handleBlur() {
		setTimeout(() => {
			showDropdown = false;
			const selectedItem = items.find(
				(item) => (item.id && item.id === value) || item.value === value
			);
			if (!selectedItem) {
				searchTerm = '';
				value = '';
			}
		}, 200);
	}
</script>

<div class="relative">
	<input
		type="text"
		{name}
		{required}
		bind:this={inputElement}
		bind:value={searchTerm}
		{placeholder}
		oninput={handleInput}
		onfocus={handleFocus}
		onblur={handleBlur}
		class="w-full rounded border p-2"
	/>
	<input type="hidden" {name} {value} />

	{#if showDropdown && filteredItems.length > 0}
		<div
			transition:fade
			class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
		>
			{#each filteredItems as item}
				<button
					type="button"
					class="w-full px-4 py-2 text-left hover:bg-gray-100"
					onclick={() => handleSelect(item)}
				>
					{item.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
