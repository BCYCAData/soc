import L from 'leaflet';

interface LegendItem {
	name: string;
	symbol: string | HTMLElement;
	visible: boolean;
}

export class LegendControl extends L.Control {
	private div!: HTMLElement;
	private legendItems: LegendItem[];

	constructor(options?: L.ControlOptions) {
		super(options);
		this.legendItems = [];
	}

	onAdd(map: L.Map): HTMLElement {
		this.div = L.DomUtil.create('div', 'info legend');
		this.update();
		return this.div;
	}

	update(): void {
		this.div.innerHTML = '';
		this.legendItems.forEach((item) => {
			const row = document.createElement('div');
			row.className = 'legend-item';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = item.visible;
			checkbox.disabled = true;
			row.appendChild(checkbox);

			const symbol = document.createElement('span');
			symbol.className = 'legend-symbol';
			if (typeof item.symbol === 'string') {
				symbol.innerHTML = item.symbol;
			} else {
				symbol.appendChild(item.symbol);
			}
			row.appendChild(symbol);

			const label = document.createElement('span');
			label.textContent = item.name;
			label.className = item.visible ? 'visible' : 'hidden';
			row.appendChild(label);

			this.div.appendChild(row);
		});
	}

	addLegendItem(item: LegendItem): void {
		this.legendItems.push(item);
		this.update();
	}

	updateLegendItem(name: string, updates: Partial<LegendItem>): void {
		const item = this.legendItems.find((i) => i.name === name);
		if (item) {
			Object.assign(item, updates);
			this.update();
		}
	}

	removeLegendItem(name: string): void {
		this.legendItems = this.legendItems.filter((item) => item.name !== name);
		this.update();
	}

	setVisibility(name: string, visible: boolean): void {
		const item = this.legendItems.find((i) => i.name === name);
		if (item) {
			item.visible = visible;
			this.update();
		}
	}
}
