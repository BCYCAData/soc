import type L from 'leaflet';
import type { Feature } from 'geojson';

export let markerShape:
	| 'text'
	| 'circle'
	| 'square'
	| 'star'
	| 'triangle'
	| 'triangle-down'
	| 'wye'
	| 'diamond'
	| 'star'
	| 'concentric-circle'
	| 'concentric-square'
	| 'concentric-triangle'
	| 'concentric-diamond' = 'circle';

import type { PointSymbologyOptions, PolygonOptions } from '$lib/leaflet/types';

export const kyngAddresspointsGeoJsonOptions: PointSymbologyOptions = {
	type: 'leaflet',
	options: {
		type: 'divIcon',
		options: {
			className: 'diamond-marker',
			iconAnchor: [3, 6],
			html: '' // We'll set this dynamically in the component
		}
	}
};

export const kyngWayPointsGeoJsonOptions: PointSymbologyOptions = {
	type: 'leaflet',
	options: {
		type: 'circleMarker',
		options: {
			radius: 3,
			fillColor: 'red',
			color: 'black',
			weight: 1,
			fillOpacity: 1
		}
	}
};

export const kyngProwayGeoJsonOptions: PolygonOptions = {
	weight: 1,
	color: 'steelblue'
};

interface DynamicPolygonOptions extends Omit<L.PathOptions, 'fillColor'> {
	fillColor: string | ((feature: GeoJSON.Feature) => string);
}

let existingColors: Color[] = [];

export const kyngPropertyAreasGeoJsonOptions: PolygonOptions = {
	style: (feature: Feature) => ({
		fillColor: generateUniqueColorForKey(
			feature.properties?.['Principal Address Site OID']?.toString() ?? 'default',
			existingColors
		),
		fillOpacity: 0.3,
		weight: 1,
		color: 'black'
	})
};

export const kyngAreaGeoJsonOptions: PolygonOptions = {
	fillColor: 'transparent',
	fillOpacity: 0,
	weight: 5,
	color: 'magenta'
};

// ---------types---------------

interface Color {
	r: number;
	g: number;
	b: number;
}

// ---------Functions---------------

export class PointLayerFunctions {
	private leaflet: typeof L;

	constructor(getLeaflet: () => typeof L) {
		this.leaflet = getLeaflet();
	}

	createCircleMarker(
		feature: GeoJSON.Feature,
		latlng: L.LatLng,
		options: L.CircleMarkerOptions
	): L.CircleMarker {
		return this.leaflet.circleMarker(latlng, options);
	}

	createIcon(feature: GeoJSON.Feature, latlng: L.LatLng, options: L.IconOptions): L.Marker {
		return this.leaflet.marker(latlng, { icon: this.leaflet.icon(options) });
	}

	createDivIcon(feature: GeoJSON.Feature, latlng: L.LatLng, options: L.DivIconOptions): L.Marker {
		return this.leaflet.marker(latlng, { icon: this.leaflet.divIcon(options) });
	}

	createTextLabel(feature: GeoJSON.Feature, latlng: L.LatLng, options: L.DivIconOptions): L.Marker {
		return this.leaflet.marker(latlng, {
			icon: this.leaflet.divIcon({
				html: options.html || feature.properties?.label,
				className: 'text-scale-label',
				...options
			})
		});
	}

	// Example of a method that could be added in the future
	createCustomShape(feature: GeoJSON.Feature, latlng: L.LatLng, options: any): L.Layer {
		// Implementation for a custom shape
		return this.leaflet.polygon(
			[latlng, [latlng.lat + 0.1, latlng.lng], [latlng.lat, latlng.lng + 0.1]],
			options
		);
	}
}

function generateUniqueColorForKey(key: string, existingColors: Color[]): string {
	let color = hashStringToColor(key);
	color = ensureUniqueColor(color, existingColors);

	// Convert color object to hex string
	const toHex = (value: number) => value.toString(16).padStart(2, '0');
	return '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
}

function hashStringToColor(input: string): Color {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Convert hash to RGB color
	const r = (hash & 0xff0000) >> 16;
	const g = (hash & 0x00ff00) >> 8;
	const b = hash & 0x0000ff;

	return { r, g, b };
}

function ensureUniqueColor(color: Color, existingColors: Color[]): Color {
	// Simple check for exact match; could be enhanced for "near-match"
	for (const existingColor of existingColors) {
		if (existingColor.r === color.r && existingColor.g === color.g && existingColor.b === color.b) {
			// Collision detected; adjust color slightly
			return { r: color.r, g: color.g, b: (color.b + 1) % 256 };
		}
	}
	return color; // No collision
}

function getAddressPointDivSymbol(addressPointType: string, housenumber: string | null, size = 6) {
	let markerColor;
	switch (addressPointType) {
		case 'Property':
			markerColor = 'blue';
			break;
		case 'Building':
			markerColor = 'green';
			break;
		default:
			markerColor = 'black';
	}
	let htmlContent;
	if (housenumber === null) {
		// If housenumber is null, use a diamond
		htmlContent = `<div style="border: solid 1px black; width: ${size}px; height: ${size}px; 
					transform: rotate(45deg); background: ${markerColor};"></div>`;
	} else {
		// If housenumber is not null, use a square
		htmlContent = `<div style="border: solid 1px black; width: ${size}px; height: ${size}px; background: ${markerColor};"></div>`;
	}
	return htmlContent;
}
