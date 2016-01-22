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
import './polyfills';
import Cell from './Cell.js';
import HeaderRow from './HeaderRow.js';
import BodyRows from './BodyRows.js';
import FooterRow from './FooterRow.js';
import Toolbar from './Toolbar.js';
import ReactCsvStore from './ReactCsvStore';
import ReactCsvActions from './ReactCsvActions';


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
      table: ReactCsvStore.getEmptyTable(props.numRows, props.numCols)
    };
  }

  /**
   * Add the table dimensions to the data store.
   */
  componentWillMount() {
    ReactCsvActions.configureDataStore({
      numRows: this.props.numRows,
      numCols: this.props.numCols
    });
  }

  /**
   * Listen for keystrokes and change events after the component attaches to
   * the document.
   */
  componentDidMount() {
    document.onkeydown = function(e) {
      // Listen for keystrokes.
      // Undo: CTRL-Z | Redo: CTRL-Y
      if (e.ctrlKey && (e.key === 'z' || e.keyCode === 90 || e.which === 90) && this.state.tableUndo.length > 0) {
        ReactCsvActions.undo();
      } else if (e.ctrlKey && (e.key === 'y' || e.keyCode === 89 || e.which === 89) && this.state.tableRedo.length > 0) {
        this._redo();
      }
    }.bind(this);

    // Listen for events.
    ReactCsvStore.addChangeListener(this._onChange.bind(this));
  }

  /**
   * Remove the change listener once the component disappears to save memory.
   */
  componentWillUnmount() {
    ReactCsvStore.removeChangeListener(this._onChange.bind(this));
  }

  /**
   * Event handler f or "change" events coming from the ReactCsvStore.
   */
  _onChange() {
    this.setState(ReactCsvStore.getAll());
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
   * Update state with the new change and enable undo.
   * @param {object} e A DOM event object.
   */
  _saveChange(e) {
    ReactCsvActions.save(e);
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
    return (
      <div>
        <table className="table-light overflow-hidden bg-white border">
          <HeaderRow numCols={cols} csv={table} saveChange={save} />
          <BodyRows numCols={cols} numRows={this.props.hasFooter ? rows-2 : rows-1} csv={table} saveChange={save} />
          {this.props.hasFooter ? <FooterRow numCols={cols} numRows={rows-1} csv={table} saveChange={save} /> : null}
        </table>
        <Toolbar csv={table} showExport={this.props.showExportButton} />
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
