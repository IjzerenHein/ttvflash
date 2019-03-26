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

const styles = {
  fourThree: {
    width: `133.33vh`,
  },
  fullWidth: {
    flex: 1,
  },
};

interface PropsType {}

class Home extends React.Component<PropsType> {
  render() {
    const { ttapp } = activePresentation.data;
    return (
      <Container>
        <PresentationPreview
          presentation={activePresentation}
          style={ttapp ? styles.fourThree : styles.fullWidth}
        />
        {ttapp ? <TTApp delay={activePresentation.data.delay} /> : undefined}
      </Container>
    );
  }
}

export default observer(Home);
