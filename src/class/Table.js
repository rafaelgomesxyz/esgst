import { Shared } from './Shared';
import { DOM } from './DOM';

class Table {
	/**
	 * @param {Array[]} [values] A matrix containing the values of the table.
	 */
	constructor(values) {
		this.table = document.createElement('div');
		this.table.className = 'table esgst-ugd-table';
		DOM.build(this.table, 'inner', [
			['div', { class: 'table__heading' }],
			['div', { class: 'table__rows' }]
		]);
		this.heading = this.table.firstElementChild;
		this.rows = this.heading.nextElementSibling;
		this.rowGroups = {};
		this.hiddenColumns = [];
		this.numRows = 0;
		this.numColumns = 0;

		if (!values) {
			return this;
		}

		for (const column of values[0]) {
			if (column) {
				this.addColumn(column);
			}
		}
		const n = values.length;
		for (let i = 1; i < n; i++) {
			this.addRow(values[i]);
		}
	}

	clear() {
		this.rows.innerHTML = '';
		this.numRows = 0;
	}

	addCell(row, column, cellDetails) {
		if (!this.rows.children[row]) {
			const columns = [];

			for (let i = 0; i < this.numColumns; i++) {
				columns[i] = {
					size: 'fill',
					value: '-',
				};
			}

			this.addRow(columns);
		}

		const cell = typeof cellDetails === 'string' ? cellDetails : cellDetails.value;
		const additionalClasses = [].concat(cellDetails.additionalClasses || []);
		const alignment = cellDetails.alignment || 'center';
		const size = cellDetails.size || 'small';
		const attributes = {
			class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(' ')}`
		};

		if (cellDetails.attributes) {
			for (const attribute of cellDetails.attributes) {
				const parts = attribute.match(/(.+?)="(.+?)"/);
				attributes[parts[1]] = attributes[parts[2]];
			}
		}

		if (cell === 'Total') {
			attributes.class += ' esgst-bold';
		}

		return DOM.build(this.rows.children[row].firstElementChild.children[column], 'outer', [
			['div', attributes, cell],
		]);
	}

	addRow(columns, name, isCollapsibleGroup, isCollapsible, collapseMessage, expandMessage) {
		const row = DOM.build(this.rows, 'beforeEnd', [
			['div', { class: `table__row-outer-wrap ${name && isCollapsible ? 'esgst-hidden' : ''}` }, [
				['div', { class: 'table__row-inner-wrap' },
					name && isCollapsible
					? [
							['i', { class: 'fa fa-chevron-right' }]
						]
					: null
				]
			]]
		]).firstElementChild;
		let group = null;
		if (name) {
			if (isCollapsibleGroup) {
				group = this.rowGroups[name] = {
					collapsibles: [],
					columns: [],
					isCollapsible: true,
					row: row
				};
				const expand = DOM.build(row, 'afterBegin', [
					['i', { class: 'fa fa-plus-square esgst-clickable', title: expandMessage }],
					['i', { class: 'fa fa-minus-square esgst-clickable esgst-hidden', title: collapseMessage }]
				]);
				const collapse = expand.nextElementSibling;
				collapse.addEventListener('click', this.collapseRows.bind(this, collapse, expand, name));
				expand.addEventListener('click', this.expandRows.bind(this, collapse, expand, name));
			} else if (isCollapsible) {
				this.rowGroups[name].collapsibles.push(row);
			}
		}
		let isBold = false;
		for (let i = 0; i < this.numColumns; i++) {
			let cell = columns ? columns[i] : '';
			let additionalClasses = [];
			let additionalAttributes = null;
			let alignment = 'center';
			let size = 'small';
			if (cell && typeof cell === 'object' && !Array.isArray(cell)) {
				additionalClasses = additionalClasses.concat(cell.additionalClasses);
				additionalAttributes = cell.additionalAttributes;
				alignment = cell.alignment || alignment;
				size = cell.size || size;
				cell = cell.value;
			}
			if (this.hiddenColumns.indexOf(i) > -1) {
				additionalClasses.push('esgst-hidden');
			}
			if (i === 0 && cell && cell === 'Total') {
				isBold = true;
			}
			if (!cell || cell === `0 (0%)`) {
				additionalClasses.push('is-faded');
			}
			if (isBold) {
				additionalClasses.push('esgst-bold');
			}
			const attributes = {
				class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(' ')}`
			};
			if (additionalAttributes) {
				for (const attribute of additionalAttributes) {
					const parts = attribute.match(/(.+?)="(.+?)"/);
					attributes[parts[1]] = attributes[parts[2]];
				}
			}
			const column = DOM.build(row, 'beforeEnd', [
				['div', attributes, cell]
			]);
			if (group) {
				group.columns.push(column);
			}
		}
		this.numRows += 1;
	}

	/**
	 * @param column
	 * @property {string[]} column.additionalClasses
	 * @property {string} column.alignment
	 * @property {string[]} column.attributes
	 * @property {string} column.size
	 * @property {string} column.value
	 */
	addColumn(column) {
		const cell = typeof column === 'string' ? column : column.value;
		const additionalClasses = [].concat(column.additionalClasses);
		const alignment = column.alignment || 'center';
		const size = column.size || 'small';
		const attributes = {
			class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(' ')}`
		};
		if (column.attributes) {
			for (const attribute of column.attributes) {
				const parts = attribute.match(/(.+?)="(.+?)"/);
				attributes[parts[1]] = attributes[parts[2]];
			}
		}
		DOM.build(this.heading, 'beforeEnd', [
			['div', attributes, cell]
		]);
		if (cell === 'Total') {
			attributes.class += ' esgst-bold';
		}
		for (let i = 0; i < this.numRows; i++) {
			const row = this.rows.children[i];
			DOM.build(row, 'beforeEnd', [
				['div', attributes]
			]);
		}
		this.numColumns += 1;
	}

	hideColumns() {
		for (const column of arguments) {
			this.hiddenColumns.push(column - 1);
			this.heading.children[column - 1].classList.add('esgst-hidden');
			for (let i = this.numRows - 1; i > -1; i--) {
				this.rows.children[i].firstElementChild.children[column - 1].classList.add('esgst-hidden');
			}
		}
	}

	getRowGroup(name) {
		return this.rowGroups[name];
	}

	collapseRows(collapse, expand, name) {
		collapse.classList.add('esgst-hidden');
		expand.classList.remove('esgst-hidden');
		for (const row of this.rowGroups[name].collapsibles) {
			row.parentElement.classList.add('esgst-hidden');
		}
	}

	expandRows(collapse, expand, name) {
		expand.classList.add('esgst-hidden');
		collapse.classList.remove('esgst-hidden');
		for (const row of this.rowGroups[name].collapsibles) {
			row.parentElement.classList.remove('esgst-hidden');
		}
	}
}

export { Table };

