import React, { Component } from 'react';
import { TTAppStore } from '../../store';

export const TTAppContext = React.createContext();

export class TTAppProvider extends Component {
  _store = new TTAppStore();

  componentDidMount() {
    this._store.init(this.props.clubId);
  }

  componentWillUnmount() {
    this._store.cleanup();
  }

  render() {
    return (
      <TTAppContext.Provider value={this._store}>
        <TTAppContext.Consumer {...this.props} />
      </TTAppContext.Provider>
    );
  }
}
