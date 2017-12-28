/**
 * React Starter Kit for Firebase and GraphQL
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

/* @flow */

import React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiToolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import styled from 'styled-components';

import auth from '../../auth';
import history from '../../history';
import Link from '../../components/Link';
import LoginDialog from './LoginDialog';

const Title = styled(Typography)`
  && {
    flex: 1;
    text-align: left;
    cursor: pointer;
  }
`;

function goHome() {
  history.push('/');
}

class Toolbar extends React.Component<{}, {}> {
  state = {
    loginOpen: false,
  };

  componentDidMount() {
    this.unlisten = auth.onShowLoginDialog(this.showLoginDialog);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  showLoginDialog = event => {
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
          <Title type="title" color="inherit" onClick={goHome}>
            TTV Flash Presentatie Beheer
          </Title>
          {this.props.user && (
            <React.Fragment>
              <Button color="inherit" onClick={this.goToAccount}>
                {this.props.user.displayName}
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
