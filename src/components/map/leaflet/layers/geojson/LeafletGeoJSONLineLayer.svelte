<script lang="ts">
	import { onMount, onDestroy, getContext, mount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import LeafletCustomLine from '$components/map/leaflet/symbology/LeafletCustomLine.svelte';

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

	type PolygonStyleFunction = (feature: GeoJSON.Feature) => L.PathOptions;

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		editable: boolean;
		lineOptions?: L.PathOptions | PolygonStyleFunction;
		propertyForStyle?: string;
		styleMap?: Record<string, L.PathOptions>;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		staticLayer = false,
		showInLegend = true,
		editable = false,
		lineOptions = {},
		propertyForStyle,
		styleMap = {}
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

	function getPolygonOptions(feature: GeoJSON.Feature): L.PathOptions {
		if (typeof lineOptions === 'function') {
			return lineOptions(feature);
		}
		if (propertyForStyle && feature.properties && feature.properties[propertyForStyle]) {
			const styleKey = feature.properties[propertyForStyle];
			return { ...lineOptions, ...styleMap[styleKey] };
		}
		return lineOptions;
	}

	function createGeoJSONLayer() {
		geoJSONLayer = leaflet.geoJSON(geojsonData, {
			style: (feature) => getPolygonOptions(feature as GeoJSON.Feature<GeoJSON.Geometry, any>)
		});
		geoJSONLayer.addTo(map);

		let legendItems: LegendItem[];
		if (typeof lineOptions === 'function') {
			legendItems = geojsonData.features.map((feature) => {
				const options = lineOptions(feature as GeoJSON.Feature<GeoJSON.Geometry, any>);
				return {
					symbol: createLegendSymbol(options),
					description:
						feature.properties && propertyForStyle
							? feature.properties[propertyForStyle]
							: 'Feature'
				};
			});
		} else if (propertyForStyle && Object.keys(styleMap).length > 0) {
			legendItems = Object.entries(styleMap).map(([key, value]) => ({
				symbol: createLegendSymbol({ ...lineOptions, ...value }),
				description: key
			}));
		} else {
			legendItems = [
				{
					symbol: createLegendSymbol(lineOptions),
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

	function createLegendSymbol(options: L.PathOptions): string {
		const container = document.createElement('div');
		mount(LeafletCustomLine, {
			target: container,
			props: options as { [key: string]: any }
		});
		return container.innerHTML.trim();
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
