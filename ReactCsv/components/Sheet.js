/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary The top-level component class for the ReactCsv module.
 * @module ReactCsv
 */

// Import libraries.
import React from 'react';
import '../polyfills';

// Import React components.
import Cell from './Cell';
import HeaderRow from './HeaderRow';
import BodyRows from './BodyRows';
import FooterRow from './FooterRow';
import Toolbar from './Toolbar';

// Import Flux components.
import ReactCsvStore from '../flux/ReactCsvStore';
import ReactCsvActions from '../flux/ReactCsvActions';


/**
 * Primary high-level component that orchestrates pieces and maintains state.
 * @extends React.Component
 */
export default class Sheet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true}; /// Note: Equivalent to <getInitialState()>.
  }

  /**
   * Listen for keystrokes and events then get initial state data.
   */
  componentDidMount() {
    this._setKeystrokeListeners();
    ReactCsvStore.addChangeListener(this._onChange.bind(this));
    ReactCsvActions.initializeDataStore({
      numRows: this.props.numRows,
      numCols: this.props.numCols,
      loading: false
    });
  }

  /**
   * Remove the change listener to save memory once the component disappears.
   */
  componentWillUnmount() {
    document.onkeydown = null;
    ReactCsvStore.removeChangeListener(this._onChange.bind(this));
  }

  /**
   * Update state with the new change and enable undo.
   * @param {object} e A DOM event object.
   */
  _saveChange(e) {
    ReactCsvActions.save(e);
  }

  /**
   * Listen for keystrokes to activate the <undo()> and <redo()> functions.
   */
  _setKeystrokeListeners() {
    document.onkeydown = function(e) { /// Undo: CTRL-Z | Redo: CTRL-Y
      if (e.ctrlKey &&
          (e.key === 'z' || e.keyCode === 90 || e.which === 90) &&
          this.state.tableUndo.length > 0) {
        ReactCsvActions.undo();
      } else if (e.ctrlKey &&
          (e.key === 'y' || e.keyCode === 89 || e.which === 89) &&
          this.state.tableRedo.length > 0) {
        ReactCsvActions.redo();
      }
    }.bind(this);
  }

  /**
   * Render the CSV table but only after the data has loaded into state.
   * @return {object} A reference to the DOM component.
   */
  render() {
    // Display loading message.
    if (this.state.loading === true) {
      return (
        <div>
          <p className="italic">Loading...</p>
        </div>
      );
    }

    // Display table with data.
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

  /**
   * Event handler f or "change" events coming from the ReactCsvStore.
   */
  _onChange() {
    this.setState(ReactCsvStore.getAll());
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
