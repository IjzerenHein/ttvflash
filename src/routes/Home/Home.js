/* @flow */

import React from 'react';
import styled from 'styled-components';
import { activePresentation } from '../../store';
import PresentationPreview from './PresentationPreview';

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
      </Container>
    );
  }
}

export default Home;
