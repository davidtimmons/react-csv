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
import ReactCsvConstants from './ReactCsvConstants';
import EventEmitter from 'events';
import '../polyfills'


// This is the master CSV data store. Initialized in <initializeDataStore()>.
var _dataStore = {};


// ----------------- //
// UTILITY FUNCTIONS //
// ----------------- //

/**
 * Create an empty 2D array of the specified size.
 * @param  {number} numRows The number of table rows.
 * @param  {number} numCols The number of column rows.
 * @return {[[null]]} An array of null arrays.
 */
function createEmptyTable(numRows, numCols) {
  var table = [];
  for (let i = 0, len = numRows; i < len; i++) {
    table.push(Array(numCols).fill(null));
  }
  return table;
}

/**
 * Create the data store based on custom table size settings.
 * @param {object} data Data store configuration settings.
 */
function initializeDataStore(data) {
  var numRows = data.numRows || 0;
  var numCols = data.numCols || 0;
  _dataStore.tableUndo = [];
  _dataStore.tableRedo = [];
  _dataStore.table = createEmptyTable(numRows, numCols);
  _dataStore = Object.assign(_dataStore, data);
}

/**
 * Undo the current data state.
 */
function undo() {
  _dataStore.tableRedo.unshift(JSON.stringify(_dataStore.table));
  _dataStore.table = JSON.parse(_dataStore.tableUndo.shift());
}

/**
 * Restore the previous data state.
 */
function redo() {
  _dataStore.tableUndo.unshift(JSON.stringify(_dataStore.table));
  _dataStore.table = JSON.parse(_dataStore.tableRedo.shift());
}

/**
 * Clear all data and destroy the redo queue.
 */
function reset() {
  _dataStore.tableUndo.unshift(JSON.stringify(_dataStore.table));
  _dataStore.tableRedo = [];
  _dataStore.table = createEmptyTable(_dataStore.numRows, _dataStore.numCols);
}

/**
 * Update state with the new change and enable undo.
 * @param {object} e A DOM event object.
 */
function save(e) {
  var rowIndex = e.currentTarget.dataset.row;
  var colIndex = e.currentTarget.cellIndex;
  _dataStore.tableUndo.unshift(JSON.stringify(_dataStore.table));
  _dataStore.tableRedo = [];
  _dataStore.table[rowIndex][colIndex] = e.target.value;
}

// -------------- //
// DATA STORE API //
// -------------- //

const CHANGE_EVENT = 'change';

/**
 * Register event handlers using Node.js EventEmitter and define a public API.
 */
var ReactCsvStore = Object.assign({}, EventEmitter.prototype, {

  /**
   * Register a listener with a callback.
   * @param  {function} next The registered callback.
   */
  addChangeListener: function(next) {
    this.on(CHANGE_EVENT, next);
  },

  /**
   * Remove a listener.
   * @param  {function} next The registered callback.
   */
  removeChangeListener: function(next) {
    this.removeListener(CHANGE_EVENT, next);
  },

  /**
   * Signal a change has occurred.
   * @param  {function} next The registered callback.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Get the state stored in this data store.
   * @return {object} CSV table state object containing all cell values.
   */
  getAll: function() {
    return _dataStore;
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
      undo();
      ReactCsvStore.emitChange();
      break;
    case ReactCsvConstants.REDO:
      redo();
      ReactCsvStore.emitChange();
      break;
    case ReactCsvConstants.RESET:
      reset();
      ReactCsvStore.emitChange();
      break;
    case ReactCsvConstants.SAVE_INPUT:
      save(payload.data);
      ReactCsvStore.emitChange();
      break;
    case ReactCsvConstants.CONFIGURE_DATA_STORE:
      initializeDataStore(payload.data);
      ReactCsvStore.emitChange();
      break;
    default: /// No operation needed!
      break;
  }
});

export default ReactCsvStore;
