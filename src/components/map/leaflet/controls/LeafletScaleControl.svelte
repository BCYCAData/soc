<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';

	import type L from 'leaflet';

	interface Props {
		position?: L.ControlPosition;
		maxWidth?: number;
		metric?: boolean;
		imperial?: boolean;
		updateWhenIdle?: boolean;
	}

	let {
		position = 'bottomleft',
		maxWidth = 100,
		metric = true,
		imperial = false,
		updateWhenIdle = false
	}: Props = $props();

	const { getLeafletMap } = getContext<{ getLeafletMap: () => L.Map }>('leafletMap');
	const { getLeaflet } = getContext<{ getLeaflet: () => typeof L }>('leaflet');
	let leafletMap: L.Map;
	let leaflet: typeof L;
	let scaleControl: L.Control.Scale;

	onMount(async () => {
		leaflet = getLeaflet();
		leafletMap = getLeafletMap();
		if (!scaleControl) {
			scaleControl = leaflet.control
				.scale({
					position,
					maxWidth,
					metric,
					imperial,
					updateWhenIdle
				})
				.addTo(leafletMap);
		}
		scaleControl.setPosition(position);
	});

	onDestroy(() => {
		scaleControl.remove();
	});
</script>
