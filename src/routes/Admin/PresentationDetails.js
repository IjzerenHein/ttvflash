import React, { Component } from 'react';
import styled from 'styled-components';
import {
  loggedInUser,
  activePresentation,
  defaultPresentationSetting,
} from '../../store';
import { observer } from 'mobx-react';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import DeleteIcon from 'material-ui-icons/Delete';
import TVIcon from 'material-ui-icons/Tv';
import LinkIcon from 'material-ui-icons/Link';
import RefreshIcon from 'material-ui-icons/Refresh';
// import OpenIcon from 'material-ui-icons/OpenInNew';
import ControlledTextField from '../../components/ControlledTextField/ControlledTextField';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import PresentationPreview from '../Home/PresentationPreview';
import TTApp from '../TTApp';

const Container = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled(Typography)`
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  height: 64px;
  padding: 5px 20px 5px 20px;
  flex-direction: row;
  align-items: center;
`;

const Logo = styled(Avatar)`
  margin-right: 20px;
`;

const Input = styled(ControlledTextField)`
  flex: 1;
`;

const DelayInput = styled(ControlledTextField)`
  width: 120px;
`;

const StandardButton = styled(Button)`
  margin: 0 10px 0 20px;
`;

const PresentationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const styles = {
  fourThree: {
    flex: 2,
  },
  fullWidth: {
    flex: 1,
  },
};

class PresentationDetails extends Component {
  state = {
    deleteDialogOpen: false,
  };

  render() {
    const presentation = activePresentation;
    const { deleteDialogOpen } = this.state;
    const disabled = loggedInUser.get() ? false : true;
    if (!presentation || !presentation.ref) return <Container />;
    const { name, url, delay, ttapp } = presentation.data;
    const isDefault =
      presentation.id === defaultPresentationSetting.data.presentationId;
    return (
      <Container>
        <AppBar position="static" color="default">
          <Toolbar>
            <Title type="title" color="inherit">
              {'Presentatie' + (isDefault ? ' (Standaard)' : '')}
            </Title>
            {!disabled && (
              <StandardButton
                raised
                disabled={isDefault}
                color="primary"
                onClick={this.onClickMakeDefault}
              >
                Stel in als standaard
              </StandardButton>
            )}
            {!disabled && (
              <IconButton aria-label="Ververs" onClick={this.onClickRefresh}>
                <RefreshIcon />
              </IconButton>
            )}
            {!disabled && (
              <IconButton aria-label="Verwijder" onClick={this.onClickDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Row>
          <Logo>
            <TVIcon />
          </Logo>
          <Input
            id="name"
            label="Naam"
            disabled={disabled}
            value={name || ''}
            onChange={event => this.onChangeValue('name', event)}
          />
          <DelayInput
            id="delay"
            type="number"
            label="Wachttijd (sec)"
            disabled={disabled}
            value={delay || ''}
            onChange={event => this.onChangeValue('delay', event)}
          />
        </Row>
        <Row>
          <Logo>
            <LinkIcon />
          </Logo>
          <Input
            id="url"
            label="Url (https://docs.google.com/presentation/../embed)"
            disabled={disabled}
            value={url || ''}
            onChange={event => this.onChangeValue('url', event)}
          />
          <Checkbox
            id="ttapp"
            label="Show TTApp"
            disabled={disabled}
            checked={ttapp || false}
            onChange={event => this.onChangeValue('ttapp', event)}
          />
          {/*<IconButton
            aria-label="Open"
            color="primary"
            onClick={this.onClickUrl}
          >
            <OpenIcon />
          </IconButton>*/}
        </Row>
        <PresentationContainer>
          <PresentationPreview
            presentation={presentation}
            style={ttapp ? styles.fourThree : styles.fullWidth}
          />
          {ttapp ? <TTApp delay={delay} /> : undefined}
        </PresentationContainer>
        <Dialog
          open={deleteDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Presentatie verwijderen?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                'Dit verwijderd de link naar de presentatie uit presentatie beheer, maar niet de werkelijke presentatie.'
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClickCancelDelete} autoFocus>
              Annuleer
            </Button>
            <Button onClick={this.onClickConfirmDelete} color="accent">
              Verwijder
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  async onChangeValue(field, event) {
    const value = field === 'ttapp' ? event.target.checked : event.target.value;
    console.log('onchangeValue: ', field, value, event);
    if (!value && value !== false) return;

    const fields = {};
    fields[field] = value;
    await activePresentation.update(fields);
  }

  onClickDelete = () => {
    this.setState({
      deleteDialogOpen: true,
    });
  };

  onClickCancelDelete = () => {
    this.setState({
      deleteDialogOpen: false,
    });
  };

  onClickConfirmDelete = async () => {
    this.setState({
      deleteDialogOpen: false,
    });
    if (this._deleting) return;
    this._deleting = true;
    try {
      await activePresentation.delete();
      this._deleting = false;
    } catch (err) {
      this._deleting = false;
    }
  };

  onClickMakeDefault = () => {
    defaultPresentationSetting.update({
      presentationId: activePresentation.id,
    });
  };

  onClickRefresh = () => {
    activePresentation.update({
      refreshTime: Date.now(),
    });
  };

  /*onClickUrl = () => {
    window.open(activePresentation.data.url, '_blank');
  };*/
}

export default observer(PresentationDetails);
