/**
 * React Starter Kit for Firebase and GraphQL
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

/* @flow */

import React from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import styled from 'styled-components';

import auth from '../../auth';

const Title = styled(DialogTitle)`
  && {
    text-align: center;
  }
`;

const defaultState = {
  error: null,
  loading: false,
};

class LoginDialog extends React.Component {
  state = { ...defaultState };

  signInWithFacebook = event => {
    this.setState({ ...defaultState, loading: true });
    auth
      .signIn()
      .then(() => {
        this.setState(defaultState);
        this.props.onClose(event);
      })
      .catch(err => {
        console.log(err);
        this.setState({ ...defaultState, error: err.messsage });
      });
  };

  render() {
    return (
      <Dialog {...this.props}>
        <Title>Aanmelden</Title>
        <DialogContent>
          <Button
            raised
            color="primary"
            disabled={this.state.loading}
            onClick={this.signInWithFacebook}
          >
            Meld aan met Facebook
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default LoginDialog;
