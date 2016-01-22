/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary Flux action creators.
 * @module ReactCsv
 */

import ReactCsvDispatcher from './ReactCsvDispatcher';
import ReactCsvConstants from './ReactCsvConstants';


class ReactCsvActions {

  constructor() {}

  /**
   * Activate the undo function. Triggered in <Sheet>.
   */
  undo() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.UNDO,
      data: null
    });
  }

  /**
   * Activate the redo function. Triggered in <Sheet>.
   */
  redo() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.REDO,
      data: null
    });
  }

  /**
   * Activate the reset function. Triggered in <Toolbar>.
   */
  reset() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.RESET,
      data: null
    });
  }

  /**
   * Activate the save function. Triggered in <Cell>.
   */
  save(e) {
    switch (e.target.value) {
      case '':
      case null:
      case undefined:
        return;
    }
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.SAVE_INPUT,
      data: e
    });
  }

  /**
   * Configure the data store state object.
   * @param  {object} config Configuration settings to merge with state object.
   */
  configureDataStore(config) {
    if (typeof config !== 'object') {
      return;
    }
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.CONFIGURE_DATA_STORE,
      data: config
    });
  }
};

export default new ReactCsvActions();
