/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary A component controlling the table header.
 * @module ReactCsv
 */

import React from 'react';
import Cell from './Cell';


/**
 * Spreadsheet header row intended for column titles.
 * @extends React.Component
 */
export default class HeaderRow extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Default React render function.
   * @return {object} A reference to the DOM component.
   */
  render() {
    var cells = this.props.csv[0].length === 0 ? null :
      Array(this.props.numCols).fill(0).map(
        (val, i) =>
          <th className="p0 border-right"
            key={i}
            data-row={0}
            onChange={this.props.update}
            onBlur={this.props.saveChange}>
            <Cell csv={this.props.csv[0][i]}
              classHead="bg-lighten-1 bold" />
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
}

/**
 * Restrict the property types.
 * @type {object}
 * @memberof HeaderRow
 */
HeaderRow.propTypes = {
  update: React.PropTypes.func.isRequired,
  saveChange: React.PropTypes.func.isRequired,
  csv: React.PropTypes.arrayOf(React.PropTypes.array.isRequired)
};
