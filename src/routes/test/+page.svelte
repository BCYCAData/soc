<script lang="ts">
	const baseLayers = [
		{
			name: 'NSW Streets',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		},
		{
			name: 'NSW Aerial',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		},
		{
			name: 'OpenStreetMap',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution: '© OpenStreetMap contributors'
		},
		{
			name: 'Satellite',
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution:
				'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
		}
	];

	const mapConfig = {
		centre: undefined,
		zoom: 15,
		bounds: [
			[-31.9525047370793, 152.29487005058],
			[-31.9519775488016, 152.295177085771]
		] as L.LatLngBoundsExpression,
		minZoom: undefined,
		maxZoom: undefined,
		zoomable: true,
		zoomSnap: 0.25,
		scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
		attributionControl: { present: true },
		layersControl: { present: true, position: 'topright' as L.ControlPosition },
		legend: { present: false, position: 'bottomright' as L.ControlPosition },
		width: '100%',
		height: '98%',
		baseLayers: baseLayers
	};
</script>

<!-- {#await import('$components/map/test/TestMap.svelte') then { default: LeafletMap }}
	<LeafletMap {...mapConfig}>
		{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
			<LeafletScaleControl position="bottomleft" />
		{/await}
	</LeafletMap>
{/await} -->
