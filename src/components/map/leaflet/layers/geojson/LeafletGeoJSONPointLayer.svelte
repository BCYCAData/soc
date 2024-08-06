<script lang="ts">
	import { getContext } from 'svelte';

	import LeafletBaseGeoJSONLayer from '$components/map/leaflet/layers/geojson/LeafletBaseGeoJSONLayer.svelte';
	import { PointLayerFunctions } from '$lib/leaflet/leafletstyles';

	import type L from 'leaflet';

	type LeafletMarkerStyleOptions = L.CircleMarkerOptions | L.IconOptions | L.DivIconOptions;

	interface Props {
		data: GeoJSON.FeatureCollection<GeoJSON.Point>;
		name?: string;
		children?: import('svelte').Snippet;
		pointToLayerFunctionName:
			| 'createCircleMarker'
			| 'createIcon'
			| 'createDivIcon'
			| 'createTextLabel';
		styleOptions?: LeafletMarkerStyleOptions;
	}

	let {
		data,
		name = 'Point Layer',
		children,
		pointToLayerFunctionName,
		styleOptions = {}
	}: Props = $props();

	const { getLeaflet } = getContext<{
		getLeaflet: () => typeof L;
	}>('leafletContext');

	const pointLayerFunctions = new PointLayerFunctions(getLeaflet);
	const options: L.GeoJSONOptions = {
		pointToLayer: (feature, latlng) =>
			pointLayerFunctions[pointToLayerFunctionName](
				feature,
				latlng,
				styleOptions as L.CircleMarkerOptions & L.IconOptions & L.DivIconOptions
			)
	};
</script>

<LeafletBaseGeoJSONLayer
	{data}
	{name}
	{options}
	on:featureClick
	on:featureMouseover
	on:featureMouseout
>
	{@render children?.()}
</LeafletBaseGeoJSONLayer>
