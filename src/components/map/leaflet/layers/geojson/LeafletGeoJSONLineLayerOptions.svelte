<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';

	interface Props {
		color?: string;
		weight?: number;
		dashArray: string | undefined;
	}

	let { color = '#3388ff', weight = 3, dashArray = undefined }: Props = $props();

	const optionsStore: Writable<L.GeoJSONOptions> = getContext('layerOptions');

	onMount(() => {
		$optionsStore = {
			style: {
				color,
				weight,
				dashArray
			}
		};

		return () => {
			// Reset the optionsStore to its default state when the component is destroyed
			$optionsStore = {};
		};
	});
</script>
