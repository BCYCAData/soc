<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';

	import type L from 'leaflet';

	interface Props {
		url: string;
		attribution: string;
		layerOptions?: L.TileLayerOptions;
	}

	let { url, attribution, layerOptions = {} }: Props = $props();

	const { getLeaflet, getLeafletMap } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Record<string, L.Layer>;
	}>('leafletContext');

	let tileLayer: L.TileLayer;

	$effect(() => {
		const leaflet = getLeaflet();
		const leafletMap = getLeafletMap();
		tileLayer = leaflet.tileLayer(url, { ...layerOptions, attribution }).addTo(leafletMap);

		return () => {
			if (leafletMap && tileLayer) {
				leafletMap.removeLayer(tileLayer);
			}
		};
	});
</script>
