import React, { Component } from 'react';
import styled from 'styled-components';
import { activePresentation } from '../../store';
import { observer } from 'mobx-react';

const Container = styled.div`
  height: 300px;
`;

const List = styled.div`
  flex: 1,
  display: flex;
  flex-direction: column;
`;

class PresentationSettings extends Component {
  render() {
    return <Container />;
  }
}

export default observer(PresentationSettings);
