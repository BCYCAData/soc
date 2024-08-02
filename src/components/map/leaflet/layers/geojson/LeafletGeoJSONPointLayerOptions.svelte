<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';

	interface Props {
		icon?: L.Icon | L.DivIcon | undefined;
		radius?: number;
		color?: string;
	}

	let { icon = undefined, radius = 5, color = '#3388ff' }: Props = $props();

	const optionsStore: Writable<L.GeoJSONOptions> = getContext('layerOptions');

	onMount(() => {
		$optionsStore = {
			pointToLayer: (feature, latlng) => {
				const { getLeaflet } = getContext<{ getLeaflet: () => typeof L }>('leaflet');
				const leaflet = getLeaflet();
				if (icon) {
					return leaflet.marker(latlng, { icon });
				} else {
					return leaflet.circleMarker(latlng, { radius, color });
				}
			}
		};

		return () => {
			// Reset the optionsStore to its default state when the component is destroyed
			$optionsStore = {};
		};
	});
</script>
