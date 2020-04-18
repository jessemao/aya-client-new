import React, { Component } from 'react';
import { Button } from 'antd';

class ButtonWrapper extends Component {
  render() {
    const { buttonText, ...others } = this.props;
    return (
      <Button
        {...others}
      >
        {
          buttonText
        }
      </Button>
    );
  }
}


export default ButtonWrapper;
