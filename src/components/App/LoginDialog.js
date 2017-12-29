/* @flow */

import React from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';

import auth from '../../auth';

const Title = styled(DialogTitle)`
  && {
    text-align: center;
  }
`;

const Content = styled(DialogContent)`
  display: flex;
  width: 400px;
  flex-direction: column;
`;

const LoginButton = styled(Button)`
  margin-top: 20px;
`;

class LoginDialog extends React.Component {
  state = {
    error: null,
    loading: false,
    email: '',
    password: '',
  };

  render() {
    const { loading, error, email, password } = this.state;

    return (
      <Dialog {...this.props}>
        <Title>Aanmelden</Title>
        <Content>
          <TextField
            id="email"
            autoFocus
            label={error ? error.message : 'E-mail adres'}
            error={error ? true : false}
            value={email}
            margin="dense"
            disabled={loading}
            onChange={this.onChangeEmail}
          />
          <TextField
            id="password"
            label="Wachtwoord"
            value={password}
            disabled={loading}
            type="password"
            margin="dense"
            onChange={this.onChangePassword}
          />
          <LoginButton
            raised
            color="primary"
            disabled={loading}
            onClick={this.onClickLogin}
          >
            Log in
          </LoginButton>
        </Content>
      </Dialog>
    );
  }

  onChangeEmail = event => {
    this.setState({
      email: event.target.value,
    });
  };

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    });
  };

  onClickLogin = async event => {
    this.setState({
      loading: true,
      error: null,
    });
    try {
      const { email, password } = this.state;
      await auth.signInWithEmailAndPassword(email, password);
      this.setState({
        loading: false,
      });
      this.props.onClose(event);
    } catch (err) {
      this.setState({
        loading: false,
        error: err,
      });
    }
  };
}

export default LoginDialog;
