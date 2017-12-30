/* @flow */

import React from 'react';
import styled from 'styled-components';
import PresentationList from './PresentationList';
import PresentationDetails from './PresentationDetails';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

class Admin extends React.Component<{}> {
  render() {
    return (
      <Container>
        <PresentationList />
        <PresentationDetails />
      </Container>
    );
  }
}

export default Admin;
