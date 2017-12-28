import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

class PresentationListItem extends Component {
  static propTypes = {
    presentation: PropTypes.any,
  };

  render() {
    const { presentation } = this.props;
    return (
      <ListItem button>
        <ListItemText primary="Inbox" />
      </ListItem>
    );
  }
}

export default observer(PresentationListItem);
