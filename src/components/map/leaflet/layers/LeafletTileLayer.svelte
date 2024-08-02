<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';

	import type L from 'leaflet';

	interface Props {
		url: string;
		attribution: string;
		layerOptions?: L.TileLayerOptions;
	}

	let { url, attribution, layerOptions = {} }: Props = $props();

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();

	let tileLayer: L.TileLayer;

	onMount(() => {
		tileLayer = leaflet.tileLayer(url, { ...layerOptions, attribution }).addTo(leafletMap);
	});

	onDestroy(() => {
		if (leafletMap && tileLayer) {
			leafletMap.removeLayer(tileLayer);
		}
	});
</script>
