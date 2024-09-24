<script lang="ts">
	import { onMount, onDestroy, getContext, mount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import LeafletCustomMarker from '$components/map/leaflet/symbology/LeafletCustomMarker.svelte';

	interface LegendItem {
		symbol: string;
		description: string;
	}

	interface GroupedLegendItem {
		groupName: string;
		items: LegendItem[];
	}

	interface LegendInfo {
		items: (LegendItem | GroupedLegendItem)[];
	}

	interface LayerInfo {
		layer: L.Layer;
		visible: boolean;
		editable: boolean;
		showInLegend: boolean;
		legendInfo: LegendInfo;
	}

	type MarkerShape =
		| 'text'
		| 'circle'
		| 'square'
		| 'star'
		| 'triangle'
		| 'triangle-down'
		| 'wye'
		| 'diamond'
		| 'concentric-circle'
		| 'concentric-square'
		| 'concentric-triangle'
		| 'concentric-diamond';

	interface MarkerOptions {
		markerShape?: MarkerShape;
		fillColour?: string;
		fillOpacity?: number;
		size?: number;
		strokeColour?: string;
		strokeOpacity?: number;
		strokeWidth?: number;
	}

	type MarkerStyleFunction = (feature: GeoJSON.Feature) => MarkerOptions;

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		editable: boolean;
		markerOptions?: MarkerOptions | MarkerStyleFunction;
		propertyForSymbol?: string;
		symbolMap?: Record<string, MarkerOptions>;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		editable = false,
		staticLayer = false,
		showInLegend = true,
		markerOptions = {},
		propertyForSymbol,
		symbolMap = {}
	}: Props = $props();

	const { getLeaflet, getLeafletMap, getLeafletLayers, getLayersControl } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
		getLayersControl: () => Writable<L.Control.Layers | null>;
	}>('leafletContext');

	let leaflet: typeof L;
	let map: L.Map;
	let layersStore: Writable<Record<string, LayerInfo>>;
	let layersControl: Writable<L.Control.Layers | null>;
	let geoJSONLayer: L.GeoJSON;

	onMount(() => {
		leaflet = getLeaflet();
		map = getLeafletMap();
		layersStore = getLeafletLayers();
		layersControl = getLayersControl();
		if (leaflet && map) {
			createGeoJSONLayer();
		}
	});

	function getMarkerOptions(feature: GeoJSON.Feature): MarkerOptions {
		if (typeof markerOptions === 'function') {
			return markerOptions(feature);
		}
		if (propertyForSymbol && feature.properties && feature.properties[propertyForSymbol]) {
			const symbolKey = feature.properties[propertyForSymbol];
			return { ...markerOptions, ...symbolMap[symbolKey] };
		}
		return markerOptions;
	}

	function cleanupGeneratedHtml(html: string): string {
		let cleanHtml = html.replace(/<!--(.*?)-->/g, '');
		cleanHtml = cleanHtml.trim();
		if (!cleanHtml) {
			console.warn('Generated marker HTML is empty after cleaning');
			return '<div class="empty-marker"></div>';
		}
		return cleanHtml;
	}

	function createCustomMarker(options: MarkerOptions): string {
		const container = document.createElement('div');
		mount(LeafletCustomMarker, {
			target: container,
			props: {
				...options,
				children: undefined
			}
		});
		const cleanHtml = cleanupGeneratedHtml(container.innerHTML);
		return cleanHtml;
	}

	function createGeoJSONLayer() {
		geoJSONLayer = leaflet.geoJSON(geojsonData, {
			pointToLayer: (feature, latlng) => {
				const options = getMarkerOptions(feature);
				const markerHtml = createCustomMarker(options);
				return leaflet.marker(latlng, {
					icon: leaflet.divIcon({
						html: markerHtml,
						className: 'custom-geojson-marker',
						iconSize: [options.size ?? 10, options.size ?? 10],
						iconAnchor: [(options.size ?? 10) / 2, (options.size ?? 10) / 2]
					})
				});
			}
		});
		geoJSONLayer.addTo(map);
		let legendItems: LegendItem[];
		console.log('typeof markerOptions', markerOptions);
		if (typeof markerOptions === 'function') {
			legendItems = geojsonData.features.map((feature) => {
				const options = markerOptions(feature);
				return {
					symbol: createCustomMarker(options),
					description:
						feature.properties && propertyForSymbol
							? feature.properties[propertyForSymbol]
							: 'Feature'
				};
			});
		} else if (propertyForSymbol && Object.keys(symbolMap).length > 0) {
			legendItems = Object.entries(symbolMap).map(([key, value]) => ({
				symbol: createCustomMarker({ ...markerOptions, ...value }),
				description: key
			}));
		} else {
			legendItems = [
				{
					symbol: createCustomMarker(markerOptions),
					description: layerName
				}
			];
		}

		const legendInfo: LegendInfo = {
			items: legendItems
		};

		layersStore.update((layers) => ({
			...layers,
			[layerName]: {
				layer: geoJSONLayer,
				visible: visible,
				editable: editable,
				showInLegend: showInLegend,
				legendInfo: legendInfo
			}
		}));

		if (!staticLayer) {
			layersControl.subscribe((control) => {
				if (control) {
					control.addOverlay(geoJSONLayer, layerName);
				}
			});
		}
	}
	$effect(() => {
		if (geoJSONLayer && geojsonData) {
			geoJSONLayer.clearLayers();
			geoJSONLayer.addData(geojsonData);
		}
	});

	onDestroy(() => {
		if (geoJSONLayer) {
			geoJSONLayer.remove();
			layersStore.update((layers) => {
				const { [layerName]: _, ...rest } = layers;
				return rest;
			});
			if (!staticLayer) {
				layersControl.subscribe((control) => {
					if (control) {
						control.removeLayer(geoJSONLayer);
					}
				});
			}
		}
	});
</script>

<!-- To use this for classified symbols:
 
// Property to use for symbolization
const propertyForSymbol = 'category';

// Symbol map defining styles for each category
const symbolMap = {
  'category1': { markerShape: 'circle', fillColour: 'red', size: 12 },
  'category2': { markerShape: 'square', fillColour: 'blue', size: 14 },
  'category3': { markerShape: 'triangle', fillColour: 'green', size: 16 },
}; -->
