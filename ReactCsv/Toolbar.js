/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 */

import React from 'react';


// A toolbar containing a reset and (optional) export button. The export button
// is controlled via <Sheet> with <showExportButton> and will not work in IE<13.
var Toolbar = React.createClass({
  propTypes: {
    reset: React.PropTypes.func.isRequired,
    showExport: React.PropTypes.bool.isRequired,
    csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
  },
  createCSV: function() {
    // Reduce the data array into a CSV string.
    return this.props.csv.reduce((accRow, row) => {
      return accRow + row.reduce((accCol, col, i) => {
        return accCol +
          (col === null ? '""' : '"' + col.replace(/"/g, '""') + '"') +
          (i < row.length-1 ? ',' : '');
      }, '') + '\n';
    }, '');
  },
  getFileUrl: function() {
    // Get a link to the CSV file (will not work in IE<13).
    return URL.createObjectURL(new Blob([this.createCSV()], {type: 'text/csv'}));
  },
  render: function() {
    return (
      <div className="mt1">
        <button className="mr1 btn btn-primary bg-darken-4" onClick={this.props.reset}>Reset</button>
        {this.props.showExport ? <a className="ml1 btn btn-primary bg-darken-4" href={this.getFileUrl()} download="data.csv">Export to CSV</a> : null}
      </div>
    );
  }
});

export default Toolbar;
