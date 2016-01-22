/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary Flux app constants.
 * @module ReactCsv
 */

import keyMirror from 'keymirror';

// <keyMirror()> creates a map with values matching the keys.
export default keyMirror({
  UNDO: null,
  REDO: null,
  RESET: null,
  SAVE_INPUT: null,
  CONFIGURE_DATA_STORE: null
});
