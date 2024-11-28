import type { Feature } from 'geojson';
import type L from 'leaflet';

export interface StyleOptions extends L.PathOptions {
	style?: (feature: Feature) => L.PathOptions;
}

export type PolygonStyleFunction = (feature: Feature) => L.PathOptions;

export interface PolygonOptions extends L.PathOptions {
	style?: PolygonStyleFunction;
}

// Legend related types
export interface LegendItem {
	symbol: string;
	description: string;
}

export interface GroupedLegendItem {
	groupName: string;
	items: LegendItem[];
}

export interface LegendInfo {
	items: (LegendItem | GroupedLegendItem)[];
}

// Layer related types
interface LayerInfo {
	layer: L.Layer;
	visible: boolean;
	editable: boolean;
	showInLegend: boolean;
	legendSymbol?: string;
	legendLabel?: string;
	legendInfo: LegendInfo;
}

// Marker shape types
export type MarkerShape =
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

// Custom marker options
export interface CustomMarkerOptions {
	markerShape?: MarkerShape;
	fillColour?: string;
	fillOpacity?: number;
	size?: number;
	strokeColour?: string;
	strokeOpacity?: number;
	strokeWidth?: number;
}

// Leaflet marker options
export interface LeafletMarkerOptions {
	type: 'circle' | 'marker' | 'circleMarker' | 'divIcon';
	options: L.CircleMarkerOptions | L.MarkerOptions | L.DivIconOptions;
}

// Combined point symbology options
export interface PointSymbologyOptions {
	type: 'custom' | 'leaflet';
	options: CustomMarkerOptions | LeafletMarkerOptions;
}

export interface AddressPointSymbologyOptions extends PointSymbologyOptions {
	type: 'addressPoint';
	getSymbol: (feature: Feature) => string;
}

// Style function type
export type MarkerStyleFunction = (feature: GeoJSON.Feature) => PointSymbologyOptions;
export type PolygonStyleFunction = (feature: GeoJSON.Feature) => PolygonOptions;

export interface PolygonOptions extends L.PathOptions {
	fillColour?: string;
	fillOpacity?: number;
	colour?: string;
	weight?: number;
}

export interface ControlInfo {
	present: boolean;
	position?: L.ControlPosition;
}
