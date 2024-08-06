<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import type L from 'leaflet';

	interface Props {
		data: GeoJSON.GeoJsonObject;
		name?: string;
		options?: L.GeoJSONOptions;
		children?: import('svelte').Snippet;
		onLayerCreated?: (layer: L.GeoJSON) => void;
	}

	let { data, name = 'GeoJSON Layer', options = {}, children, onLayerCreated }: Props = $props();

	const { getLeaflet, getLeafletMap, updateLayersList, updateLayersOptionsList } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		updateLayersList: (layerName: string, layer: L.Layer | null) => void;
		updateLayersOptionsList: (layerName: string, layerOptions: L.GeoJSONOptions | null) => void;
	}>('leafletContext');

	let layer: L.GeoJSON;

	onMount(() => {
		const leaflet = getLeaflet();
		const leafletMap = getLeafletMap();
		layer = leaflet
			.geoJSON(data, {
				...options,
				onEachFeature: (feature, layer) => {
					if (options.onEachFeature) {
						options.onEachFeature(feature, layer);
					}
				}
			})
			.addTo(leafletMap);
		updateLayersList(name, layer);
		updateLayersOptionsList(name, options);
		onLayerCreated?.(layer);

		return () => {
			if (layer && leafletMap) {
				leafletMap.removeLayer(layer);
				updateLayersList(name, null);
			}
		};
	});

	export function getLayer(): L.GeoJSON | undefined {
		return layer;
	}
</script>

{@render children?.()}
