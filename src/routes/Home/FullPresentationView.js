/* @flow */
import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import PresentationPreview from './PresentationPreview';
import { TTAppOverlay, TTAppSidebar } from '../TTApp';
import { TTAppProvider } from '../TTApp/TTAppProvider';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const styles = {
  fourThree: {
    width: `133.33vh`,
  },
  fullWidth: {
    flex: 1,
  },
};

interface PropsType {
  presentation: any;
  ttapp?: boolean;
}

export const FullPresentationView = observer(
  class FullPresentationView extends Component<PropsType> {
    render() {
      const { presentation, ttapp } = this.props;
      if (ttapp) {
        return (
          <TTAppProvider>
            {store => (
              <Container>
                <PresentationPreview
                  presentation={presentation}
                  style={styles.fourThree}
                />
                <TTAppSidebar store={store} delay={presentation.data.delay} />
                <TTAppOverlay store={store} />
              </Container>
            )}
          </TTAppProvider>
        );
      } else {
        return (
          <Container>
            <PresentationPreview
              presentation={presentation}
              style={styles.fullWidth}
            />
          </Container>
        );
      }
    }
  },
);
