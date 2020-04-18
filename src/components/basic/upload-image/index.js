import OSS from 'ali-oss';
import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import fetch from 'axios';

import './index.css';
import { generateUploadPath } from '../../../utils';
import { OSS_PREFIX } from '../../../constants';
import config from '../../../config';

class ImageUploader extends Component {
  static defaultProps = {
    readOnly: false,
  }

  state = {
    loading: false,
    image: {},
    token: {},
  };

  async componentDidMount() {
    const { readOnly } = this.props;
    if (!readOnly) {
      let res = {};
      // TODO: 前端对 ali-sts 进行cache
      try {
        res = await fetch({
          method: 'POST',
          url: '/api/oss/sts-token',
        });
      } catch (e) {
        res = e;
      }
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        message.error(errMsg);
      } else {
        const token = res.data.data;
        this.setState({
          token,
        });
      }
    }
  }

  getClient = () => {
    const bucketName = 'mclub-image-01';
    const endpoint = 'oss-cn-shenzhen.aliyuncs.com';
    const { token } = this.state;
    return new OSS({
      endpoint,
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      stsToken: token.SecurityToken,
      bucket: bucketName,
    });
  }

  UploadToOSS = (path, file) => {
    const url = generateUploadPath(path, file);
    return new Promise((resolve, reject) => {
      this.getClient().multipartUpload(url, file).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  // handlePreview = (file) => {
  //   this.setState({
  //     preview: file.url || file.thumbUrl,
  //     visible: true,
  //   });
  // }

  beforeUpload = (file) => {
    const { ossDir, onChange } = this.props;
    const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isImg) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    let ossPath = config.ossEnvDir;
    if (ossDir) {
      ossPath = `${config.ossEnvDir}/${ossDir}`;
    }

    reader.onloadend = () => {
      this.UploadToOSS(ossPath, file).then((data) => {
        const ossFileName = data.name.substring(2);
        const imageFile = {
          ossUrl: `${OSS_PREFIX}${ossFileName}`,
          ETag: data.ETag,
          uid: file.uid,
          name: file.name,
          status: file.status,
          type: file.type,
          result: file.name,
          url: reader.result,
        };

        this.setState({
          image: imageFile,
        });

        if (onChange) {
          onChange(imageFile.ossUrl);
        }
      });
    };
    return false;
  }


  render() {
    const { loading, image } = this.state;
    const { value, readOnly } = this.props;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageSrc = image.url || (value && value.url) || value;

    if (readOnly) {
      return <img className="image" src={imageSrc} alt="img" />;
    }

    return (
      <Upload
        name="image"
        listType="picture-card"
        className="image-uploader"
        showUploadList={false}
        // action={uploadUrl}
        beforeUpload={this.beforeUpload}
      >
        {imageSrc ? <img className="image" src={imageSrc} alt="img" /> : uploadButton}
      </Upload>
    );
  }
}

export default ImageUploader;
