<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import type L from 'leaflet';
	import { LegendControl } from '$lib/leaflet/legendcontrol';
	import { type Writable } from 'svelte/store';

	interface Props {
		position?: L.ControlPosition;
	}

	let { position = 'bottomright' }: Props = $props();

	const { getLeafletMap } = getContext<{ getLeafletMap: () => L.Map }>('leafletMap');
	let leafletMap: L.Map;
	const { getLeaflet } = getContext<{ getLeaflet: () => typeof L }>('leaflet');
	let leaflet: typeof L;
	const layersStore: Writable<Record<string, L.Layer>> = getContext('layersStore');

	let legendControl: LegendControl;

	onMount(() => {
		leaflet = getLeaflet();
		leafletMap = getLeafletMap();
		legendControl = new LegendControl({ position });
		legendControl.addTo(leafletMap);

		// Subscribe to layer changes
		const unsubscribe = layersStore.subscribe((layers: Record<string, any>) => {
			Object.entries(layers).forEach(([name, layer]) => {
				if (layer instanceof leaflet.GeoJSON) {
					updateGeoJSONLegend(name, layer);
				}
			});
		});

		// Listen for layer add/remove events
		leafletMap.on('layeradd layerremove', (e: L.LayerEvent) => {
			if (e.layer instanceof leaflet.GeoJSON && 'options' in e.layer && 'name' in e.layer.options) {
				const layerName = e.layer.options.name;
				if (typeof layerName === 'string') {
					legendControl.setVisibility(layerName, e.type === 'layeradd');
				}
			}
		});

		return () => {
			unsubscribe();
			leafletMap.off('layeradd layerremove');
		};
	});

	function updateGeoJSONLegend(name: string, layer: L.GeoJSON) {
		const style = layer.options.style;
		if (typeof style === 'function') {
			// If style is a function, we need to determine unique styles
			const uniqueStyles = new Map();
			layer.eachLayer((feature: L.Layer) => {
				if (feature instanceof leaflet.Path && 'feature' in feature && feature.feature) {
					const featureStyle = style(feature.feature as GeoJSON.Feature);
					const key = JSON.stringify(featureStyle);
					if (!uniqueStyles.has(key)) {
						uniqueStyles.set(key, {
							style: featureStyle,
							name: getStyleName(feature.feature as GeoJSON.Feature, featureStyle)
						});
					}
				}
			});

			uniqueStyles.forEach((value, key) => {
				const symbolElement = createSymbolElement(value.style);
				legendControl.addLegendItem({
					name: `${name}: ${value.name}`,
					symbol: symbolElement as unknown as HTMLElement,
					visible: leafletMap.hasLayer(layer)
				});
			});
		} else if (style) {
			// If style is static and not undefined, add one legend item
			const symbolElement = createSymbolElement(style);
			legendControl.addLegendItem({
				name: name,
				symbol: symbolElement as unknown as HTMLElement,
				visible: leafletMap.hasLayer(layer)
			});
		}
	}

	function createSymbolElement(style: L.PathOptions): SVGSVGElement {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '20');
		svg.setAttribute('height', '20');

		const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		shape.setAttribute('width', '20');
		shape.setAttribute('height', '20');
		shape.setAttribute('fill', style.fillColor || style.color || '#000000');
		shape.setAttribute('stroke', style.color || '#000000');
		shape.setAttribute('stroke-width', style.weight?.toString() || '1');

		svg.appendChild(shape);
		return svg;
	}

	function getStyleName(feature: GeoJSON.Feature, style: L.PathOptions): string {
		// Implement logic to determine a name for this style based on feature properties
		// This is just an example, adjust according to your data structure
		return feature.properties?.category || 'Default';
	}

	onDestroy(() => {
		if (legendControl && leafletMap) {
			leafletMap.removeControl(legendControl);
		}
	});
</script>

<style>
	:global(.legend) {
		background: white;
		padding: 10px;
		border-radius: 5px;
		border: 2px solid rgba(0, 0, 0, 0.2);
	}
	:global(.legend-item) {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
	}
	:global(.legend-symbol) {
		margin-right: 5px;
	}
	:global(.legend-item .hidden) {
		color: #999;
		text-decoration: line-through;
	}
</style>
