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
      actionType: ReactCsvConstants.UNDO
    });
  }

  /**
   * Activate the redo function. Triggered in <Sheet>.
   */
  redo() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.REDO
    });
  }

  /**
   * Activate the reset function. Triggered in <Toolbar>.
   */
  reset() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.RESET
    });
  }

  /**
   * Activate the save function. Triggered in <Cell>.
   */
  save() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.SAVE_INPUT
    });
  }

  /**
   * Configure the data store state object.
   * @param  {object} config Configuration settings to merge with state object.
   */
  configureDataStore(config) {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.CONFIGURE_DATA_STORE,
      config: config
    });
  }
};

export default new ReactCsvActions();
