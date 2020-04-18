import React, { Component } from 'react';
import { Switch } from 'antd';
import handleChange from '../../../utils/decorators/handle-change';

@handleChange()
class SwitchWrapper extends Component {
  render() {
    const { value, ...others } = this.props;
    return (
      <Switch
        {...others}
        checked={!!value}
        onChange={this.handleChange}
      />
    );
  }
}


export default SwitchWrapper;
