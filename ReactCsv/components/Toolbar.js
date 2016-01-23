/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary A component controlling the "clear" and "export" functions.
 * @module ReactCsv
 */

import React from 'react';
import ReactCsvActions from '../flux/ReactCsvActions';


/**
 * A toolbar containing a reset and (optional) export button. The export button
 * is controlled via <Sheet> with <showExportButton> and will not work in IE<13.
 * @extends React.Component
 */
export default class Toolbar extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Reduce the data array into a CSV string.
   */
  _createCsv() {
    return this.props.csv.reduce((accRow, row) => {
      return accRow + row.reduce((accCol, col, i) => {
        return accCol +
          (col === null ? '""' : '"' + col.replace(/"/g, '""') + '"') +
          (i < row.length-1 ? ',' : '');
      }, '') + '\n';
    }, '');
  }

  /**
   * Get a link to the CSV file (will not work in IE<13).
   * @return {object} The URL to an object blob containing the CSV file.
   */
  _getFileUrl() {
    return URL.createObjectURL(new Blob([this._createCsv()], {type: 'text/csv'}));
  }

  /**
   * Clear all data and destroy the redo queue.
   */
  _reset() {
    ReactCsvActions.reset();
  }

  /**
   * Default React render function.
   * @return {object} A reference to the DOM component.
   */
  render() {
    return (
      <div className="mt1">
        <button className="mr1 btn btn-primary bg-darken-4" onClick={this._reset}>Reset</button>
        {this.props.showExport ? <a className="ml1 btn btn-primary bg-darken-4" href={this._getFileUrl()} download="data.csv">Export to CSV</a> : null}
      </div>
    );
  }
}

/**
 * Restrict the property types.
 * @type {object}
 * @memberof Toolbar
 */
Toolbar.propTypes = {
  showExport: React.PropTypes.bool.isRequired,
  csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
};
