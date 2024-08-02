<script lang="ts">
	import LeafletBaseGeoJSONLayer from '$components/map/leaflet/layers/geojson/LeafletBaseGeoJSONLayer.svelte';

	interface Props {
		data: GeoJSON.FeatureCollection<GeoJSON.Point>;
		name?: string;
		children?: import('svelte').Snippet;
	}

	let { data, name = 'Point Layer', children }: Props = $props();
	console.log('data', data);
</script>

<LeafletBaseGeoJSONLayer {data} {name} on:featureClick on:featureMouseover on:featureMouseout>
	{@render children?.()}
</LeafletBaseGeoJSONLayer>
