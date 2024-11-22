<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		itemLabel: string;
		highlighted: boolean;
	}

	let { itemLabel, highlighted }: Props = $props();

	// Create event dispatcher for click events
	const dispatch = createEventDispatcher<{
		click: void;
	}>();

	function handleClick() {
		dispatch('click');
	}
</script>

<button class="autocomplete-items" class:autocomplete-active={highlighted} onclick={handleClick}>
	{@html itemLabel}
</button>

<style>
	button.autocomplete-items {
		list-style: none;
		border-bottom: 1px solid #d4d4d4;
		z-index: 99;
		top: 100%;
		left: 0;
		right: 0;
		padding: 10px;
		cursor: pointer;
		background-color: #fff;
		width: 100%;
		text-align: left;
		border: none;
	}

	button.autocomplete-items:hover {
		background-color: #fba74c;
		color: white;
	}

	button.autocomplete-items:active {
		background-color: #fba74c !important;
		color: #ffffff;
	}

	.autocomplete-active {
		background-color: #fba74c !important;
		color: #ffffff;
	}
</style>
