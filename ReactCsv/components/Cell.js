/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary A component controlling the table cells.
 * @module ReactCsv
 */

import React from 'react';


/**
 * Spreadsheet cells comprised of tiny form elements.
 * @extends React.Component
 */
export default class Cell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      styles: this.props.classHead || this.props.classFoot || ''
    };
  }

  /**
   * Prevent form submission and exit input mode.
   * @param {object} e A DOM event object.
   */
  _handleSubmit(e) {
    e.preventDefault(); /// Prevent form submit.
    document.activeElement.blur(); /// Unfocus this cell.
  }

  /**
   * Default React render function.
   * @return {object} A reference to the DOM component.
   */
  render() {
    return (
      <form className="m0 p0 container block" onSubmit={this._handleSubmit}>
        <input type="text" className={"col-12 border-none " + this.state.styles} value={this.props.csv} />
      </form>
    );
  }
}

/**
 * Restrict the property types.
 * @type {object}
 * @memberof Toolbar
 */
Cell.propTypes = {
  classHead: React.PropTypes.string,
  classFoot: React.PropTypes.string,
  csv: React.PropTypes.any
};
