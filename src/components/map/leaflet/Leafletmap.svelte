<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	import LeafletLegendControl from './controls/LeafletLegendControl.svelte';

	import type L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	// import './custom.css';

	// Props
	interface Props {
		centre: L.LatLngExpression;
		zoom?: number;
		minZoom?: number | undefined;
		maxZoom?: number | undefined;
		boxZoom?: boolean;
		doubleClickZoom?: boolean;
		touchZoom?: boolean;
		dragging?: boolean;
		zoomSnap?: number;
		zoomDelta?: number;
		scrollWheelZoom?: boolean;
		keyboard?: boolean;
		zoomControl?: boolean;
		attributionControl?: boolean;
		layersControl?: boolean;
		legend?: boolean;
		legendPosition?: L.ControlPosition;
		width?: string;
		height?: string;
		children?: import('svelte').Snippet;
	}

	let {
		centre = $bindable(),
		zoom = $bindable(15),
		minZoom = undefined,
		maxZoom = undefined,
		boxZoom = true,
		doubleClickZoom = true,
		touchZoom = true,
		dragging = true,
		zoomSnap = 1,
		zoomDelta = 1,
		scrollWheelZoom = true,
		keyboard = true,
		zoomControl = true,
		attributionControl = true,
		layersControl = true,
		legend = false,
		legendPosition = 'bottomright',
		width = '100%',
		height = '98%',
		children
	}: Props = $props();

	// Reactive style
	let style = $derived(`width:${width};height:${height};`);

	// Leaflet module and map instance
	let leaflet: typeof L | undefined = $state();
	let leafletMap: L.Map | undefined = $state();
	let mapDiv: HTMLDivElement | undefined = $state();

	// Stores for Leaflet and map instance
	const leafletStore: Writable<typeof L | null> = writable(null);
	const mapStore: Writable<L.Map | null> = writable(null);
	const layersStore: Writable<Record<string, L.Layer>> = writable({});

	// Set context for child components
	setContext('leaflet', {
		getLeaflet: () => leaflet,
		leafletStore
	});

	setContext('leafletMap', {
		getLeafletMap: () => leafletMap,
		mapStore
	});

	setContext('layersStore', layersStore);

	let layersControlInstance: L.Control.Layers;

	onMount(async () => {
		leaflet = await import('leaflet');
		leafletStore.set(leaflet);

		if (mapDiv && leaflet) {
			leafletMap = leaflet
				.map(mapDiv, {
					minZoom,
					maxZoom,
					zoomSnap,
					zoomDelta,
					boxZoom,
					doubleClickZoom,
					touchZoom,
					scrollWheelZoom,
					dragging,
					keyboard,
					zoomControl,
					attributionControl
				})
				.setView(centre, zoom);

			if (layersControl && leafletMap) {
				layersControlInstance = leaflet.control.layers().addTo(leafletMap);

				layersStore.subscribe((layers) => {
					if (layersControlInstance && leaflet && leafletMap) {
						layersControlInstance.remove();
						layersControlInstance = leaflet.control.layers().addTo(leafletMap);

						Object.entries(layers).forEach(([name, layer]) => {
							layersControlInstance.addOverlay(layer, name);
						});
					}
				});
			}

			mapStore.set(leafletMap);

			// Event listeners
			leafletMap.on('zoomend', () => {
				zoom = leafletMap?.getZoom() ?? zoom;
			});

			leafletMap.on('moveend', () => {
				centre = leafletMap?.getCenter() ?? centre;
			});
		}
	});

	onDestroy(() => {
		if (leafletMap) {
			leafletMap.remove();
			mapStore.set(null);
		}
		if (layersControlInstance) {
			layersControlInstance.remove();
			layersStore.set({});
		}
		leafletStore.set(null);
	});

	// Methods
	export function getCenter() {
		return leafletMap?.getCenter();
	}

	export function getZoom() {
		return leafletMap?.getZoom();
	}

	export function setView(center: L.LatLngExpression, zoom: number, options?: L.ZoomPanOptions) {
		leafletMap?.setView(center, zoom, options);
	}

	export function setZoom(zoom: number, options?: L.ZoomPanOptions) {
		leafletMap?.setZoom(zoom, options);
	}

	export function zoomIn(delta?: number, options?: L.ZoomOptions) {
		leafletMap?.zoomIn(delta, options);
	}

	export function zoomOut(delta?: number, options?: L.ZoomOptions) {
		leafletMap?.zoomOut(delta, options);
	}

	export function setZoomAround(latlng: L.LatLngExpression, zoom: number, options?: L.ZoomOptions) {
		leafletMap?.setZoomAround(latlng, zoom, options);
	}

	export function fitBounds(bounds: L.LatLngBoundsExpression, options?: L.FitBoundsOptions) {
		leafletMap?.fitBounds(bounds, options);
	}

	export function fitWorld(options?: L.FitBoundsOptions) {
		leafletMap?.fitWorld(options);
	}

	export function panTo(latlng: L.LatLngExpression, options?: L.PanOptions) {
		leafletMap?.panTo(latlng, options);
	}

	export function panBy(offset: L.PointExpression, options?: L.PanOptions) {
		leafletMap?.panBy(offset, options);
	}

	export function setMaxBounds(bounds: L.LatLngBoundsExpression) {
		leafletMap?.setMaxBounds(bounds);
	}

	export function setMinZoom(zoom: number) {
		leafletMap?.setMinZoom(zoom);
	}

	export function setMaxZoom(zoom: number) {
		leafletMap?.setMaxZoom(zoom);
	}

	export function panInsideBounds(bounds: L.LatLngBoundsExpression, options?: L.PanOptions) {
		leafletMap?.panInsideBounds(bounds, options);
	}

	export function invalidateSize(options?: boolean | L.PanInsideOptions) {
		leafletMap?.invalidateSize(options);
	}

	export function stop() {
		leafletMap?.stop();
	}
</script>

<div bind:this={mapDiv} {style}>
	{#if leaflet && leafletMap}
		{@render children?.()}
		{#if legend}
			<LeafletLegendControl position={legendPosition} />
		{/if}
	{/if}
</div>
