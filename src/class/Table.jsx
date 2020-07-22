import { Shared } from './Shared';
import { DOM } from './DOM';

class Table {
	/**
	 * @param {Array[]} [values] A matrix containing the values of the table.
	 */
	constructor(values) {
		this.table = document.createElement('div');
		this.table.className = 'table esgst-ugd-table';
		DOM.insert(
			this.table,
			'atinner',
			<fragment>
				<div className="table__heading" ref={(ref) => (this.heading = ref)}></div>
				<div className="table__rows" ref={(ref) => (this.rows = ref)}></div>
			</fragment>
		);
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
			className: `table__column--width-${size} text-${alignment} ${additionalClasses.join(' ')}`,
		};

		if (cellDetails.attributes) {
			for (const attribute of cellDetails.attributes) {
				const parts = attribute.match(/(.+?)="(.+?)"/);
				attributes[parts[1]] = attributes[parts[2]];
			}
		}

		if (cell === 'Total') {
			attributes.className += ' esgst-bold';
		}

		let cellEl;
		DOM.insert(
			this.rows.children[row].firstElementChild.children[column],
			'atouter',
			<div {...attributes} ref={(ref) => (cellEl = ref)}>
				{cell}
			</div>
		);
		return cellEl;
	}

	addRow(columns, name, isCollapsibleGroup, isCollapsible, collapseMessage, expandMessage) {
		let row;
		DOM.insert(
			this.rows,
			'beforeend',
			<div className={`table__row-outer-wrap ${name && isCollapsible ? 'esgst-hidden' : ''}`}>
				<div className="table__row-inner-wrap" ref={(ref) => (row = ref)}>
					{name && isCollapsible ? <i className="fa fa-chevron-right"></i> : null}
				</div>
			</div>
		);
		let group = null;
		if (name) {
			if (isCollapsibleGroup) {
				group = this.rowGroups[name] = {
					collapsibles: [],
					columns: [],
					isCollapsible: true,
					row: row,
				};
				let expand, collapse;
				DOM.insert(
					row,
					'afterbegin',
					<fragment>
						<i
							className="fa fa-plus-square esgst-clickable"
							title={expandMessage}
							ref={(ref) => (expand = ref)}
						></i>
						<i
							className="fa fa-minus-square esgst-clickable esgst-hidden"
							title={collapseMessage}
							ref={(ref) => (collapse = ref)}
						></i>
					</fragment>
				);
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
			if (cell && typeof cell === 'object' && !(cell instanceof Node)) {
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
				className: `table__column--width-${size} text-${alignment} ${additionalClasses.join(' ')}`,
			};
			if (additionalAttributes) {
				for (const attribute of additionalAttributes) {
					const parts = attribute.match(/(.+?)="(.+?)"/);
					attributes[parts[1]] = attributes[parts[2]];
				}
			}
			let column;
			DOM.insert(
				row,
				'beforeend',
				<div {...attributes} ref={(ref) => (column = ref)}>
					{cell}
				</div>
			);
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
			className: `table__column--width-${size} text-${alignment} ${additionalClasses.join(' ')}`,
		};
		if (column.attributes) {
			for (const attribute of column.attributes) {
				const parts = attribute.match(/(.+?)="(.+?)"/);
				attributes[parts[1]] = attributes[parts[2]];
			}
		}
		DOM.insert(this.heading, 'beforeend', <div {...attributes}>{cell}</div>);
		if (cell === 'Total') {
			attributes.className += ' esgst-bold';
		}
		for (let i = 0; i < this.numRows; i++) {
			const row = this.rows.children[i];
			DOM.insert(row, 'beforeend', <div {...attributes}></div>);
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
