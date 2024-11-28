<script lang="ts">
	import { onMount, onDestroy, getContext, mount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import LeafletCustomMarker from '$components/map/leaflet/symbology/LeafletCustomMarker.svelte';
	import type {
		PointSymbologyOptions,
		AddressPointSymbologyOptions,
		CustomMarkerOptions,
		LeafletMarkerOptions,
		LegendItem,
		GroupedLegendItem,
		LegendInfo,
		LayerInfo
	} from '$lib/leaflet/types';

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		editable: boolean;
		symbology: PointSymbologyOptions | AddressPointSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, PointSymbologyOptions>;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		editable = false,
		staticLayer = false,
		showInLegend = true,
		symbology,
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
	let tooltipDirectionCounter: { [key: string]: number } = {};

	function getTooltipDirection(latlng: L.LatLng): L.TooltipOptions['direction'] {
		if (!tooltipDirectionCounter[latlng.toString()]) {
			tooltipDirectionCounter[latlng.toString()] = 0;
		}
		let directionIndex = tooltipDirectionCounter[latlng.toString()]++;
		return ['right', 'left', 'top', 'bottom', 'center'][
			directionIndex % 5
		] as L.TooltipOptions['direction'];
	}

	function createPointLayer(feature: GeoJSON.Feature, latlng: L.LatLng): L.Layer {
		if (symbology.type === 'custom') {
			const customOptions = symbology.options as CustomMarkerOptions;
			return leaflet.circleMarker(latlng, {
				radius: customOptions.size || 1,
				fillColor: customOptions.fillColour,
				color: customOptions.strokeColour,
				weight: customOptions.strokeWidth,
				opacity: customOptions.strokeOpacity,
				fillOpacity: customOptions.fillOpacity
			});
		}
		if (symbology.type === 'addressPoint') {
			const htmlContent = symbology.getSymbol(feature);
			return leaflet.marker(latlng, {
				icon: leaflet.divIcon({
					className: 'diamond-marker',
					iconAnchor: [3, 6],
					html: htmlContent
				})
			});
		}

		const leafletOptions = symbology.options as LeafletMarkerOptions;
		switch (leafletOptions.type) {
			case 'circle':
				return leaflet.circle(latlng, leafletOptions.options as L.CircleOptions);
			case 'circleMarker':
				return leaflet.circleMarker(latlng, leafletOptions.options as L.CircleMarkerOptions);
			case 'marker':
				return leaflet.marker(latlng, leafletOptions.options as L.MarkerOptions);
			case 'divIcon':
				return leaflet.marker(latlng, {
					icon: leaflet.divIcon(leafletOptions.options as L.DivIconOptions)
				});
			default:
				return leaflet.marker(latlng);
		}
	}

	function createGeoJSONLayer() {
		const defaultGeojsonData = {
			type: 'FeatureCollection',
			features: []
		} as GeoJSON.FeatureCollection;

		const dataToUse = geojsonData?.features?.length ? geojsonData : defaultGeojsonData;

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			pointToLayer: (feature, latlng) => {
				const layer = createPointLayer(feature, latlng);

				if (feature.properties?.['House Number']) {
					const direction = getTooltipDirection(latlng);
					layer.bindTooltip(feature.properties['House Number'], {
						permanent: true,
						direction,
						className: 'custom-label',
						offset: [-7, -10]
					});
				}

				return layer;
			}
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
	}

	function createLegendInfo(): LegendInfo {
		let legendItems: LegendItem[];

		if (symbology.type === 'addressPoint') {
			legendItems = [
				{
					symbol: symbology.getSymbol({ properties: {} } as GeoJSON.Feature),
					description: layerName
				}
			];
		} else {
			// Handle standard point symbology legend
			legendItems = [
				{
					symbol: createLegendSymbol(symbology.options as LeafletMarkerOptions),
					description: layerName
				}
			];
		}

		return { items: legendItems };
	}

	function createLegendSymbol(options: LeafletMarkerOptions): string {
		const container = document.createElement('div');

		// Map Leaflet marker types to custom marker shapes
		const markerTypeToShape = {
			circle: 'circle',
			marker: 'circle',
			circleMarker: 'circle',
			divIcon: 'circle'
		} as const;

		// Get the appropriate options based on marker type
		const getMarkerOptions = (opts: LeafletMarkerOptions) => {
			switch (opts.type) {
				case 'circleMarker':
					const circleOpts = opts.options as L.CircleMarkerOptions;
					return {
						markerShape: markerTypeToShape[opts.type],
						fillColour: circleOpts.fillColor || '#3388ff',
						fillOpacity: circleOpts.fillOpacity || 1,
						size: circleOpts.radius || 10,
						strokeColour: circleOpts.color || '#3388ff',
						strokeOpacity: circleOpts.opacity || 1,
						strokeWidth: circleOpts.weight || 0
					};
				case 'divIcon':
					const divOpts = opts.options as L.DivIconOptions;
					return {
						markerShape: markerTypeToShape[opts.type],
						size: 10,
						fillColour: '#3388ff',
						fillOpacity: 1,
						strokeColour: '#3388ff',
						strokeOpacity: 1,
						strokeWidth: 0
					};
				default:
					return {
						markerShape: markerTypeToShape[opts.type],
						size: 10,
						fillColour: '#3388ff',
						fillOpacity: 1,
						strokeColour: '#3388ff',
						strokeOpacity: 1,
						strokeWidth: 0
					};
			}
		};

		mount(LeafletCustomMarker, {
			target: container,
			props: getMarkerOptions(options)
		});

		return container.innerHTML.trim();
	}

	onMount(() => {
		leaflet = getLeaflet();
		map = getLeafletMap();
		layersStore = getLeafletLayers();
		layersControl = getLayersControl();
		if (leaflet && map) {
			createGeoJSONLayer();
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
		}
	});
</script>
