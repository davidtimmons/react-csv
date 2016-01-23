/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * A React/Flux module that simulates a simple CSV spreadsheet.
 *
 * FEATURES:
 *   ++ Define number of columns and number of rows.
 *   ++ Create an optional footer row.
 *   ++ Create an optional download link (for modern browsers only.)
 *   ++ Undo a change with CTRL-Z.
 *   ++ Redo a change with CTRL-Y.
 *   ++ Export all data into a CSV file.
 *
 * BROWSERS:
 *   The optional data export feature requires a modern browser (e.g. IE13+)
 *   that supports HTML5 APIs.
 *
 * EXAMPLE:
 *   ReactDOM.render(
 *     <Sheet numCols={8} numRows={5} hasFooter={true} />,
 *     document.getElementById('react-csv')
 *   );
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Sheet from './components/Sheet';


ReactDOM.render(
  <Sheet numCols={8} numRows={5} hasFooter={true} showExportButton={true} />,
  document.getElementById('react-csv')
);
