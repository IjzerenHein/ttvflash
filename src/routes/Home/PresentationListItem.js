import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import TVIcon from 'material-ui-icons/Tv';

class PresentationListItem extends Component {
  static propTypes = {
    presentation: PropTypes.any,
  };

  render() {
    // const { presentation } = this.props;
    return (
      <ListItem button>
        <Avatar>
          <TVIcon />
        </Avatar>
        <ListItemText primary="Inbox" />
      </ListItem>
    );
  }
}

export default observer(PresentationListItem);
