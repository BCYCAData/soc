<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type L from 'leaflet';

	import '$components/map/leaflet/leaflet-geoman.css';
	import '$components/map/leaflet/custom-geoman.css';

	interface LeafletContext {
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
	}

	const { getLeaflet, getLeafletMap } = getContext<LeafletContext>('leafletContext');

	interface Props {
		position?: L.ControlPosition;
		drawMarker?: boolean;
		drawCircleMarker?: boolean;
		drawPolyline?: boolean;
		drawRectangle?: boolean;
		drawPolygon?: boolean;
		drawCircle?: boolean;
		editMode?: boolean;
		dragMode?: boolean;
		cutPolygon?: boolean;
		removalMode?: boolean;
	}

	const {
		position = 'topleft',
		drawMarker = true,
		drawCircleMarker = true,
		drawPolyline = true,
		drawRectangle = true,
		drawPolygon = true,
		drawCircle = true,
		editMode = true,
		dragMode = true,
		cutPolygon = true,
		removalMode = true
	}: Props = $props();

	let leaflet: typeof L;
	let leafletMap: L.Map;

	function makeGeomanToolbarCollapsible() {
		const toolbar = document.querySelector('.leaflet-pm-toolbar');
		if (!toolbar) return;

		// Create collapse button
		const collapseBtn = document.createElement('div');
		collapseBtn.innerHTML = '◀'; // Left arrow character
		collapseBtn.className = 'leaflet-pm-toolbar-collapse-btn';
		toolbar.prepend(collapseBtn);

		// Toggle collapse on button click
		collapseBtn.addEventListener('click', () => {
			toolbar.classList.toggle('collapsed');
			collapseBtn.innerHTML = toolbar.classList.contains('collapsed') ? '▶' : '◀';
		});
	}

	onMount(() => {
		leaflet = getLeaflet();
		leafletMap = getLeafletMap();
		if (leafletMap && leaflet) {
			leafletMap.pm.addControls({
				position,
				drawMarker,
				drawCircleMarker,
				drawPolyline,
				drawRectangle,
				drawPolygon,
				drawCircle,
				editMode,
				dragMode,
				cutPolygon,
				removalMode
			});
			leafletMap.on('pm:globaleditmodetoggled', makeGeomanToolbarCollapsible);
		}

		return () => {
			if (leafletMap) {
				leafletMap.pm.removeControls();
			}
		};
	});
</script>
