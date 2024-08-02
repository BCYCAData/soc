<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type L from 'leaflet';

	interface Props {
		data: GeoJSON.GeoJsonObject;
		name?: string;
		children?: import('svelte').Snippet;
		onFeatureClick?: (event: { feature: GeoJSON.Feature; layer: L.Layer }) => void;
		onFeatureMouseover?: (event: { feature: GeoJSON.Feature; layer: L.Layer }) => void;
		onFeatureMouseout?: (event: { feature: GeoJSON.Feature; layer: L.Layer }) => void;
		onLayerCreated?: (layer: L.GeoJSON) => void;
	}

	let {
		data,
		name = 'GeoJSON Layer',
		children,
		onFeatureClick,
		onFeatureMouseover,
		onFeatureMouseout,
		onLayerCreated
	}: Props = $props();

	const { getLeafletMap } = getContext<{ getLeafletMap: () => L.Map }>('leafletMap');
	let leafletMap: L.Map;
	const { getLeaflet } = getContext<{ getLeaflet: () => typeof L }>('leaflet');
	let leaflet: typeof L;
	const layersStore: Writable<Record<string, L.Layer>> = getContext('layersStore');

	let layer: L.GeoJSON;

	const optionsStore: Writable<L.GeoJSONOptions> = writable({});
	setContext('layerOptions', optionsStore);

	onMount(() => {
		leaflet = getLeaflet();
		leafletMap = getLeafletMap();
		const unsubscribe = optionsStore.subscribe((options) => {
			if (layer) {
				layer.setStyle(options);
			} else {
				layer = leaflet
					.geoJSON(data, {
						...options,
						onEachFeature: (feature, layer) => {
							if (options.onEachFeature) {
								options.onEachFeature(feature, layer);
							}
							layer.on({
								click: (e) => onFeatureClick?.({ feature, layer: e.target }),
								mouseover: (e) => onFeatureMouseover?.({ feature, layer: e.target }),
								mouseout: (e) => onFeatureMouseout?.({ feature, layer: e.target })
							});
						}
					})
					.addTo(leafletMap);

				layersStore.update((layers) => ({ ...layers, [name]: layer }));
				onLayerCreated?.(layer);
			}
		});

		return () => {
			unsubscribe();
			if (layer && leafletMap) {
				leafletMap.removeLayer(layer);
				layersStore.update((layers) => {
					const { [name]: _, ...rest } = layers;
					return rest;
				});
			}
		};
	});

	export function getLayer(): L.GeoJSON | undefined {
		return layer;
	}
</script>

{@render children?.()}
