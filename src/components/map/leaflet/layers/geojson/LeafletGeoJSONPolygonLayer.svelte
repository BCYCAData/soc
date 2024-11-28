<script lang="ts">
	import { onMount, onDestroy, getContext, mount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import LeafletCustomPolygon from '$components/map/leaflet/symbology/LeafletCustomPolygon.svelte';
	import type {
		PolygonOptions,
		PolygonStyleFunction,
		LegendInfo,
		LayerInfo
	} from '$lib/leaflet/types';

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		editable: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		polygonOptions?: PolygonOptions | PolygonStyleFunction;
		propertyForStyle?: string;
		styleMap?: Record<string, PolygonOptions>;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		editable = false,
		staticLayer = false,
		showInLegend = true,
		polygonOptions = {},
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
	let geomanInitialized = false;

	onMount(() => {
		leaflet = getLeaflet();
		map = getLeafletMap();
		layersStore = getLeafletLayers();
		layersControl = getLayersControl();
		if (leaflet && map) {
			createGeoJSONLayer();
			initializeGeoman();
		}
	});

	function initializeGeoman() {
		if (map && editable && !geomanInitialized) {
			// Check if Geoman is available
			if (map.pm && typeof map.pm.addControls === 'function') {
				setupGeomanControls();
				geomanInitialized = true;
			} else {
				console.warn('Geoman controls not available for layer:', layerName);
			}
		}
	}

	function getPolygonOptions(feature: GeoJSON.Feature): PolygonOptions {
		if (typeof polygonOptions === 'function') {
			return polygonOptions(feature);
		}
		if (propertyForStyle && feature.properties && feature.properties[propertyForStyle]) {
			const styleKey = feature.properties[propertyForStyle];
			return { ...polygonOptions, ...styleMap[styleKey] };
		}
		return polygonOptions;
	}

	function createGeoJSONLayer() {
		const defaultGeojsonData = {
			type: 'FeatureCollection',
			features: []
		} as GeoJSON.FeatureCollection;

		const dataToUse = geojsonData?.features?.length ? geojsonData : defaultGeojsonData;

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			style: (feature) => getPolygonOptions(feature as GeoJSON.Feature<GeoJSON.Geometry, any>)
		});
		geoJSONLayer.addTo(map);

		const legendInfo = createLegendInfo();

		layersStore.update((layers) => ({
			...layers,
			[layerName]: {
				layer: geoJSONLayer,
				visible,
				editable,
				showInLegend,
				legendInfo
			}
		}));

		if (!staticLayer) {
			layersControl.subscribe((control) => {
				if (control) {
					control.addOverlay(geoJSONLayer, layerName);
				}
			});
		}

		if (editable) {
			enableEditing();
		}
	}

	function createLegendInfo(): LegendInfo {
		let legendItems;
		if (typeof polygonOptions === 'function') {
			legendItems = geojsonData.features.map((feature) => ({
				symbol: createLegendSymbol(polygonOptions(feature)),
				description: feature.properties?.[propertyForStyle ?? ''] || 'Feature'
			}));
		} else if (propertyForStyle && Object.keys(styleMap).length > 0) {
			legendItems = Object.entries(styleMap).map(([key, value]) => ({
				symbol: createLegendSymbol({ ...polygonOptions, ...value }),
				description: key
			}));
		} else {
			legendItems = [
				{
					symbol: createLegendSymbol(polygonOptions),
					description: layerName
				}
			];
		}
		return { items: legendItems };
	}

	function createLegendSymbol(options: PolygonOptions): string {
		const container = document.createElement('div');
		mount(LeafletCustomPolygon, {
			target: container,
			props: options as { [key: string]: any }
		});
		return container.innerHTML.trim();
	}

	function enableEditing() {
		if (geoJSONLayer?.pm) {
			geoJSONLayer.pm.enable({
				allowSelfIntersection: false
			});
		}
	}

	function disableEditing() {
		if (geoJSONLayer?.pm) {
			geoJSONLayer.pm.disable();
		}
	}

	function setupGeomanControls() {
		if (!map.pm?.Toolbar) return;

		const actions = ['add', 'edit', 'delete'] as const;
		actions.forEach((action) => {
			const controlName = `${layerName}-${action}`;
			const existingButtons = map.pm.Toolbar.getButtons();

			if (!existingButtons[controlName]) {
				map.pm.Toolbar.createCustomControl({
					name: controlName,
					block: 'custom',
					title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${layerName}`,
					onClick: () => handleGeomanAction(action),
					toggle: true,
					className: `custom-geoman-${action}-icon`
				});
			}
		});
	}

	function handleGeomanAction(action: 'add' | 'edit' | 'delete') {
		if (!geoJSONLayer?.pm) return;

		switch (action) {
			case 'add':
			case 'delete':
				geoJSONLayer.pm.enable();
				break;
			case 'edit':
				enableEditing();
				break;
		}
	}

	$effect(() => {
		if (geoJSONLayer) {
			if (editable) {
				enableEditing();
			} else {
				disableEditing();
			}
		}
	});

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
			disableEditing();
		}
	});
</script>
