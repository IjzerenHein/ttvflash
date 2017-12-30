/* @flow */

import React from 'react';
import styled from 'styled-components';
import { MuiThemeProvider } from 'material-ui/styles';

import theme from '../../theme';

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

class App extends React.Component<{}> {
  componentDidMount() {
    window.document.title = this.props.route.title;
  }

  componentDidUpdate() {
    window.document.title = this.props.route.title;
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Container>
          {this.props.route.toolbar}
          {this.props.route.body}
        </Container>
      </MuiThemeProvider>
    );
  }
}

export default App;
