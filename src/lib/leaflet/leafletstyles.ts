import type L from 'leaflet';

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
				className: 'text-label',
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
