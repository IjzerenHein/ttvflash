/* @flow */
import React from 'react';
import styled from 'styled-components';
import { observer, activePresentation } from '../../store';
import PresentationPreview from './PresentationPreview';
import TTApp from '../TTApp';

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
        {activePresentation.data.ttapp ? (
          <TTApp delay={activePresentation.data.delay} />
        ) : (
          undefined
        )}
      </Container>
    );
  }
}

export default observer(Home);
