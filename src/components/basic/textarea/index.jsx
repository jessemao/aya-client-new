import React, { Component } from 'react';
import { Input } from 'antd';
import handleChange from '../../../utils/decorators/handle-change';

const { TextArea } = Input;

@handleChange()
class TextAreaWrapper extends Component {
  render() {
    const { value, ...others } = this.props;
    return (
      <TextArea
        {...others}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}


export default TextAreaWrapper;
