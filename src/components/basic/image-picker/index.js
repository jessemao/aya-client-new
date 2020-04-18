import React, { Component } from 'react';
import {
  Modal, Button,
} from 'antd';
import Gallery from '../gallery';
import ImageUploader from '../upload-image';
import ImageUploaderMulti from '../upload-image-multi';


import styles from './index.module.less';

class ImagePicker extends Component {
  static defaultProps = {
    showPicker: true,
  }


  constructor(props) {
    super(props);
    let { value } = props;
    if (!Array.isArray(value)) {
      if (value) {
        value = [value];
      } else {
        value = [];
      }
    }
    this.state = {
      showModal: false,
      selectedList: value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectedList } = this.state;
    const { value } = nextProps;
    if (selectedList !== value || (Array.isArray(value) && (selectedList.length !== value.length))) {
      let selectedValue = value;
      if (!Array.isArray(value)) {
        if (value) {
          selectedValue = [value];
        } else {
          selectedValue = [];
        }
      }
      this.setState({
        selectedList: selectedValue,
      });
    }
  }

  handleClickBtn = () => {
    this.setState({
      showModal: true,
    });
  }

  handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  }

  handleOk = () => {
    const { onChange, mode } = this.props;
    if (mode === 'multiple') {
      const { selectedList } = this.state;
      onChange(selectedList);
    }
    this.handleCloseModal();
  }

  handleSelectImage = (image) => {
    const { onChange, mode } = this.props;

    if (mode !== 'multiple') {
      this.handleCloseModal();
      this.setState({
        selectedList: [image],
      });
      onChange(image.url);
    } else {
      const { selectedList } = this.state;
      const list = [...selectedList];
      const newList = list.filter((item) => item !== image.url);
      if (newList.length === list.length) {
        newList.push(image.url);
      }
      this.setState({
        selectedList: newList,
      });
    }
  }

  render() {
    const { showPicker, mode, ...rest } = this.props;
    const { showModal, selectedList } = this.state;
    let ImageUploaderComp = null;
    if (mode === 'multiple') {
      ImageUploaderComp = ImageUploaderMulti;
    } else {
      ImageUploaderComp = ImageUploader;
    }
    return (
      <div className={styles.imagePicker}>
        <ImageUploaderComp
          {...rest}
        />
        {
          showPicker && <Button type="link" className={styles.selectBtn} onClick={this.handleClickBtn}>从图库中选择</Button>
        }
        {
          showPicker && (
          <Modal
            width={800}
            className={styles.pickerModal}
            visible={showModal}
            okText=""
            onCancel={this.handleCloseModal}
            onOk={this.handleOk}
            title="从图库中选择"
          >
            <Gallery
              ossDir={rest.ossDir}
              onSelect={this.handleSelectImage}
              selectedList={selectedList}
            />
          </Modal>
          )
        }
      </div>
    );
  }
}

export default ImagePicker;
