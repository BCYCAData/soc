<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { projectAddressPoints } = data;

	const baseLayers = [
		{
			name: 'NSW Streets',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		}
	];

	const mapConfig = {
		centre: [-31.955815, 152.300884] as [number, number],
		minZoom: undefined,
		maxZoom: undefined,
		zoomable: true,
		zoomSnap: 0.25,
		scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
		attributionControl: { present: true },
		layersControl: { present: true, position: 'topright' as L.ControlPosition },
		legend: { present: false, position: 'bottomright' as L.ControlPosition },
		width: '100%',
		height: '99%',
		baseLayers: baseLayers
	};

	const projectAddresspointsOptions: L.CircleMarkerOptions = {
		color: '#a5a5a5',
		weight: 0,
		radius: 3,
		fillOpacity: 0.8
	};

	const registeredAddresspointsOptions: L.CircleMarkerOptions = {
		fillColor: '#f97316',
		radius: 4,
		color: '#000',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};
</script>

<svelte:head>
	<title>Profile-Community External-Map</title>
</svelte:head>

{#if projectAddressPoints}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
			<LeafletMap {...mapConfig}>
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
					<LeafletGeoJSONPointLayer
						geojsonData={projectAddressPoints.allAddresspoints}
						layerName="Project Address Points"
						visible={true}
						editable={false}
						showInLegend={false}
						staticLayer={true}
						markerOptions={projectAddresspointsOptions}
					/>
					<LeafletGeoJSONPointLayer
						geojsonData={projectAddressPoints.registeredAddresspoints}
						layerName="Registered Address Points"
						visible={true}
						editable={false}
						showInLegend={false}
						staticLayer={true}
						markerOptions={projectAddresspointsOptions}
					/>
				{/await}
				{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
					<LeafletScaleControl position="bottomleft" />
				{/await}
			</LeafletMap>
		{/await}
	</div>
{:else}
	<div class="main-map mx-auto flex h-full w-5/6 flex-col">
		<p class="mt-4 text-center text-surface-500">Bugger!</p>
	</div>
{/if}

<style>
	.map-container {
		height: 80%;
		min-height: 400px;
	}
</style>
