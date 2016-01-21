/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 */

import React from 'react';
import Cell from './Cell.js';


// Spreadsheet header row intended for column titles.
var HeaderRow = React.createClass({
  propTypes: {
    saveChange: React.PropTypes.func.isRequired,
    csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
  },
  render: function () {
    var cells = Array(this.props.numCols).fill(0).map((val, i) =>
      <th className="p0 border-right" key={i} data-row={0} onBlur={this.props.saveChange}>
        <Cell csv={this.props.csv[0][i]} classHead="bg-lighten-1 bold" />
      </th>
    );
    return (
      <thead className="bg-darken-1">
        <tr key={0}>
          {cells}
        </tr>
      </thead>
    );
  }
});

export default HeaderRow;
