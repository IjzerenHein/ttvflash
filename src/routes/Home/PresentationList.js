import React, { Component } from 'react';
import styled from 'styled-components';
import { presentations } from '../../store';
import { observer } from 'mobx-react';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import PresentationListItem from './PresentationListItem';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 320px;
`;

class PresentationList extends Component {
  render() {
    return (
      <Container>
        <Toolbar>
          <Button raised color="primary">
            Voeg toe
          </Button>
        </Toolbar>
        <List>
          {presentations.docs.map(doc => (
            <PresentationListItem
              key={doc.id}
              presentation={doc} />
          ))}
        </List>
      </Container>
    );
  }
}

export default observer(PresentationList);
