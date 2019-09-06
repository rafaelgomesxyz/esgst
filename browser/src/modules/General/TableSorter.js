import { Module } from '../../class/Module';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  sortContent = common.sortContent.bind(common)
  ;

class GeneralTableSorter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-sort` }],
            ` if the table is sorted by the default order, `,
            [`i`, { class: `fa fa-sort-asc` }],
            ` if it is sorted by ascending order and `,
            [`i`, { class: `fa fa-sort-desc` }],
            ` if it is sorted by descending order) to the heading of each table's column (in any page) that allows you to sort the table by the values of the column.`
          ]]
        ]]
      ],
      id: `ts`,
      name: `Table Sorter`,
      sg: true,
      st: true,
      type: `general`,
      featureMap: {
        endless: this.ts_getTables.bind(this)
      }
    };
  }

  ts_getTables(context, main, source, endless) {
    const tables = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table, .esgst-es-page-${endless}.table` : `.table`}, ${endless ? `.esgst-es-page-${endless} table, .esgst-es-page-${endless}table` : `table`}`);
    for (let i = 0, n = tables.length; i < n; ++i) {
      this.ts_setTable(tables[i]);
    }
    if (!endless && !gSettings.us) {
      this.ts_sortTables();
    }
  }

  ts_sortTables() {
    let i, tsTable;
    for (i = this.esgst.tsTables.length - 1; i > -1; --i) {
      tsTable = this.esgst.tsTables[i];
      if (tsTable.columnName) {
        sortContent(this.ts_getArray(tsTable.columnName, tsTable.columnIndex, tsTable.table), `${tsTable.key}_${tsTable.name}`);
      }
    }
  }

  ts_setTable(table) {
    let button, columnName, columns, heading, tsTable;
    heading = table.querySelector(`.table__heading, .header, thead`);
    if (!heading) return;
    tsTable = {
      columnName: ``,
      key: `sortIndex`,
      name: `asc`,
      outerWrap: table,
      table: table
    };
    this.esgst.tsTables.push(tsTable);
    columns = heading.querySelectorAll(`.table__column--width-fill, .table__column--width-medium, .table__column--width-small, .column_flex, .column_medium, .column_small, th`);
    for (let i = 0, n = columns.length; i < n; ++i) {
      let column = columns[i];
      columnName = column.textContent.trim();
      if (!columnName.match(/^(Keys|Key|Not\sReceived|Remove)$/) && (!this.esgst.wonPath || !columnName.match(/^Received$/)) && !column.getElementsByClassName(`esgst-ts-button`)[0]) {
        button = createElements(column, `beforeEnd`, [{
          attributes: {
            class: `esgst-ts-button esgst-clickable`
          },
          type: `span`
        }]);
        this.ts_addDescButton(button, columnName, i, table, tsTable);
      }
    }
  }

  ts_addAscButton(button, columnName, i, table, tsTable) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-sort-desc`,
        title: `${getFeatureTooltip(`ts`, `Currently sorted descending. Click to sort ascending.`)}`
      },
      type: `i`
    }]);
    button.firstElementChild.addEventListener(`click`, this.ts_sortTable.bind(this, button, columnName, i, `asc`, table, tsTable));
  }

  ts_addDescButton(button, columnName, i, table, tsTable) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-sort`,
        title: `${getFeatureTooltip(`ts`, `Currently sorted by default. Click to sort descending.`)}`
      },
      type: `i`
    }]);
    button.firstElementChild.addEventListener(`click`, this.ts_sortTable.bind(this, button, columnName, i, `desc`, table, tsTable));
  }

  ts_addDefButton(button, columnName, i, table, tsTable) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-sort-asc`,
        title: `${getFeatureTooltip(`ts`, `Currently sorted ascending. Click to sort by default.`)}`
      },
      type: `i`
    }]);
    button.firstElementChild.addEventListener(`click`, this.ts_sortTable.bind(this, button, columnName, i, `def`, table, tsTable));
  }

  ts_sortTable(button, columnName, i, key, table, tsTable) {
    tsTable.columnName = columnName;
    tsTable.columnIndex = i;
    tsTable.key = key === `def` ? `sortIndex` : `value`;
    tsTable.name = key;
    if (key === `desc`) {
      sortContent(this.ts_getArray(columnName, i, table), `value_${key}`);
      this.ts_addAscButton(button, columnName, i, table, tsTable);
    } else if (key === `asc`) {
      sortContent(this.ts_getArray(columnName, i, table), `value_${key}`);
      this.ts_addDefButton(button, columnName, i, table, tsTable);
    } else {
      sortContent(this.ts_getArray(columnName, i, table), `sortIndex_asc`);
      this.ts_addDescButton(button, columnName, i, table, tsTable);
    }
  }

  ts_getArray(columnName, i, table) {
    let array, column, element, j, match, n, row, rows, value;
    array = [];
    rows = table.querySelectorAll(`.table__row-outer-wrap, .row_outer_wrap, tbody tr`);
    let isNumeric = false;
    for (j = 0, n = rows.length; j < n; ++j) {
      row = rows[j];
      column = row.querySelectorAll(`.table__column--width-fill, .table__column--width-medium, .table__column--width-small, .column_flex, .column_medium, .column_small, td`)[i];
      value = column && column.textContent.trim();
      element = {
        outerWrap: row,
        sortIndex: 0,
        value: undefined
      };
      if (row.hasAttribute(`data-sort-index`)) {
        element.sortIndex = parseInt(row.getAttribute(`data-sort-index`));
      } else {
        element.sortIndex = j;
        row.setAttribute(`data-sort-index`, j);
      }
      if ((value && value.length > 0) || columnName === `Trending`) {
        if (column.hasAttribute(`data-sort-value`)) {
          element.value = parseFloat(column.getAttribute(`data-sort-value`));
        } else {
          switch (columnName) {
            case `Trending`:
              element.value = column.getElementsByClassName(`fa-caret-up`).length - column.getElementsByClassName(`fa-caret-down`).length;
              break;
            case `Added`:
            case `Creation Date`:
            case `Date Entered`:
            case `First Giveaway`:
            case `Last Giveaway`:
            case `Last Online`:
            case `Last Post`:
            case `Last Update`:
              try {
                element.value = value.match(/Online|Open/) ? Date.now() : parseInt(column.querySelector(`[data-timestamp]`).getAttribute(`data-timestamp`)) * 1e3;
              } catch (e) {
                element.value = 0;
              }
              break;
            case `Game`:
            case `Giveaway`:
            case `Group`:
            case `Status`:
            case `Summary`:
            case `Type`:
            case `User`:
            case `Winner(s)`:
              element.value = value;
              break;
            default:
              if (value.match(/\d+\.\d+/)) {
                element.value = parseFloat(value.replace(/[,$]/g, ``));
                if (isNaN(element.value)) {
                  element.value = value;
                } else {
                  isNumeric = true;
                }
              } else {
                match = value.replace(/,/g, ``).match(/\d+/);
                if (match) {
                  element.value = parseFloat(match[0]);
                  isNumeric = true;
                } else {
                  element.value = value;
                }
              }
              break;
          }
        }
      } else {
        element.value = 0;
      }
      array.push(element);
    }
    if (isNumeric) {
      for (let i = array.length - 1; i > -1; i--) {
        let element = array[i];
        if (typeof element.value === `string`) {
          element.value = 0;
        }
      }
    }
    return array;
  }
}

const generalTableSorter = new GeneralTableSorter();

export { generalTableSorter };