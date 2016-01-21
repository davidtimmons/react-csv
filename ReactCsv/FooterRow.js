/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 */

import React from 'react';
import Cell from './Cell.js';


// (Optional) Spreadsheet footer row controlled via <Sheet> with <hasFooter>.
var FooterRow = React.createClass({
  propTypes: {
    saveChange: React.PropTypes.func.isRequired,
    csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
  },
  render: function() {
    var rows = this.props.numRows;
    var cells = Array(this.props.numCols).fill(0).map((val, i) =>
      <td className="p0 border-top border-right" key={10*rows + i} data-row={rows} onBlur={this.props.saveChange}>
        <Cell csv={this.props.csv[rows][i]} classFoot="bg-yellow muted bold" />
      </td>
    );
    return (
      <tfoot>
        <tr key={rows}>
          {cells}
        </tr>
      </tfoot>
    );
  }
});

export default FooterRow;
