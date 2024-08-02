<script lang="ts">
	import { env } from '$env/dynamic/public';

	import '../../../../app.postcss';

	interface Props {
		projectAddressPoints: any;
	}

	let { projectAddressPoints }: Props = $props();

	const mapConfig = {
		centre: [-31.955815, 152.300884] as [number, number],
		zoom: 11.75,
		zoomSnap: 0.25,
		zoomControl: false,
		layersControl: false,
		dragging: false,
		doubleClickZoom: false,
		scrollWheelZoom: false,
		boxZoom: false,
		touchZoom: false,
		keyboard: false
	};

	const baseUrl = `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${env.PUBLIC_MAPTILER_KEY}`;
	const baseAttribution = `\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e \u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`;
</script>

<svelte:head>
	<title>Strengthen Our Community</title>
</svelte:head>

<article class="wrapper grid h-full text-gray-900">
	<header class="main-headlines mx-auto text-center">
		<h1 class="text-primary h1 sm:block">Strengthen OUR Community</h1>
		<strong class="pt-4">
			This project is about empowering our community to take responsibility for being prepared<br
			/>and working together to make a difference.
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
	<!-- <pre>{JSON.stringify(projectAddressPoints.allAddresspoints)}</pre> -->

	{#if projectAddressPoints}
		<div class="main-map map-container mx-auto flex w-5/6 flex-col">
			{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
				<LeafletMap {...mapConfig}>
					{#await import('$components/map/leaflet/layers/LeafletTileLayer.svelte') then { default: LeafletTileLayer }}
						<LeafletTileLayer url={baseUrl} attribution={baseAttribution} />
					{/await}
					{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
						<LeafletGeoJSONPointLayer
							data={projectAddressPoints.allAddresspoints}
							name="Project Address Points"
						>
							{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayerOptions.svelte') then { default: LeafletGeoJSONPointLayerOptions }}
								<LeafletGeoJSONPointLayerOptions color="red" radius={8} />
							{/await}
						</LeafletGeoJSONPointLayer>
					{/await}
					{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
						<LeafletGeoJSONPointLayer
							data={projectAddressPoints.registeredAddresspoints}
							name="Registered Address Points"
						>
							{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayerOptions.svelte') then { default: LeafletGeoJSONPointLayerOptions }}
								<LeafletGeoJSONPointLayerOptions color="green" radius={8} />
							{/await}
						</LeafletGeoJSONPointLayer>
					{/await}
					{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
						<LeafletScaleControl position="bottomleft" />
					{/await}
				</LeafletMap>
			{/await}
		</div>
	{:else}
		<div class="main-map mx-auto flex h-full w-5/6 flex-col">
			<p class="mt-4 text-center text-gray-500">Bugger!</p>
		</div>
	{/if}
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
	}
	.map-container {
		height: 100%;
		min-height: 400px;
	}
	.text-primary {
		color: var(--primary-color);
	}
</style>
