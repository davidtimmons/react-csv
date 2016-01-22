/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary A Flux data store for the spreadsheet components.
 * @module ReactCsv
 */

import ReactCsvDispatcher from './ReactCsvDispatcher';
import EventEmitter from 'events';
import ReactCsvConstants from './ReactCsvConstants';
import './polyfills'


// This is the master CSV data store.
var _dataStore = {
  tableUndo: [],
  tableRedo: [],
  table: [],
  numRows: 0,
  numCols: 0
}


// ----------------- //
// UTILITY FUNCTIONS //
// ----------------- //

/**
 * Create an empty 2D array of the specified size.
 * @return {[[null]]} An array of null arrays.
 */
function createEmptyTable() {
  var table = [];
  for (let i = 0, len = _dataStore.numRows; i < len; i++) {
    table.push(Array(_dataStore.numCols).fill(null));
  }
  return table;
}

/**
 * Clear all data and destroy the redo queue.
 */
function reset() {
  _dataStore.tableUndo.unshift(JSON.stringify(_dataStore.table));
  _dataStore.tableRedo = [];
  _dataStore.table = createEmptyTable();
}


// -------------- //
// DATA STORE API //
// -------------- //

const CHANGE_EVENT = 'change';

/**
 * Register event handlers and define a public API.
 */
var ReactCsvStore = Object.assign({}, EventEmitter.prototype, {
  addChangeListener: function(next) {
    this.on(CHANGE_EVENT, next);
  },

  removeChangeListener: function(next) {
    this.removeListener(CHANGE_EVENT, next);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getAll: function() {
    return _dataStore;
  },

  setDimensions(numRows, numCols) {
    _dataStore.numRows = numRows;
    _dataStore.numCols = numCols;
  }
});


// -------- //
// DISPATCH //
// -------- //

/**
 * Register callbacks to handle app events. Payload contains an event object.
 */
ReactCsvDispatcher.register(function(payload) {
  switch (payload.actionType) {
    case ReactCsvConstants.UNDO:
      break;
    case ReactCsvConstants.REDO:
      break;
    case ReactCsvConstants.RESET:
      reset();
      ReactCsvStore.emitChange();
      break;
    case ReactCsvConstants.SAVE_INPUT:
      break;
    case ReactCsvConstants.CREATE_EMPTY_TABLE:
      break;
    default:
      // No operation needed!
      break;
  }
});

export default ReactCsvStore;
