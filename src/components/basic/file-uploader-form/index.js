import React, { Component } from 'react';
import { message } from 'antd';
import Uploader from '../upload-form';

class FileUploaderForm extends Component {
  static defaultProps = {
    listType: 'text',
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
  }

  handleChange(data) {
    this.props.onChange(data);
  }

  handleBeforeUpload(file) {
    // console.log('file', file);
    // console.log('type', this.props.type);
    // const isValidFileType = file.type === this.props.type;
    // if (!isValidFileType) {
    //   message.error(`You can only upload ${this.props.fileType} file!`);
    // }
    const isLt2M = file.size / (1024 * 1024) < 20;
    if (!isLt2M) {
      message.error('File must smaller than 20MB!');
    }
    return isLt2M;
  }

  render() {
    const props = {
      ...this.props,
      beforeUpload: this.handleBeforeUpload,
      onChange: this.handleChange,
      className: 'file-uploader',
    };
    return (
      <Uploader
        {...props}
      />
    );
  }
}

export default FileUploaderForm;
