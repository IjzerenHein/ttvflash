/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import parseUrl from 'parse-url';

const Container = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const HideGoogleSlidesBar = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% + 30px);
`;

const IFrame = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  border: none;
`;

interface PropsType {
  presentation: any;
}

interface StateType {
  refreshTime: number;
}

class PresentationPreview extends Component<PropsType, StateType> {
  static propTypes = {
    presentation: PropTypes.any.isRequired,
  };

  _timer: any;

  state = {
    refreshTime: 0,
  };

  componentDidMount() {
    let hour = new Date().getHours();
    this._timer = setInterval(() => {
      const newHour = new Date().getHours();
      if (hour < 6 && newHour >= 6) {
        this.setState({
          refreshTime: Date.now(),
        });
      }
      hour = newHour;
    }, 1000 * 60 * 60 * 3);
  }

  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  getUrl() {
    const { presentation } = this.props;
    const { url, delay, refreshTime } = presentation.data;
    if (!url) return url;
    const { protocol, resource, pathname } = parseUrl(url);
    const refreshTime2 = Math.max(this.state.refreshTime, refreshTime || 0);
    switch (resource) {
      case 'docs.google.com': {
        let path = pathname;
        if (path.endsWith('/pub')) {
          path = path.substring(0, path.length - 4);
        }
        if (!path.endsWith('/embed')) {
          path += '/embed';
        }
        return `${protocol}://${resource}/${path}?start=true&loop=true&delayms=${(delay ||
          0) * 1000}&refreshTime=${refreshTime2}`;
      }
      default:
        return ''; // url;
    }
  }

  render() {
    const url = this.getUrl();

    return (
      <Container>
        <HideGoogleSlidesBar>
          <IFrame title="presentation" src={url} />
        </HideGoogleSlidesBar>
      </Container>
    );
  }
}

export default observer(PresentationPreview);
