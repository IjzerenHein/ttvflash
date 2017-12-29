import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

class ControlledTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if (this.state.value !== nextProps.value) {
        this.setState({
          value: nextProps.value,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;
    if (this.props === nextProps) return false;

    const keysA = Object.keys(this.props);
    const keysB = Object.keys(nextProps);

    if (keysA.length !== keysB.length) {
      return true;
    }

    for (let i = 0; i < keysA.length; i++) {
      const key = keysA[i];
      if (key !== 'value' && this.props[key] !== nextProps[key]) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { value } = this.state;
    return (
      <TextField {...this.props} value={value || ''} onChange={this.onChange} />
    );
  }

  onChange = (event, arg2) => {
    const value = event.target.value;
    if (this.state.value !== value) {
      this.setState({
        value: value,
      });
      if (this.props.onChange) {
        this.props.onChange(event, arg2);
      }
    }
  };
}

export default ControlledTextField;
