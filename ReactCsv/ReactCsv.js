/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * A React + Flux app that simulates a simple CSV spreadsheet.
 *
 * FEATURES:
 *   ++ Define number of columns and number of rows.
 *   ++ Create an optional footer row.
 *   ++ Create an optional download link (for modern browsers only.)
 *   ++ Undo a change with CTRL-Z.
 *   ++ Redo a change with CTRL-Y.
 *   ++ Export all data into a CSV file.
 *
 * DEPENDENCIES:
 *   [React with Addons, JSX/ES2015 Transpiler, Basscss,
 *   IE13+ (export feature will not work in older IE versions)]
 *
 * EXAMPLE:
 *   ReactDOM.render(
 *     <Sheet numCols={8} numRows={5} hasFooter={true} />,
 *     document.getElementById('react-csv')
 *   );
 */

import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import './polyfills.js'


// ---------------- //
// REACT COMPONENTS //
// ---------------- //

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

// Primary high-level component that orchestrates pieces and maintains state.
var Sheet = React.createClass({
  propTypes: {
    numCols: React.PropTypes.number,
    numRows: React.PropTypes.number,
    hasFooter: React.PropTypes.bool,
    showExportButton: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      tableUndo: [],
      tableRedo: [],
      table: this.createEmptyTable()
    };
  },
  componentDidMount: function() {
    // Listen for keystrokes after the component attaches to the document.
    document.onkeydown = function(e) {
      // Undo: CTRL-Z | Redo: CTRL-Y
      if (e.ctrlKey && (e.key === 'z' || e.keyCode === 90 || e.which === 90) && this.state.tableUndo.length > 0) {
        this.undo();
      } else if (e.ctrlKey && (e.key === 'y' || e.keyCode === 89 || e.which === 89) && this.state.tableRedo.length > 0) {
        this.redo();
      }
    }.bind(this);
  },
  createEmptyTable: function() {
    // Create an empty 2D array of the specified size.
    var table = [];
    for (let i = 0, len = this.props.numRows; i < len; i++) {
      table.push(Array(this.props.numCols).fill(null));
    }
    return table;
  },
  undo: function() {
    // Undo the current data state.
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$splice: [[0, 1]]}),
      tableRedo: update(prevState.tableRedo, {$unshift: [JSON.stringify(prevState.table)]}),
      table: JSON.parse(prevState.tableUndo[0])
    }});
  },
  redo: function() {
    // Restore the previous data state.
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$unshift: [JSON.stringify(prevState.table)]}),
      tableRedo: update(prevState.tableRedo, {$splice: [[0, 1]]}),
      table: JSON.parse(prevState.tableRedo[0])
    }});
  },
  reset: function() {
    // Clear all data and destroy the redo queue.
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$unshift: [JSON.stringify(prevState.table)]}),
      tableRedo: [],
      table: this.createEmptyTable()
    }});
  },
  saveChange: function(e) {
    // Change nothing if the value is empty.
    switch (e.target.value) {
      case '':
      case null:
      case undefined:
        return;
    }
    // Update state with the new change and enable undo.
    const rowIndex = e.currentTarget.dataset.row;
    const colIndex = e.currentTarget.cellIndex;
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$unshift: [JSON.stringify(prevState.table)]}),
      tableRedo: [],
      table: update(prevState.table, {[rowIndex]: {$splice: [[colIndex, 1, e.target.value]]}})
    }});
  },
  render: function () {
    const cols = this.props.numCols;
    const rows = this.props.numRows;
    const table = this.state.table;
    const save = this.saveChange;
    return (
      <div>
        <table className="table-light overflow-hidden bg-white border">
          <HeaderRow numCols={cols} csv={table} saveChange={save} />
          <BodyRows numCols={cols} numRows={this.props.hasFooter ? rows-2 : rows-1} csv={table} saveChange={save} />
          {this.props.hasFooter ? <FooterRow numCols={cols} numRows={rows-1} csv={table} saveChange={save} /> : null}
        </table>
        <Toolbar csv={table} reset={this.reset} showExport={this.props.showExportButton} />
      </div>
    );
  }
});

// Optionally remove this and export <Sheet> as a module.
ReactDOM.render(
  <Sheet numCols={8} numRows={5} hasFooter={true} showExportButton={true} />,
  document.getElementById('react-csv')
);
