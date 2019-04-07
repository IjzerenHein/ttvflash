/* @flow */
import React from 'react';
import { observer, activePresentation } from '../../store';
import { FullPresentationView } from './FullPresentationView';

interface PropsType {}

class Home extends React.Component<PropsType> {
  render() {
    const { ttapp } = activePresentation.data;

    return (
      <FullPresentationView presentation={activePresentation} ttapp={ttapp} />
    );
  }
}

export default observer(Home);
