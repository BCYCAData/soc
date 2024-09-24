<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import L from 'leaflet';
	import { LeafletLegendControlClass } from '$lib/leaflet/leafletlegendcontrol';
	import type { Writable } from 'svelte/store';

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

	interface Props {
		position?: L.ControlPosition;
	}

	let { position = 'bottomleft' }: Props = $props();

	let leafletMap: L.Map;
	let leaflet: typeof L;
	const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
	}>('leafletContext');

	const layersStore: Writable<Record<string, LayerInfo>> = getLeafletLayers();

	let addedLayers = new Set<string>();
	let customControl: LeafletLegendControlClass;

	onMount(() => {
		let unsubscribe: (() => void) | undefined;
		leafletMap = getLeafletMap();
		leaflet = getLeaflet();
		customControl = new LeafletLegendControlClass(leafletMap, layersStore, { position });
		leafletMap.addControl(customControl);

		unsubscribe = layersStore.subscribe((layers: Record<string, LayerInfo>) => {
			Object.entries(layers).forEach(([name, layerInfo]) => {
				if (layerInfo.showInLegend && !addedLayers.has(name)) {
					updateLegend(name, layerInfo.legendInfo, layerInfo.visible);
					addedLayers.add(name);
				}
			});
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	function updateLegend(name: string, legendInfo: LegendInfo, visible: boolean) {
		legendInfo.items.forEach((item) => {
			if ('groupName' in item) {
				// It's a GroupedLegendItem
				const groupElement = document.createElement('div');
				groupElement.className = 'legend-group';
				const groupTitle = document.createElement('h4');
				groupTitle.textContent = item.groupName;
				groupElement.appendChild(groupTitle);

				item.items.forEach((subItem) => {
					const itemElement = createLegendItemElement(subItem, visible);
					groupElement.appendChild(itemElement);
				});

				customControl.addLegendContent(name, groupElement);
			} else {
				// It's a LegendItem
				const itemElement = createLegendItemElement(item, visible);
				customControl.addLegendContent(name, itemElement);
			}
		});
	}
	interface LegendItem {
		symbol: string;
		description: string;
	}

	function createLegendItemElement(
		item: LegendItem,
		visible: boolean,
		verticalSpacing: number = 0
	): HTMLElement {
		const itemElement = document.createElement('div');
		itemElement.className = 'legend-item';
		itemElement.style.cssText = `
				opacity: ${visible ? '1' : '0.5'};
				display: flex;
				align-items: center;
				margin-bottom: ${verticalSpacing}px;
				padding: ${verticalSpacing / 2}px 0;
			`;

		const symbolContainer = document.createElement('div');
		symbolContainer.className = 'symbol-container';
		symbolContainer.style.cssText = `
			width: 30px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 10px;
		`;

		const symbolElement = document.createElement('span');
		symbolElement.className = 'legend-symbol';
		symbolElement.innerHTML = item.symbol;

		symbolContainer.appendChild(symbolElement);

		const descriptionElement = document.createElement('span');
		descriptionElement.className = 'legend-description';
		descriptionElement.textContent = item.description;
		descriptionElement.style.flex = '1';

		itemElement.appendChild(symbolContainer);
		itemElement.appendChild(descriptionElement);

		return itemElement;
	}

	// Function to create multiple legend items with custom spacing
	function createLegendItems(items: LegendItem[], verticalSpacing: number = 0): DocumentFragment {
		const fragment = document.createDocumentFragment();

		items.forEach((item, index) => {
			const itemElement = createLegendItemElement(item, true, verticalSpacing);

			// Remove margin-bottom from the last item
			if (index === items.length - 1) {
				itemElement.style.marginBottom = '0';
			}

			fragment.appendChild(itemElement);
		});

		return fragment;
	}

	// function createLegendItemElement(item: LegendItem, visible: boolean): HTMLElement {
	// 	const itemElement = document.createElement('div');
	// 	itemElement.className = 'legend-item';
	// 	itemElement.style.opacity = visible ? '1' : '0.5';
	// 	itemElement.style.display = 'flex';
	// 	itemElement.style.alignItems = 'center';

	// 	const symbolElement = document.createElement('span');
	// 	symbolElement.className = 'legend-symbol';
	// 	symbolElement.innerHTML = item.symbol;
	// 	symbolElement.style.marginRight = '5px';

	// 	const descriptionElement = document.createElement('span');
	// 	descriptionElement.className = 'legend-description';
	// 	descriptionElement.textContent = item.description;

	// 	itemElement.appendChild(symbolElement);
	// 	itemElement.appendChild(descriptionElement);

	// 	return itemElement;
	// }

	onDestroy(() => {
		if (leafletMap && customControl) {
			leafletMap.removeControl(customControl);
		}
	});
</script>
