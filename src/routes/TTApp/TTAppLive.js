/* @flow */
import React, { Component } from 'react';
import { observer } from '../../store';

const styles = {
  container: {
    display: 'flex',
    backgroundColor: 'green',
    width: 200,
  },
};

export const TTAppLive = observer(
  class TTAppLive extends Component<{}> {
    render() {
      return <div style={styles.container} />;
    }
  },
);
