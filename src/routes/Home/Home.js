/* @flow */

import React from 'react';
import styled from 'styled-components';
import PresentationList from './PresentationList';
import PresentationDetails from './PresentationDetails';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

class Home extends React.Component<{}> {
  render() {
    return (
      <Container>
        <PresentationList />
        <PresentationDetails />
      </Container>
    );
  }
}

export default Home;
