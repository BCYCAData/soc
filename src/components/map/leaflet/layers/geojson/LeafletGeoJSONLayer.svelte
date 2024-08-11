<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import type L from 'leaflet';

	const {
		data,
		options = {},
		name = 'GeoJSON Layer'
	} = $props<{
		data: GeoJSON.GeoJsonObject;
		options?: L.GeoJSONOptions;
		name?: string;
	}>();

	const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Record<string, L.Layer>;
	}>('leafletContext');

	let layer: L.GeoJSON;

	$effect.pre(() => {
		const leaflet = getLeaflet();
		const leafletMap = getLeafletMap();
		if (leafletMap) {
			if (layer) leafletMap.removeLayer(layer);
			layer = leaflet.geoJSON(data, options).addTo(leafletMap);
			getLeafletLayers()[name] = layer;
		}
	});

	onDestroy(() => {
		if (layer) {
			getLeafletMap().removeLayer(layer);
			delete getLeafletLayers()[name];
		}
	});
</script>
