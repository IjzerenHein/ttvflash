/* @flow */
import React from 'react';
import styled from 'styled-components';
import { observer, activePresentation, ttapp } from '../../store';
import PresentationPreview from './PresentationPreview';
import { TTAppLive } from '../TTApp';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

class Home extends React.Component<{}> {
  render() {
    return (
      <Container>
        <PresentationPreview presentation={activePresentation} />
        {ttapp.isEnabled ? <TTAppLive /> : undefined}
      </Container>
    );
  }
}

export default observer(Home);
