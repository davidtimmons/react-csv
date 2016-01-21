/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary An optional component controlling the table footer.
 * @module ReactCsv/FooterRow
 */

import React from 'react';
import Cell from './Cell.js';


/**
 * (Optional) Spreadsheet footer row controlled via <Sheet> with <hasFooter>.
 * @extends React.Component
 */
export default class FooterRow extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Default React render function.
   * @return {object} A reference to the DOM component.
   */
  render() {
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
}

/**
 * Restrict the property types.
 * @type {object}
 * @memberof FooterRow
 */
FooterRow.propTypes = {
  saveChange: React.PropTypes.func.isRequired,
  csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
};
