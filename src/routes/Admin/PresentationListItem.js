import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import TVIcon from 'material-ui-icons/Tv';
import StarIcon from 'material-ui-icons/Star';
import history from '../../history';
import { grey } from 'material-ui/colors';

class PresentationListItem extends Component {
  static propTypes = {
    presentation: PropTypes.any.isRequired,
    selected: PropTypes.bool,
    isDefault: PropTypes.bool,
  };

  render() {
    const { presentation, selected, isDefault } = this.props;
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
        {isDefault && <StarIcon color="primary" />}
      </ListItem>
    );
  }

  onClick = () => {
    history.push('/admin/presentation/' + this.props.presentation.id);
  };
}

export default observer(PresentationListItem);
