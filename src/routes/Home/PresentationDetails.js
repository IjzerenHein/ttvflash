import React, { Component } from 'react';
import styled from 'styled-components';
import { activePresentation } from '../../store';
import { observer } from 'mobx-react';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import PresentationSettings from './PresentationSettings';
import PresentationPreview from './PresentationPreview';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

class PresentationDetails extends Component {
  render() {
    return (
      <Container>
        <Toolbar>
          {/*<ToolbarTitle text="Presentatie Details" />*/}
          <Button raised color="accent">
            Verwijder
          </Button>
        </Toolbar>
        <PresentationSettings />
        <PresentationPreview />
      </Container>
    );
  }
}

export default observer(PresentationDetails);
