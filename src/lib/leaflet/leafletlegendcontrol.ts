import L from 'leaflet';
import { writable, get } from 'svelte/store';

interface LegendItem {
	symbol: string;
	description: string;
}

interface GroupedLegendItem {
	groupName: string;
	items: LegendItem[];
}

interface LegendInfo {
	items: (LegendItem | GroupedLegendItem)[];
}
interface LayerInfo {
	layer: L.Layer;
	visible: boolean;
	editable: boolean;
	showInLegend: boolean;
	legendInfo: LegendInfo;
}

export class LeafletLegendControlClass extends L.Control {
	private container: HTMLElement;
	private legendContent: { [key: string]: HTMLElement } = {};
	private legendContentWrapper: HTMLElement;
	private map: L.Map;
	private isExpanded: boolean = false;
	private icon: HTMLElement;
	private layersStore: ReturnType<typeof writable<Record<string, LayerInfo>>>;

	constructor(
		map: L.Map,
		layersStore: ReturnType<typeof writable<Record<string, LayerInfo>>>,
		options?: L.ControlOptions
	) {
		super(options);
		this.map = map;
		this.layersStore = layersStore;
		this.container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-legend');
		this.container.style.backgroundColor = 'white';
		this.container.style.padding = '0';
		this.container.style.borderRadius = '4px';
		this.container.style.boxShadow = '0 1px 3px rgba(0,0,0,0.45)';

		// Create icon
		this.icon = L.DomUtil.create('div', 'legend-icon', this.container);
		this.icon.innerHTML = `
			<svg class="legend-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<rect class="dot-1" x="2" y="6" width="3" height="3"></rect>
				<line x1="11" y1="7.5" x2="22" y2="7.5"></line>
				<rect class="dot-2" x="2" y="12" width="3" height="3"></rect>
				<line x1="11" y1="13.5" x2="22" y2="13.5"></line>
				<rect class="dot-3" x="2" y="18" width="3" height="3"></rect>
				<line x1="11" y1="19.5" x2="22" y2="19.5"></line>
			</svg>
			`;
		this.icon.style.padding = '5px';
		this.icon.style.cursor = 'pointer';
		this.icon.style.display = 'flex';

		this.legendContentWrapper = L.DomUtil.create('div', 'legend-content-wrapper', this.container);
		this.legendContentWrapper.style.display = 'none';
		this.legendContentWrapper.style.padding = '10px';

		this.layersStore.subscribe((layers) => {
			this.updateLegendVisibility(layers);
		});
	}

	onAdd(map: L.Map): HTMLElement {
		L.DomEvent.disableClickPropagation(this.container);
		L.DomEvent.disableScrollPropagation(this.container);

		const title = L.DomUtil.create('h3', 'leaflet-legend-title', this.legendContentWrapper);
		title.textContent = 'Legend';

		L.DomEvent.on(this.container, 'mouseenter', this._expand, this);
		L.DomEvent.on(this.container, 'mouseleave', this._collapse, this);

		this.map = map;

		return this.container;
	}

	private _expand() {
		if (!this.isExpanded) {
			L.DomUtil.addClass(this.container, 'leaflet-control-legend-expanded');
			this.legendContentWrapper.style.display = 'block';
			this.icon.style.display = 'none'; // Hide the icon
			this.legendContentWrapper.style.height = 'auto';
			const acceptableHeight = this.map.getSize().y - (this.container.offsetTop + 50);
			if (acceptableHeight < this.legendContentWrapper.clientHeight) {
				L.DomUtil.addClass(this.legendContentWrapper, 'leaflet-control-legend-scrollbar');
				this.legendContentWrapper.style.height = `${acceptableHeight}px`;
			} else {
				L.DomUtil.removeClass(this.legendContentWrapper, 'leaflet-control-legend-scrollbar');
			}
			this.isExpanded = true;
		}
	}

	private _collapse() {
		if (this.isExpanded) {
			L.DomUtil.removeClass(this.container, 'leaflet-control-legend-expanded');
			this.legendContentWrapper.style.display = 'none';
			this.icon.style.display = 'flex'; // Show the icon
			this.isExpanded = false;
		}
	}
	addLegendContent(layerName: string, content: HTMLElement): void {
		// Remove existing content for this layer if it exists
		if (this.legendContent[layerName]) {
			this.container.removeChild(this.legendContent[layerName]);
			this.legendContentWrapper.removeChild(this.legendContent[layerName]);
		}

		// Create a wrapper for this layer's legend content
		const wrapper = L.DomUtil.create('div', 'leaflet-legend-layer', this.legendContentWrapper);
		wrapper.appendChild(content);

		// Store the wrapper so we can remove/update it later
		this.legendContent[layerName] = wrapper;

		// // Optionally, add a title for this layer
		// const layerTitle = L.DomUtil.create('h4', 'leaflet-legend-layer-title', wrapper);
		// layerTitle.textContent = layerName;

		// // Insert the new content before the layer title
		// wrapper.insertBefore(content, layerTitle.nextSibling);
		const layers = get(this.layersStore);
		this.updateLegendVisibility(layers);
	}

	removeLegendContent(layerName: string): void {
		if (this.legendContent[layerName]) {
			this.legendContentWrapper.removeChild(this.legendContent[layerName]);
			delete this.legendContent[layerName];
		}
	}

	updateLegendVisibility(layers: Record<string, LayerInfo>): void {
		Object.entries(layers).forEach(([layerName, layerInfo]) => {
			if (this.legendContent[layerName]) {
				this.legendContent[layerName].style.display = layerInfo.visible ? 'block' : 'none';
			}
		});
	}
}
