import React, { Component } from 'react';
import styled from 'styled-components';
import {
  loggedInUser,
  activePresentation,
  defaultPresentationSetting,
} from '../../store';
import { observer } from 'mobx-react';
import {
  Pane,
  Heading,
  IconButton,
  Button,
  Icon,
  TextInput,
  Switch,
} from 'evergreen-ui';
import Card from 'material-ui/Card';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import PresentationPreview from '../Home/PresentationPreview';
import TTApp from '../TTApp';

const Container = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  height: 60px;
  padding: 0 16px 0 16px;
  flex-direction: row;
`;

const PresentationContainer = styled.div`
  display: flex;
  flex: 1;
  margin-top: 8px;
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
    const { name, url, delay, ttapp, startAt, endAt } = presentation.data;
    const isDefault =
      presentation.id === defaultPresentationSetting.data.presentationId;
    return (
      <Container>
        <Pane
          background="tint2"
          display="flex"
          flexDirection="row"
          alignItems="center"
          paddingLeft={16}
          paddingRight={16}
          marginBottom={8}
          height={64}
        >
          <Heading size={600} flex={1}>
            {'Presentatie' + (isDefault ? ' (Standaard)' : '')}
          </Heading>
          {!disabled && (
            <Button
              disabled={isDefault}
              appearance="minimal"
              onClick={this.onClickMakeDefault}
            >
              Stel in als standaard
            </Button>
          )}
          {!disabled && (
            <IconButton
              marginLeft={16}
              aria-label="Herladen"
              icon="refresh"
              onClick={this.onClickRefresh}
            />
          )}
          {!disabled && (
            <IconButton
              marginLeft={16}
              aria-label="Verwijder"
              intent="danger"
              icon="trash"
              onClick={this.onClickDelete}
            />
          )}
        </Pane>
        <Row>
          <Icon icon="edit" size={32} />
          <Pane display="flex" flexDirection="column" flex={1} marginLeft={16}>
            <Heading size={100}>Naam</Heading>
            <TextInput
              id="name"
              width={'100%'}
              placeholder="bijv: Club X"
              disabled={disabled}
              value={name || ''}
              onChange={event => this.onChangeValue('name', event)}
            />
          </Pane>
          <Pane display="flex" flexDirection="column" flex={1} marginLeft={16}>
            <Heading size={100}>Start op (dddd HH:mm)</Heading>
            <TextInput
              id="startAt"
              placeholder="bijv: Dinsdag 08:00"
              disabled={disabled}
              value={startAt || ''}
              onChange={event => this.onChangeValue('startAt', event)}
            />
          </Pane>
          <Pane display="flex" flexDirection="column" flex={1} marginLeft={16}>
            <Heading size={100}>Endig op (dddd HH:mm)</Heading>
            <TextInput
              id="endAt"
              placeholder="bijv: Dinsdag 18:00"
              disabled={disabled}
              value={endAt || ''}
              onChange={event => this.onChangeValue('endAt', event)}
            />
          </Pane>
        </Row>
        <Row>
          <Icon icon="presentation" size={32} />
          <Pane display="flex" flexDirection="column" flex={1} marginLeft={16}>
            <Heading size={100}>Url</Heading>
            <TextInput
              id="url"
              width={'100%'}
              placeholder="bijv: https://docs.google.com/presentation/../embed"
              disabled={disabled}
              value={url || ''}
              onChange={event => this.onChangeValue('url', event)}
            />
          </Pane>
          <Pane display="flex" flexDirection="column" marginLeft={16}>
            <Heading size={100}>Wachttijd</Heading>
            <TextInput
              id="delay"
              placeholder="bijv: 10 sec"
              disabled={disabled}
              value={delay || ''}
              onChange={event => this.onChangeValue('delay', event)}
            />
          </Pane>
          <Pane display="flex" flexDirection="column" marginLeft={16}>
            <Heading size={100}>TTApp</Heading>
            <Switch
              flex={1}
              id="url"
              checked={ttapp || false}
              disabled={disabled}
              value={url || ''}
              onChange={event => this.onChangeValue('ttapp', event)}
            />
          </Pane>
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
    if (!value && value !== false && value !== '') return;

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
