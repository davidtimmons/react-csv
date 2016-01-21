/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 */

import React from 'react';


// Spreadsheet cells comprised of tiny form elements.
var Cell = React.createClass({
  propTypes: {
    classHead: React.PropTypes.string,
    classFoot: React.PropTypes.string,
    csv: React.PropTypes.any
  },
  getInitialState: function() {
    return {
      styles: this.props.classHead || this.props.classFoot || ''
    };
  },
  handleSubmit: function(e) {
    e.preventDefault(); /// Prevent form submit.
    document.activeElement.blur(); /// Unfocus this cell.
  },
  render: function() {
    return (
      <form className="m0 p0 container block" onSubmit={this.handleSubmit}>
        <input type="text" className={"col-12 border-none " + this.state.styles} value={this.props.csv} />
      </form>
    );
  }
});

export default Cell;
