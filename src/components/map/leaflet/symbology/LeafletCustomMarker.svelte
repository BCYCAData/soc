<script lang="ts">
	import type L from 'leaflet';

	interface Props {
		markerShape?:
			| 'text'
			| 'circle'
			| 'square'
			| 'star'
			| 'triangle'
			| 'triangle-down'
			| 'wye'
			| 'diamond'
			| 'concentric-circle'
			| 'concentric-square'
			| 'concentric-triangle'
			| 'concentric-diamond';
		fillColour?: string;
		fillOpacity?: number;
		size?: number;
		strokeColour?: string;
		strokeOpacity?: number;
		strokeWidth?: number;
		anchor?: [number, number];
		children?: import('svelte').Snippet;
	}

	let {
		markerShape = 'circle',
		fillColour = '#3388ff',
		fillOpacity = 1,
		size = 10,
		strokeColour = '#3388ff',
		strokeOpacity = 1,
		strokeWidth = 0,
		anchor = [size / 2, size / 2],
		children
	}: Props = $props();

	function createMarkerIcon(): string {
		return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            ${shapeToSVG(markerShape, size, fillColour, strokeColour, strokeWidth, strokeOpacity, fillOpacity)}
        </svg>
    `;
	}

	function shapeToSVG(
		shape: string,
		size: number,
		fillColour: string,
		strokeColour: string,
		strokeWidth: number,
		strokeOpacity: number,
		fillOpacity: number
	): string {
		const halfSize = size / 2;
		const commonAttributes = `fill="${fillColour}" fill-opacity="${fillOpacity}" stroke="${strokeColour}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}"`;

		switch (shape) {
			case 'circle':
				return `<circle cx="${halfSize}" cy="${halfSize}" r="${halfSize}" ${commonAttributes} />`;
			case 'square':
				return `<rect width="${size}" height="${size}" ${commonAttributes} />`;
			case 'star':
				const starPoints = createStarPoints(5, halfSize, halfSize * 0.4, halfSize, halfSize);
				return `<polygon points="${starPoints}" ${commonAttributes} />`;
			case 'triangle':
				return `<polygon points="${halfSize},0 ${size},${size} 0,${size}" ${commonAttributes} />`;
			case 'triangle-down':
				return `<polygon points="0,0 ${size},0 ${halfSize},${size}" ${commonAttributes} />`;
			case 'wye':
				const wyePoints = createWyePoints(size, halfSize);
				return `<polygon points="${wyePoints}" ${commonAttributes} />`;
			case 'diamond':
				return `<polygon points="${halfSize},0 ${size},${halfSize} ${halfSize},${size} 0,${halfSize}" ${commonAttributes} />`;
			case 'concentric-circle':
				return `
                    <circle cx="${halfSize}" cy="${halfSize}" r="${halfSize}" ${commonAttributes} />
                    <circle cx="${halfSize}" cy="${halfSize}" r="${halfSize * 0.6}" fill="none" stroke="${strokeColour}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />
                `;
			case 'concentric-square':
				return `
                    <rect width="${size}" height="${size}" ${commonAttributes} />
                    <rect x="${size * 0.2}" y="${size * 0.2}" width="${size * 0.6}" height="${size * 0.6}" fill="none" stroke="${strokeColour}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />
                `;
			case 'concentric-triangle':
				return `
                    <polygon points="${halfSize},0 ${size},${size} 0,${size}" ${commonAttributes} />
                    <polygon points="${halfSize},${size * 0.3} ${size * 0.8},${size * 0.8} ${size * 0.2},${size * 0.8}" fill="none" stroke="${strokeColour}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />
                `;
			case 'concentric-diamond':
				return `
                    <polygon points="${halfSize},0 ${size},${halfSize} ${halfSize},${size} 0,${halfSize}" ${commonAttributes} />
                    <polygon points="${halfSize},${size * 0.2} ${size * 0.8},${halfSize} ${halfSize},${size * 0.8} ${size * 0.2},${halfSize}" fill="none" stroke="${strokeColour}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />
                `;
			default:
				return `<circle cx="${halfSize}" cy="${halfSize}" r="${halfSize}" ${commonAttributes} />`;
		}
	}

	function createStarPoints(
		points: number,
		centerX: number,
		centerY: number,
		outerRadius: number,
		innerRadius: number
	): string {
		let starPoints = '';
		for (let i = 0; i < points * 2; i++) {
			const radius = i % 2 === 0 ? outerRadius : innerRadius;
			const angle = (i * Math.PI) / points;
			const x = centerX + radius * Math.sin(angle);
			const y = centerY - radius * Math.cos(angle);
			starPoints += `${x},${y} `;
		}
		return starPoints.trim();
	}

	function createWyePoints(size: number, halfSize: number): string {
		const thirdSize = size / 3;
		return `${halfSize},0 ${halfSize},${thirdSize} ${size},${thirdSize} ${size},${2 * thirdSize} ${halfSize},${2 * thirdSize} ${halfSize},${size} 0,${size} 0,${2 * thirdSize} ${halfSize},${2 * thirdSize} ${halfSize},${thirdSize} 0,${thirdSize} 0,0`;
	}
</script>

{#if markerShape === 'text'}
	<div
		class="text-marker"
		style:color={fillColour}
		style:font-size="{size}px"
		style:opacity={fillOpacity}
	>
		{@render children?.()}
	</div>
{:else}
	{@html createMarkerIcon()}
{/if}

<style>
	.text-marker {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-family: inherit;
	}
</style>
