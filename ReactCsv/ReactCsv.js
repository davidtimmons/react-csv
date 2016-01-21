/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * A React + Flux app that simulates a simple CSV spreadsheet.
 *
 * FEATURES:
 *   ++ Define number of columns and number of rows.
 *   ++ Create an optional footer row.
 *   ++ Create an optional download link (for modern browsers only.)
 *   ++ Undo a change with CTRL-Z.
 *   ++ Redo a change with CTRL-Y.
 *   ++ Export all data into a CSV file.
 *
 * DEPENDENCIES:
 *   [React with Addons, JSX/ES2015 Transpiler, Basscss,
 *   IE13+ (export feature will not work in older IE versions)]
 *
 * EXAMPLE:
 *   ReactDOM.render(
 *     <Sheet numCols={8} numRows={5} hasFooter={true} />,
 *     document.getElementById('react-csv')
 *   );
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Sheet from './Sheet.js';


// Optionally remove this and export <Sheet> as a module.
ReactDOM.render(
  <Sheet numCols={8} numRows={5} hasFooter={true} showExportButton={true} />,
  document.getElementById('react-csv')
);
