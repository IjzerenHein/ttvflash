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

class PresentationPreview extends Component {
  static propTypes = {
    presentation: PropTypes.any.isRequired,
  };

  getUrl() {
    const { presentation } = this.props;
    const { url, delay } = presentation.data;
    if (!url) return url;
    const { protocol, resource, pathname } = parseUrl(url);

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
          0) * 1000}`;
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
