/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary A component controlling the main table body rows.
 * @module ReactCsv
 */

import React from 'react';
import Cell from './Cell';


/**
 * Spreadsheet body rows.
 * @extends React.Component
 */
export default class BodyRows extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Default React render function.
   * @return {object} A reference to the DOM component.
   */
  render() {
    var cells = this.props.csv[0].length === 0 ? null :
      (self => Array(self.props.numRows).fill(0).map(
        (val, i) =>
          <tr key={i+1}>
          {Array(self.props.numCols).fill(0).map(
              (val, j) =>
                <td className="p0 border-right"
                  key={10*(i+1) + j}
                  data-row={i+1}
                  onBlur={this.props.saveChange}>
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
}

/**
 * Restrict the property types.
 * @type {object}
 * @memberof BodyRows
 */
BodyRows.propTypes = {
  saveChange: React.PropTypes.func.isRequired,
  csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
};
