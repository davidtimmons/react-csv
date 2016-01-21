/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 */

import React from 'react';
import Cell from './Cell.js';


// Spreadsheet body rows.
var BodyRows = React.createClass({
  propTypes: {
    saveChange: React.PropTypes.func.isRequired,
    csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
  },
  render: function() {
    var cells = (self =>
      Array(self.props.numRows).fill(0).map((val, i) =>
        <tr key={i+1}>
          {Array(self.props.numCols).fill(0).map((val, j) =>
            <td className="p0 border-right" key={10*(i+1) + j} data-row={i+1} onBlur={this.props.saveChange}>
              <Cell csv={this.props.csv[i+1][j]} />
            </td>
          )}
        </tr>
      )
    )(this);
    return (
      <tbody>
        {cells}
      </tbody>
    );
  }
});

export default BodyRows;
