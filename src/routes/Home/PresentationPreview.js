import React, { Component } from 'react';
import styled from 'styled-components';
// import { activePresentation } from '../../store';
import { observer } from 'mobx-react';

const Container = styled.div`
  flex: 1;
`;

class PresentationPreview extends Component {
  render() {
    return <Container />;
  }
}

export default observer(PresentationPreview);
