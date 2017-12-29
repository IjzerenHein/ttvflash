import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { loggedInUser } from '../../store';
import { observer } from 'mobx-react';
import Card from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import DeleteIcon from 'material-ui-icons/Delete';
import PresentationPreview from './PresentationPreview';
import TVIcon from 'material-ui-icons/Tv';
import LinkIcon from 'material-ui-icons/Link';
import DelayIcon from 'material-ui-icons/SlowMotionVideo';
// import OpenIcon from 'material-ui-icons/OpenInNew';
import ControlledTextField from '../../components/ControlledTextField/ControlledTextField';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

const Container = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  height: 64px;
  padding: 0 20px 0 20px;
  flex-direction: row;
  align-items: center;
`;

const Logo = styled(Avatar)`
  margin-right: 20px;
`;

const Input = styled(ControlledTextField)`
  flex: 1;
`;

class PresentationDetails extends Component {
  static propTypes = {
    presentation: PropTypes.any,
  };

  state = {
    deleteDialogOpen: false,
  };

  render() {
    const { presentation } = this.props;
    const { deleteDialogOpen } = this.state;
    const disabled = loggedInUser.get() ? false : true;
    if (!presentation || !presentation.ref) return <Container />;
    const { name, url, delay } = presentation.data;
    return (
      <Container>
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
          {!disabled && (
            <IconButton
              aria-label="Verwijder"
              color="accent"
              onClick={this.onClickDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Row>
        <Row>
          <Logo>
            <LinkIcon />
          </Logo>
          <Input
            id="url"
            label="Url (bijv: docs.google.com/..)"
            disabled={disabled}
            value={url || ''}
            onChange={event => this.onChangeValue('url', event)}
          />
          {/*<IconButton
            aria-label="Open"
            color="primary"
            onClick={this.onClickUrl}
          >
            <OpenIcon />
          </IconButton>*/}
        </Row>
        <Row>
          <Logo>
            <DelayIcon />
          </Logo>
          <Input
            id="delay"
            type="number"
            label="Wachttijd (tussen de pagina's)"
            disabled={disabled}
            value={delay || ''}
            onChange={event => this.onChangeValue('delay', event)}
          />
        </Row>
        <PresentationPreview presentation={presentation} />
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
    const value = event.target.value;
    if (!value) return;

    const fields = {};
    fields[field] = value;
    await this.props.presentation.update(fields);
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
    const { presentation } = this.props;
    if (this._deleting) return;
    this._deleting = true;
    try {
      await presentation.delete();
      this._deleting = false;
    } catch (err) {
      this._deleting = false;
    }
  };

  /*onClickUrl = () => {
    window.open(this.props.presentation.data.url, '_blank');
  };*/
}

export default observer(PresentationDetails);
