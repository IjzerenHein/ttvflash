import React, { Component } from 'react';
import styled from 'styled-components';
import {
  activePresentation,
  presentations,
  defaultPresentationSetting,
  loggedInUser,
} from '../../store';
import { observer } from 'mobx-react';
import { Pane, IconButton, Heading } from 'evergreen-ui';
import List from 'material-ui/List';
import PresentationListItem from './PresentationListItem';

const Container = styled.div`
  display: flex;
  width: 320px;
  height: 100%;
  flex-direction: column;
`;

class PresentationList extends Component {
  render() {
    return (
      <Container>
        <Pane
          background="tint2"
          paddingLeft={16}
          paddingRight={16}
          height={64}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size={600}>Presentaties</Heading>
          {loggedInUser.get() ? (
            <IconButton
              appearance="minimal"
              icon="add"
              height={44}
              onClick={this.onClickAdd}
            />
          ) : (
            undefined
          )}
        </Pane>
        <List>
          {presentations.docs.map(doc => (
            <PresentationListItem
              key={doc.id}
              presentation={doc}
              selected={doc.id === activePresentation.id}
              isDefault={
                doc.id === defaultPresentationSetting.data.presentationId
              }
            />
          ))}
        </List>
      </Container>
    );
  }

  onClickAdd = async () => {
    try {
      await presentations.add({
        url: '',
        name: 'Nieuwe Presentatie',
        delay: 6,
      });
    } catch (err) {
      // TODO
    }
  };
}

export default observer(PresentationList);
