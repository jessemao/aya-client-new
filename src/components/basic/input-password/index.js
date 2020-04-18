import React, { Component } from 'react';
import { Input } from 'antd';
import handleChange from '../../../utils/decorators/handle-change';

const { Password } = Input;

@handleChange()
class InputPasswordWrapper extends Component {
  render() {
    const {
      value, ...others
    } = this.props;
    return (
      <Password
        value={value}
        {...others}
        onChange={this.handleChange}
      />
    );
  }
}


export default InputPasswordWrapper;
