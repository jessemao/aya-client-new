import OSS from 'ali-oss';

import React, { Component } from 'react';
import {
  Upload, Icon, Modal, Button,
} from 'antd';
import fetch from 'axios';

import asyncFeedback from '../async-feedback';
import { uuidv4, generateUploadPath } from '../../../utils';
import config from '../../../config';
import { OSS_PREFIX } from '../../../constants';
import styles from './index.module.less';


class UploadImageMulti extends Component {
  static defaultProps = {
    maxItems: 6,
    onClickPreviewBtn: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      token: {},
      previewVisible: false,
      previewImage: '',
      fileList: this.formatValue(props.value) || [],
    };
  }

  async componentDidMount() {
    let res = {};
    // TODO: 前端对 ali-sts 进行cache
    try {
      res = await fetch({
        method: 'POST',
        url: '/api/oss/sts-token',
      });
    } catch (e) {
      console.error(res);
    }

    if (res.status === 200 && res.data.success) {
      const token = res.data.data;
      this.setState({
        token,
      });
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value || ((!(this.props.value && this.props.value.length) || this.props.value.length !== nextProps.value.length))) {
      const fileList = this.formatValue(nextProps.value);
      this.setState({
        fileList,
      });
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

  beforeUpload = (file) => {
    const { onChange, ossDir } = this.props;
    const { fileList } = this.state;
    const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isImg) {
      asyncFeedback.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      asyncFeedback.error('Image must smaller than 2MB!');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    let ossPath = config.ossEnvDir;
    if (ossDir) {
      ossPath = `${config.ossEnvDir}/${ossDir}`;
    }
    reader.onloadend = () => {
      this.UploadToOSS(ossPath, file).then((data) => {
        const ossFileName = data.name;
        const imageUrl = `${OSS_PREFIX}${ossFileName}`;
        const imageFile = {
          ossUrl: imageUrl,
          ETag: data.ETag,
          uid: file.uid,
          name: file.name,
          status: file.status,
          type: file.type,
          result: file.name,
          url: imageUrl,
        };

        fileList.push(imageFile);
        this.setState({
          fileList,
        });
        if (onChange) {
          onChange(fileList.map((item) => item.ossUrl));
        }
      });
    };
    return false;
  }


  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleRemove = (rmItem) => {
    const { onChange } = this.props;
    let { fileList } = this.state;
    fileList = fileList.filter((item) => item.uid !== rmItem.uid);

    this.setState({
      fileList,
    });
    if (onChange) {
      onChange(fileList);
    }
  }

  // handleChange = ({ fileList }) => {
  //   this.setState({ fileList });
  //   let formatFileList = [];
  //   try {
  //     formatFileList = fileList.map((item) => {
  //       if (item.status && item.status === 'done') {
  //         this.shouldChangeFlag = true;
  //         return item.response.data;
  //       }
  //       return item;
  //     });
  //   } catch (e) {
  //     asyncFeedback.error(e.message);
  //   }

  //   if (this.shouldChangeFlag && this.props.onChange) {
  //     this.shouldChangeFlag = false;
  //     this.props.onChange(formatFileList);
  //   }
  // }


  formatValue(value) {
    if (!value || !value.length) {
      return [];
    }
    const tempList = value.filter((item) => !!item);
    if (tempList[0] && tempList[0].ossUrl) {
      return tempList.map((item) => {
        if (item.uid) {
          return item;
        }
        return { ...item, uid: item._id };
      });
    }

    return tempList.map((item, index) => ({
      uid: uuidv4(),
      url: item,
      ossUrl: item,
    }));
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { maxItems, previewBtnTitle, onClickPreviewBtn } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="upload-image-multi clearfix">
        <Upload
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}

          onRemove={this.handleRemove}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= maxItems ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
          {
            previewBtnTitle && (
            <div className={styles.isMainBtnWrap}>
              <Button
                type="primary"
                onClick={onClickPreviewBtn}
              >
                {previewBtnTitle}
              </Button>

            </div>
            )
          }
        </Modal>
      </div>
    );
  }
}

export default UploadImageMulti;
