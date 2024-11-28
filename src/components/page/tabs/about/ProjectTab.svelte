<script lang="ts">
	import '../../../../app.postcss';
	import type { PointSymbologyOptions } from '$lib/leaflet/types';

	interface AddressPointsGeoJSON {
		allAddresspoints: GeoJSON.FeatureCollection<GeoJSON.Point, AllAddressPointProperties>;
		registeredAddresspoints: GeoJSON.FeatureCollection<
			GeoJSON.Point,
			RegisteredAddressPointProperties
		>;
		initialExtent: L.LatLngBoundsExpression | [[number, number], [number, number]];
		centre: L.LatLngExpression | [number, number];
	}

	interface AllAddressPointProperties {
		id: number;
		addresspointoid: number;
		enddate: string;
	}

	interface RegisteredAddressPointProperties {
		addresspointtype: string;
	}

	let addressPointsGeoJSON: AddressPointsGeoJSON = $props();

	const baseLayers = [
		{
			name: 'NSW Streets',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		}
	];

	const mapConfig = {
		centre: undefined,
		zoom: undefined,
		minZoom: undefined,
		maxZoom: undefined,
		initialExtent: addressPointsGeoJSON.initialExtent,
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
	const projectAddresspointsOptions: PointSymbologyOptions = {
		type: 'custom',
		options: {
			markerShape: 'circle',
			fillColour: '#a5a5a5',
			size: 6,
			strokeColour: '#000',
			strokeWidth: 0,
			strokeOpacity: 0,
			fillOpacity: 0.8
		}
	};

	const registeredAddresspointsOptions: PointSymbologyOptions = {
		type: 'custom',
		options: {
			markerShape: 'circle',
			fillColour: '#f97316',
			size: 8,
			strokeColour: '#000',
			strokeWidth: 0,
			strokeOpacity: 0,
			fillOpacity: 1
		}
	};
</script>

<svelte:head>
	<title>Strengthen Our Community</title>
</svelte:head>

<article class="wrapper grid h-full text-surface-950">
	<header class="main-headlines mx-auto text-center">
		<h1 class="text-primary h1 sm:block">Strengthen OUR Community</h1>
		<strong class="pt-4">
			This project is about empowering our community to take responsibility for being prepared<br />
			and working together to make a difference.
		</strong>
	</header>

	<section class="about-content mx-auto text-center">
		<h3 class="text-primary h3">Our aim: Prepare, Connect and Rebound</h3>
	</section>

	<section class="main-list mx-auto">
		<strong class="mb-2">The project focuses on four areas:</strong>
		<ol type="1" class="mt-0">
			<li class="m-1">
				<strong>The Burrell Creek Hall</strong>
				- an emergency information hub, a place where up-to-date accurate, current information is available.
			</li>
			<li class="m-1">
				<strong>KYNGs</strong>
				- Know Your Neighbour Groups - Community groups who work together to provide information, connection
				and support.
			</li>
			<li class="m-1">
				<strong>Digital Online Mapping</strong>
				- this website. A digital representation of our local information, that we own and update.
			</li>
			<li class="m-1">
				<strong>Workshops</strong>
				- locally run workshops to increase community preparedness, through knowledge sharing.
			</li>
		</ol>

		<p class="my-3 text-center font-semibold">
			This map shows the <span class="text-primary">properties</span>
			that have participated
		</p>
	</section>
	<section class="main-map">
		{#if addressPointsGeoJSON}
			{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
				<LeafletMap {...mapConfig}>
					{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
						<LeafletGeoJSONPointLayer
							geojsonData={addressPointsGeoJSON.allAddresspoints}
							layerName="Project Address Points"
							visible={true}
							editable={false}
							showInLegend={false}
							staticLayer={true}
							symbology={projectAddresspointsOptions}
						/>
						<LeafletGeoJSONPointLayer
							geojsonData={addressPointsGeoJSON.registeredAddresspoints}
							layerName="Registered Address Points"
							visible={true}
							editable={false}
							showInLegend={false}
							staticLayer={true}
							symbology={registeredAddresspointsOptions}
						/>
					{/await}
					{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
						<LeafletScaleControl position="bottomleft" />
					{/await}
				</LeafletMap>
			{/await}
		{:else}
			<p class="mt-4 text-center text-surface-500">Bugger!</p>
		{/if}
	</section>
</article>

<style>
	.main-headlines {
		grid-area: headlines;
	}
	.main-list {
		grid-area: list;
	}
	.about-content {
		grid-area: content-words;
	}
	.main-map {
		grid-area: map-area;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 2fr auto 2fr 1fr;
		grid-template-areas:
			'headlines headlines headlines headlines headlines '
			'content-words content-words content-words content-words content-words '
			'list list list list list '
			'. map-area map-area map-area .';
		grid-template-rows: auto auto auto 1fr;
		height: 100vh;
	}

	.text-primary {
		color: var(--primary-color);
	}

	:global(.main-map > *) {
		flex: 1;
		min-height: 0;
	}
</style>
