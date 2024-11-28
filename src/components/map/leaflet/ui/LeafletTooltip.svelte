<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';

	import type L from 'leaflet';
	import type { Feature } from 'geojson';
	import type { Writable } from 'svelte/store';
	import type { LayerInfo } from '$lib/leaflet/types';

	interface Props {
		tooltipContent: string;
		layerName: string;
	}

	interface LeafletContext {
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
	}

	let { tooltipContent, layerName }: Props = $props();

	const { getLeaflet, getLeafletLayers } = getContext<LeafletContext>('leafletContext');

	let leaflet: typeof L;
	let layersStore: Writable<Record<string, LayerInfo>> = getLeafletLayers();
	let geoJSONLayer: L.GeoJSON;

	let unsubscribe: () => void;

	onMount(() => {
		if (layerName) {
			unsubscribe = layersStore.subscribe((currentLayers) => {
				if (currentLayers && currentLayers[layerName]?.layer) {
					leaflet = getLeaflet();
					geoJSONLayer = currentLayers[layerName].layer as L.GeoJSON;

					geoJSONLayer.eachLayer((layer) => {
						if (layer) {
							let content: string;

							if (tooltipContent) {
								content = tooltipContent;
							} else {
								const feature = (layer as any).feature as Feature;
								if (feature?.properties) {
									content = `
                                        <p>Address: ${feature.properties['Address'] ?? 'Not Known'}</p>
                                        <p>Alternate Addresses: ${feature.properties['Alternate Addresses'] ?? 'None'}</p>
                                        <p>Secondary Addresses: ${feature.properties['Secondary Addresses'] ?? 'None'}</p>
                                    `;
								} else {
									content = '<p>No Data</p>';
								}
							}

							const tooltipItem = leaflet.tooltip({});
							tooltipItem.setContent(content);
							layer.bindTooltip(tooltipItem);
						}
					});
				}
			});
		}
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}

		if (geoJSONLayer) {
			geoJSONLayer.eachLayer((layer) => {
				const tooltip = layer.getTooltip();
				if (tooltip) {
					tooltip.remove();
				}
			});
		}
	});
</script>
