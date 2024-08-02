<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';

	interface Props {
		fillColor?: string;
		fillOpacity?: number;
		color?: string;
		weight?: number;
	}

	let { fillColor = '#3388ff', fillOpacity = 0.2, color = '#3388ff', weight = 1 }: Props = $props();

	const optionsStore: Writable<L.GeoJSONOptions> = getContext('layerOptions');

	onMount(() => {
		$optionsStore = {
			style: {
				fillColor,
				fillOpacity,
				color,
				weight
			}
		};

		return () => {
			// Reset the optionsStore to its default state when the component is destroyed
			$optionsStore = {};
		};
	});
</script>
