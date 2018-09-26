import {common} from '../modules/Common';

const
  createElements = common.createElements.bind(common)
;

export default class Table {
  /**
   * @param {Array[]} [values] A matrix containing the values of the table.
   */
  constructor(values) {
    this.table = document.createElement(`div`);
    this.table.className = `table esgst-ugd-table`;
    createElements(this.table, `inner`, [{
      attributes: {
        class: `table__heading`
      },
      type: `div`
    }, {
      attributes: {
        class: `table__rows`
      },
      type: `div`
    }]);
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
      this.addColumn(column);
    }
    const n = values.length;
    for (let i = 1; i < n; i++) {
      this.addRow(values[i]);
    }
  }
  addRow(columns, name, isCollapsibleGroup, isCollapsible, collapseMessage, expandMessage) {
    const row = createElements(this.rows, `beforeEnd`, [{
      attributes: {
        class: `table__row-outer-wrap ${name && isCollapsible ? `esgst-hidden` : ``}`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__row-inner-wrap`
        },
        type: `div`,
        children: name && isCollapsible ? [{
          attributes: {
            class: `fa fa-chevron-right`
          },
          type: `i`
        }] : null
      }]
    }]).firstElementChild;
    let group = null;
    if (name) {
      if (isCollapsibleGroup) {
        group = this.rowGroups[name] = {
          collapsibles: [],
          columns: [],
          isCollapsible: true,
          row: row
        };
        const expand = createElements(row, `afterBegin`, [{
          attributes: {
            class: `fa fa-plus-square esgst-clickable`,
            title: expandMessage
          },
          type: `i`
        }, {
          attributes: {
            class: `fa fa-minus-square esgst-clickable esgst-hidden`,
            title: collapseMessage
          },
          type: `i`
        }]);
        const collapse = expand.nextElementSibling;
        collapse.addEventListener(`click`, this.collapseRows.bind(this, collapse, expand, name));
        expand.addEventListener(`click`, this.expandRows.bind(this, collapse, expand, name));
      } else if (isCollapsible) {
        this.rowGroups[name].collapsibles.push(row);
      }
    }
    let isBold = false;
    for (let i = 0; i < this.numColumns; i++) {
      let cell = columns ? columns[i] : ``;
      let additionalClasses = [];
      let alignment = `center`;
      let size = `small`;
      if (cell && typeof cell === `object` && !Array.isArray(cell)) {
        additionalClasses = additionalClasses.concat(cell.additionalClasses);
        alignment = cell.alignment || alignment;
        size = cell.size || size;
        cell = cell.value;
      }
      if (this.hiddenColumns.indexOf(i) > -1) {
        additionalClasses.push(`esgst-hidden`);
      }
      if (i === 0 && cell && cell === `Total`) {
        isBold = true;
      }
      if (!cell || cell === `0 (0%)`) {
        additionalClasses.push(`is-faded`);
      }
      if (isBold) {
        additionalClasses.push(`esgst-bold`);
      }
      const attributes = {
        class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(` `)}`
      };
      if (cell.attributes) {
        for (const attribute of cell.attribute) {
          const parts = attribute.match(/(.+?)="(.+?)"/);
          attributes[parts[1]] = attributes[parts[2]];
        }
      }
      const column = createElements(row, `beforeEnd`, [{
        attributes,
        text: Array.isArray(cell) ? `` : cell,
        type: `div`,
        children: Array.isArray(cell) ? cell : null
      }]);
      if (group) {
        group.columns.push(column);
      }
    }
    this.numRows += 1;
  }

  /**
   * @param column
   * @param {string[]} column.additionalClasses
   * @param {string} column.alignment
   * @param {string[]} column.attributes
   * @param {string} column.size
   * @param {string} column.value
   */
  addColumn(column) {
    const cell = typeof column === `string` ? column : column.value;
    const additionalClasses = [].concat(column.additionalClasses);
    const alignment = column.alignment || `center`;
    const size = column.size || `small`;
    const attributes = {
      class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(` `)}`
    };
    if (column.attributes) {
      for (const attribute of column.attributes) {
        const parts = attribute.match(/(.+?)="(.+?)"/);
        attributes[parts[1]] = attributes[parts[2]];
      }
    }
    createElements(this.heading, `beforeEnd`, [{
      attributes,
      text: cell,
      type: `div`
    }]);
    if (cell === `Total`) {
      attributes.class += ` esgst-bold`;
    }
    for (let i = 0; i < this.numRows; i++) {
      const row = this.rows.children[i];
      createElements(row, `beforeEnd`, [{
        attributes,
        type: `div`
      }]);
    }
    this.numColumns += 1;
  }
  hideColumns() {
    for (const column of arguments) {
      this.hiddenColumns.push(column - 1);
      this.heading.children[column - 1].classList.add(`esgst-hidden`);
      for (let i = this.numRows.length - 1; i > -1; i--) {
        this.rows.children[i].firstElementChild.children[column - 1].classList.add(`esgst-hidden`);
      }
    }
  }
  getRowGroup(name) {
    return this.rowGroups[name];
  }
  collapseRows(collapse, expand, name) {
    collapse.classList.add(`esgst-hidden`);
    expand.classList.remove(`esgst-hidden`);
    for (const row of this.rowGroups[name].collapsibles) {
      row.parentElement.classList.add(`esgst-hidden`);
    }
  }
  expandRows(collapse, expand, name) {
    expand.classList.add(`esgst-hidden`);
    collapse.classList.remove(`esgst-hidden`);
    for (const row of this.rowGroups[name].collapsibles) {
      row.parentElement.classList.remove(`esgst-hidden`);
    }
  }
}
