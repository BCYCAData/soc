<script lang="ts">
	import LeafletBaseGeoJsonLayer from '$components/map/leaflet/layers/geojson/LeafletBaseGeoJSONLayer.svelte';

	interface Props {
		data: GeoJSON.FeatureCollection<GeoJSON.LineString>;
		name?: string;
		children?: import('svelte').Snippet;
	}

	let { data, name = 'LineString Layer', children }: Props = $props();
</script>

<LeafletBaseGeoJsonLayer {data} {name} on:featureClick on:featureMouseover on:featureMouseout>
	{@render children?.()}
</LeafletBaseGeoJsonLayer>
