/* @flow */
import React from 'react';
import { Pane, Button, Heading } from 'evergreen-ui';
import { auth } from '../../store';
import history from '../../history';
import LoginDialog from './LoginDialog';

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
      <Pane
        background="tint1"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        height={64}
        padding={16}
      >
        <Heading size={700} onClick={goAdmin}>
          TTV Flash Presentatie Beheer
        </Heading>
        {this.props.user && (
          <Pane display="flex" flexDirection="row">
            <Button appearance="minimal" onClick={this.goToAccount}>
              {this.props.user.displayName || ''}
            </Button>
            <Button intent="danger" onClick={auth.signOut}>
              Afmelden
            </Button>
          </Pane>
        )}
        {this.props.user === null && (
          <Button appearance="primary" onClick={auth.showLoginDialog}>
            Aanmelden
          </Button>
        )}
        <LoginDialog
          open={this.state.loginDialogOpen}
          onClose={this.hideLogin}
        />
      </Pane>
    );
  }
}

export default Toolbar;
