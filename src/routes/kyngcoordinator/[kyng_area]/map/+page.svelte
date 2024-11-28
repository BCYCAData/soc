<script lang="ts">
	import type { PageData } from './$types';
	// import type { PointSymbologyOptions, PolygonOptions } from '$lib/leaflet/types';
	import {
		kyngAddresspointsGeoJsonOptions,
		kyngAreaGeoJsonOptions,
		kyngPropertyAreasGeoJsonOptions,
		kyngProwayGeoJsonOptions,
		kyngWayPointsGeoJsonOptions
	} from '$lib/leaflet/leafletstyles';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const kyngGeoJsonData = data.kyngGeoJsonData;

	const baseLayers = [
		{
			name: 'Air Photo',
			url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution: `<a href='https://www.spatial.nsw.gov.au' target='_blank'>&copy; Spatial Services NSW </a>`
		},
		{
			name: 'Streets',
			url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}',
			attribution: `<a href='https://www.spatial.nsw.gov.au' target='_blank'>&copy; Spatial Services NSW </a>`
		}
	];

	const mapConfig = {
		centre: [-31.940026654472703, 152.40239389529367] as [number, number],
		zoom: 13,
		zoomSnap: 0.2,
		zoomDelta: 0.2,
		scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
		attributionControl: { present: true },
		layersControl: { present: true, position: 'topright' as L.ControlPosition },
		legend: { present: true, position: 'bottomright' as L.ControlPosition },
		width: '100%',
		height: '98%',
		baseLayers
	};
</script>

<svelte:head>
	<title>Kyng Map</title>
</svelte:head>

{#if kyngGeoJsonData}
	<div class="map-container">
		{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
			<LeafletMap {...mapConfig}>
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte') then { default: LeafletGeoJSONPolygonLayer }}
					<LeafletGeoJSONPolygonLayer
						geojsonData={kyngGeoJsonData.kyngArea}
						layerName="Kyng Area"
						visible={true}
						editable={false}
						staticLayer={true}
						showInLegend={true}
						polygonOptions={kyngAreaGeoJsonOptions}
					/>
					<LeafletGeoJSONPolygonLayer
						geojsonData={kyngGeoJsonData.propertyAreas}
						layerName="Property Areas"
						visible={true}
						editable={false}
						staticLayer={true}
						showInLegend={true}
						polygonOptions={kyngPropertyAreasGeoJsonOptions}
					/>
				{/await}

				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONLineLayer.svelte') then { default: LeafletGeoJSONLineLayer }}
					<LeafletGeoJSONLineLayer
						geojsonData={kyngGeoJsonData.prowayLines}
						layerName="Proway Lines"
						visible={false}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						lineOptions={kyngProwayGeoJsonOptions}
					/>
				{/await}

				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
					<LeafletGeoJSONPointLayer
						geojsonData={kyngGeoJsonData.addressPoints}
						layerName="Address Points"
						visible={true}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						symbology={kyngAddresspointsGeoJsonOptions}
					/>
					<LeafletGeoJSONPointLayer
						geojsonData={kyngGeoJsonData.wayPoints}
						layerName="Way Points"
						visible={false}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						symbology={kyngWayPointsGeoJsonOptions}
					/>
				{/await}

				{#await import('$components/map/leaflet/ui/LeafletTooltip.svelte') then { default: LeafletTooltip }}
					<LeafletTooltip layerName="Property Areas" tooltipContent="Your tooltip content here" />
				{/await}
			</LeafletMap>
		{/await}
	</div>
{/if}

<style>
	.map-container {
		height: 90vh;
		min-height: 400px;
		width: 100%;
	}
</style>
