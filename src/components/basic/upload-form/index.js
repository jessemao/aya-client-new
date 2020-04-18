import React, { Component } from 'react';
import { Upload, Icon, Button } from 'antd';

class UploaderForm extends Component {
  static defaultProps = {
    className: 'file-uploader',
  }

  state = {
    loading: false,
    filename: '',
    path: '',
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.success) {
        this.setState({
          loading: false,
          path: info.file.response.data.path,
        });
        this.props.onChange(info.file.response.data);
      }
    }
  }

  render() {
    return (
      <Upload
        {...this.props}
        onChange={this.handleChange}
      >
        <Button>
          <Icon type="upload" />
          {' '}
          点击上传
        </Button>
      </Upload>
    );
  }
}

export default UploaderForm;
