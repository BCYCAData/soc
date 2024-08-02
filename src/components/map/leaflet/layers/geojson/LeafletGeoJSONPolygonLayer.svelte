<script lang="ts">
	import LeafletBaseGeoJSONLayer from '$components/map/leaflet/layers/geojson/LeafletBaseGeoJSONLayer.svelte';

	interface Props {
		data: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
		name?: string;
		children?: import('svelte').Snippet;
	}

	let { data, name = 'Polygon Layer', children }: Props = $props();
</script>

<LeafletBaseGeoJSONLayer {data} {name} on:featureClick on:featureMouseover on:featureMouseout>
	{@render children?.()}
</LeafletBaseGeoJSONLayer>
