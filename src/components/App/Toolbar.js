/* @flow */
import React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiToolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import styled from 'styled-components';

import { auth } from '../../store';
import history from '../../history';
import LoginDialog from './LoginDialog';

const Title = styled(Typography)`
  && {
    flex: 1;
    text-align: left;
    cursor: pointer;
  }
`;

function goAdmin() {
  history.push('/admin');
}

interface PropsType {
  user: any;
}
interface StateType {
  loginOpen: boolean;
  loginDialogOpen: boolean;
}

class Toolbar extends React.Component<PropsType, StateType> {
  state = {
    loginOpen: false,
    loginDialogOpen: false,
  };

  _unlisten: () => void;

  componentDidMount() {
    this._unlisten = auth.onShowLoginDialog(this.showLoginDialog);
  }

  componentWillUnmount() {
    this._unlisten();
  }

  showLoginDialog = () => {
    this.setState({ loginDialogOpen: true });
  };

  hideLogin = () => {
    this.setState({ loginDialogOpen: false });
  };

  goToAccount = () => {
    history.push('/account');
  };

  render() {
    return (
      <AppBar color="accent" position="static">
        <MuiToolbar>
          <Title type="title" color="inherit" onClick={goAdmin}>
            TTV Flash Presentatie Beheer
          </Title>
          {this.props.user && (
            <React.Fragment>
              <Button color="inherit" onClick={this.goToAccount}>
                {this.props.user.displayName || ''}
              </Button>
              <Button color="inherit" onClick={auth.signOut}>
                Afmelden
              </Button>
            </React.Fragment>
          )}
          {this.props.user === null && (
            <Button color="inherit" onClick={auth.showLoginDialog}>
              Aanmelden
            </Button>
          )}
        </MuiToolbar>
        <LoginDialog
          open={this.state.loginDialogOpen}
          onClose={this.hideLogin}
        />
      </AppBar>
    );
  }
}

export default Toolbar;
