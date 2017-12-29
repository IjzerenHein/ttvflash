import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { activePresentation, loggedInUser } from '../../store';
import { observer } from 'mobx-react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List from 'material-ui/List';
import PresentationListItem from './PresentationListItem';

const Container = styled.div`
  display: flex;
  width: 320px;
  height: 100%;
  flex-direction: column;
`;

const Title = styled(Typography)`
  flex: 1;
`;

class PresentationList extends Component {
  static propTypes = {
    presentations: PropTypes.any,
  };

  render() {
    return (
      <Container>
        <AppBar position="static" color="default">
          <Toolbar>
            <Title type="title" color="inherit">
              Presentaties
            </Title>
            {loggedInUser.get() ? (
              <Button fab mini color="primary" onClick={this.onClickAdd}>
                <AddIcon />
              </Button>
            ) : (
              undefined
            )}
          </Toolbar>
        </AppBar>
        <List>
          {this.props.presentations.docs.map(doc => (
            <PresentationListItem
              key={doc.id}
              presentation={doc}
              selected={doc.id === activePresentation.id}
            />
          ))}
        </List>
      </Container>
    );
  }

  onClickAdd = async () => {
    try {
      await this.props.presentations.add({
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
