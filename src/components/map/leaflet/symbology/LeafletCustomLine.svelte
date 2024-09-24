<script lang="ts">
	interface Props {
		lineColour?: string;
		lineOpacity?: number;
		width?: number;
		height?: number;
		strokeWidth?: number;
	}

	let {
		lineColour = '#3388ff',
		lineOpacity = 1,
		width = 20,
		height = 15,
		strokeWidth = 2
	}: Props = $props();

	function generateSingleToothPath(width: number, height: number): string {
		return `M0,${height} L${width / 3},${height} L${width / 2},0 L${(width * 2) / 3},${height} L${width},${height}`;
	}
</script>

<svg {width} {height} xmlns="http://www.w3.org/2000/svg">
	<path
		d={generateSingleToothPath(width, height)}
		fill="none"
		stroke={lineColour}
		stroke-opacity={lineOpacity}
		stroke-width={strokeWidth}
		stroke-linecap="square"
		stroke-linejoin="bevel"
	/>
</svg>
