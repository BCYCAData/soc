<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';

	import type L from 'leaflet';

	type Props = {
		position?: L.ControlPosition;
		maxWidth?: number;
		metric?: boolean;
		imperial?: boolean;
		updateWhenIdle?: boolean;
	};

	let {
		position = 'bottomleft',
		maxWidth = 100,
		metric = true,
		imperial = false,
		updateWhenIdle = false
	}: Props = $props();

	const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Record<string, L.Layer>;
	}>('leafletContext');

	let scaleControl: L.Control.Scale;

	onMount(async () => {
		const leaflet = getLeaflet();
		const leafletMap = getLeafletMap();
		const haveScaleControl =
			leafletMap.getContainer().querySelector('.leaflet-control-scale') !== null;
		if (!haveScaleControl) {
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
