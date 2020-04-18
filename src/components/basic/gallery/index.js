import OSS from 'ali-oss';
import React, { Component } from 'react';
import classnames from 'classnames';
import fetch from 'axios';
import {
  Modal, Button, Pagination,
} from 'antd';
// import asyncFeedback from '../async-feedback';
import styles from './index.module.less';
import config from '../../../config';

class Gallery extends Component {
  static defaultProps = {
    currentPage: 1,
    total: 100,
    pageSize: 20,
    showPagination: true,
    selectedList: [],
    onClickPreviewBtn: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      token: {},
      currentPage: props.currentPage,
      total: props.total,
      pageSize: props.pageSize,
      markerMap: {},
      previewVisible: false,
      previewImage: '',
      fileList: props.value || [],
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

    if (res.data.success) {
      const token = res.data.data;
      this.setState({
        token,
      });

      await this.getImageList();
    }
  }

  getImageList = async (page) => {
    const { ossDir } = this.props;
    const { pageSize, markerMap } = this.state;
    const client = this.getClient();
    let prefixOptions = config.ossEnvDir;
    if (ossDir) {
      prefixOptions = `${config.ossEnvDir}/${ossDir}`;
    }
    const listOptions = {
      prefix: prefixOptions.substring(1),
      delimiter: '/',
    };
    if (pageSize) {
      listOptions['max-keys'] = pageSize;
    }
    const currentPage = page || 1;
    if (markerMap[currentPage]) {
      listOptions.marker = markerMap[currentPage];
    }
    const res = await client.list(listOptions);
    const tempMarkerMap = { ...markerMap, [currentPage + 1]: res.nextMarker };
    this.setState({
      markerMap: tempMarkerMap,
      fileList: res.objects,
    });
  }

  getClient = () => {
    if (this.client) {
      return this.client;
    }
    const bucketName = 'mclub-image-01';
    const endpoint = 'oss-cn-shenzhen.aliyuncs.com';
    const { token } = this.state;
    this.client = new OSS({
      endpoint,
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      stsToken: token.SecurityToken,
      bucket: bucketName,
    });
    return this.client;
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  handleChangePage = (page, pageSize) => {
    this.getImageList(page);
    this.setState({
      currentPage: page,
      pageSize,
    });
  }

  renderImageList() {
    const { selectedList } = this.props;
    const { fileList } = this.state;
    if (!fileList || !fileList.length) {
      return null;
    }
    return (
      <div className={styles.imageList}>
        {
          fileList.map((image) => {
            const isSelected = !!selectedList.find((item) => item === image.url);
            const classNames = classnames(styles.imageItem, {
              [styles.active]: isSelected,
            });
            return (
              <div
                key={image.url}
                className={classNames}
                onClick={() => {
                  this.props.onSelect(image);
                }}
              >
                <img src={image.url} alt={image.name} />
              </div>
            );
          })
        }
      </div>
    );
  }

  renderPagination() {
    const { showPagination } = this.props;
    const { currentPage, pageSize, total } = this.state;

    if (!(showPagination && pageSize)) {
      return null;
    }
    return (
      <div className={styles.imagePagination}>
        <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={this.handleChangePage} />
      </div>
    );
  }

  render() {
    const {
      previewVisible, previewImage,
    } = this.state;
    const { previewBtnTitle, onClickPreviewBtn } = this.props;
    return (
      <div className="gallery clearfix">
        {
          this.renderImageList()
        }
        {
          this.renderPagination()
        }
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

export default Gallery;
