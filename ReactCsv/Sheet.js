/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary The top-level component class for the ReactCsv module.
 * @module ReactCsv/Sheet
 */

import React from 'react';
import update from 'react-addons-update';
import './polyfills.js';
import Cell from './Cell.js';
import HeaderRow from './HeaderRow.js';
import BodyRows from './BodyRows.js';
import FooterRow from './FooterRow.js';
import Toolbar from './Toolbar.js';


/**
 * Primary high-level component that orchestrates pieces and maintains state.
 * @extends React.Component
 */
export default class Sheet extends React.Component {

  constructor(props) {
    super(props);
    // This is equivalent to <getInitialState()>.
    this.state = {
      tableUndo: [],
      tableRedo: [],
      table: this._createEmptyTable()
    };
  }

  /**
   * Listen for keystrokes after the component attaches to the document.
   */
  componentDidMount() {
    document.onkeydown = function(e) {
      // Undo: CTRL-Z | Redo: CTRL-Y
      if (e.ctrlKey && (e.key === 'z' || e.keyCode === 90 || e.which === 90) && this.state.tableUndo.length > 0) {
        this._undo();
      } else if (e.ctrlKey && (e.key === 'y' || e.keyCode === 89 || e.which === 89) && this.state.tableRedo.length > 0) {
        this._redo();
      }
    }.bind(this);
  }

  /**
   * Create an empty 2D array of the specified size.
   * @return {[[null]]} An array of null arrays.
   */
  _createEmptyTable() {
    var table = [];
    for (let i = 0, len = this.props.numRows; i < len; i++) {
      table.push(Array(this.props.numCols).fill(null));
    }
    return table;
  }

  /**
   * Undo the current data state.
   */
  _undo() {
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$splice: [[0, 1]]}),
      tableRedo: update(prevState.tableRedo, {$unshift: [JSON.stringify(prevState.table)]}),
      table: JSON.parse(prevState.tableUndo[0])
    }});
  }

  /**
   * Restore the previous data state.
   */
  _redo() {
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$unshift: [JSON.stringify(prevState.table)]}),
      tableRedo: update(prevState.tableRedo, {$splice: [[0, 1]]}),
      table: JSON.parse(prevState.tableRedo[0])
    }});
  }

  /**
   * Clear all data and destroy the redo queue.
   */
  _reset() {
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$unshift: [JSON.stringify(prevState.table)]}),
      tableRedo: [],
      table: this._createEmptyTable()
    }});
  }

  /**
   * Update state with the new change and enable undo.
   * @param {object} e A DOM event object.
   */
  _saveChange(e) {
    switch (e.target.value) {
      case '':
      case null:
      case undefined:
        return;
    }
    const rowIndex = e.currentTarget.dataset.row;
    const colIndex = e.currentTarget.cellIndex;
    this.setState((prevState) => {return {
      tableUndo: update(prevState.tableUndo, {$unshift: [JSON.stringify(prevState.table)]}),
      tableRedo: [],
      table: update(prevState.table, {[rowIndex]: {$splice: [[colIndex, 1, e.target.value]]}})
    }});
  }

  /**
   * Default React render function.
   * @return {object} A reference to the DOM component.
   */
  render() {
    const cols = this.props.numCols;
    const rows = this.props.numRows;
    const table = this.state.table;
    const save = this._saveChange.bind(this);
    const reset = this._reset.bind(this);
    return (
      <div>
        <table className="table-light overflow-hidden bg-white border">
          <HeaderRow numCols={cols} csv={table} saveChange={save} />
          <BodyRows numCols={cols} numRows={this.props.hasFooter ? rows-2 : rows-1} csv={table} saveChange={save} />
          {this.props.hasFooter ? <FooterRow numCols={cols} numRows={rows-1} csv={table} saveChange={save} /> : null}
        </table>
        <Toolbar csv={table} reset={reset} showExport={this.props.showExportButton} />
      </div>
    );
  }
}

/**
 * Restrict the property types.
 * @type {object}
 * @memberof Sheet
 */
Sheet.propTypes = {
  numCols: React.PropTypes.number,
  numRows: React.PropTypes.number,
  hasFooter: React.PropTypes.bool,
  showExportButton: React.PropTypes.bool
};
