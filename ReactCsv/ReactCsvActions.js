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


var ReactCsvActions = {
  reset: function() {
    ReactCsvDispatcher.dispatch({
      actionType: ReactCsvConstants.RESET
    });
  }
};

export default ReactCsvActions;
