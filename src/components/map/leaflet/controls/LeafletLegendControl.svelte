<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import type L from 'leaflet';
	import { LegendControl } from '$lib/leaflet/leafletlegendcontrol';

	interface Props {
		position?: L.ControlPosition;
	}

	let { position = 'bottomright' }: Props = $props();

	const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Record<string, L.Layer>;
	}>('leafletContext');

	let leaflet: typeof L;
	let leafletMap: L.Map;
	let legendControl: LegendControl;

	onMount(() => {
		leaflet = getLeaflet();
		leafletMap = getLeafletMap();
		legendControl = new LegendControl(leaflet, { position });
		legendControl.addTo(leafletMap);
	});

	$effect(() => {
		const layers = getLeafletLayers();
		Object.entries(layers).forEach(([name, layer]) => {
			if (layer instanceof leaflet.GeoJSON) {
				updateGeoJSONLegend(name, layer);
			}
		});
	});

	$effect(() => {
		leafletMap.on('layeradd layerremove', (e: L.LayerEvent) => {
			if (e.layer instanceof leaflet.GeoJSON && 'options' in e.layer && 'name' in e.layer.options) {
				const layerName = e.layer.options.name;
				if (typeof layerName === 'string') {
					legendControl.setVisibility(layerName, e.type === 'layeradd');
				}
			}
		});

		return () => {
			leafletMap.off('layeradd layerremove');
		};
	});

	function updateGeoJSONLegend(name: string, layer: L.GeoJSON) {
		const style = layer.options.style;
		if (typeof style === 'function') {
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
