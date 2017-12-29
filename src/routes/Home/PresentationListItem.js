import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import TVIcon from 'material-ui-icons/Tv';
import history from '../../history';
import { grey } from 'material-ui/colors';

class PresentationListItem extends Component {
  static propTypes = {
    presentation: PropTypes.any.isRequired,
    selected: PropTypes.bool,
  };

  render() {
    const { presentation, selected } = this.props;
    const { name, delay } = presentation.data;
    return (
      <ListItem
        button
        onClick={this.onClick}
        style={selected ? { backgroundColor: grey[300] } : undefined}
      >
        <Avatar>
          <TVIcon />
        </Avatar>
        <ListItemText primary={name || ''} secondary={delay + ' sec'} />
      </ListItem>
    );
  }

  onClick = () => {
    history.push('/presentation/' + this.props.presentation.id);
  };
}

export default observer(PresentationListItem);
