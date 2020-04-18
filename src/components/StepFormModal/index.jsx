import {
  Button, Form, Modal, Steps,
} from 'antd';

import React, { Component } from 'react';
import { getComponent } from '../../utils/component-map';
import { getFormInitValue } from '../../utils';

const FormItem = Form.Item;
const { Step } = Steps;

class StepFormModal extends Component {
  formRef = React.createRef();

  static defaultProps = {
    value: {},
    width: 640,
    onOk: () => {},
    onModalVisible: () => {},
    onTemporarySave: () => {},
    modalVisible: false,
    showDraftButton: true,
    formItemMap: {},
    formLayout: {},
    maskClosable: false,
    resetAfterClose: true,
    stepTitle: {},
    title: '',
    Comp: null,
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      currentStep: 0,
    };
  }

  handleCancel = () => {
    const { onModalVisible, resetAfterClose } = this.props;
    if (resetAfterClose) {
      this.setState({
        value: {},
        currentStep: 0,
      });
    }
    onModalVisible({ visible: false });
  }

  handleTemporarySave = () => {
    const { onTemporarySave } = this.props;
    const { value: oldValue } = this.state;

    this.formRef.current.validateFields().then((err, fieldsValue) => {
      if (err) return;
      const value = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          value,
        },
        () => {
          onTemporarySave(value);
        },
      );
    });
  }

  handleNext = (currentStep) => {
    const {
      onOk, formItemMap, onModalVisible, onNext,
    } = this.props;
    const { value: oldValue } = this.state;
    const stepLength = Object.keys(formItemMap).length;
    this.formRef.current.validateFields().then((fieldsValue) => {
      const value = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          value,
        },
        () => {
          if (currentStep < stepLength - 1) {
            this.forward();
            if (onNext) {
              onNext(value, currentStep);
            }
          } else {
            onModalVisible({ visible: false });
            onOk(value);
            this.setState({
              currentStep: 0,
              value: {},
            });
          }
        },
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep) => {
    const { formItemMap } = this.props;

    return this.formItemDOMList(formItemMap[currentStep]);
  };

  renderFooter = (currentStep) => {
    const { formItemMap, showDraftButton } = this.props;
    const { value } = this.state;
    const keyLength = Object.keys(formItemMap).length;
    if (currentStep >= 1 && currentStep < keyLength - 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        (showDraftButton && (
        <Button key="draft" onClick={() => this.handleTemporarySave(value)}>
          保存草稿
        </Button>
        )),
        <Button key="cancel" onClick={() => this.handleCancel(value)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === keyLength - 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        (showDraftButton && (
        <Button key="draft" onClick={() => this.handleTemporarySave(value)}>
          保存草稿
        </Button>
        )),
        <Button key="cancel" onClick={() => this.handleCancel(value)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          保存
        </Button>,
      ];
    }
    return [
      (showDraftButton && (
      <Button key="draft" onClick={() => this.handleTemporarySave(value)}>
        保存草稿
      </Button>
      )),
      <Button key="cancel" onClick={() => this.handleCancel(value)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };


  formItemDOMList = (itemList) => itemList.map((item) => {
    const { layout = {} } = item;
    const itemLabelAndLayout = {
      label: item.title,
      ...this.formLayout,
      ...layout,
    };
    return (
      <FormItem
        name={item.key}
        {...itemLabelAndLayout}
      >
        {getComponent(item)}
      </FormItem>
    );
  })

  render() {
    const {
      modalVisible, onModalVisible, title, stepTitle, width, formItemMap, value, onValuesChange, ...rest
    } = this.props;
    const { currentStep } = this.state;

    const initialValues = getFormInitValue(formItemMap[currentStep], value);
    return (
      <Modal
        {...rest}
        width={width}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={title}
        visible={modalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => onModalVisible({ visible: false })}
        afterClose={() => onModalVisible({ visible: false })}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          {stepTitle.map((sTitle) => <Step title={sTitle} key={sTitle} />)}
        </Steps>
        <Form
          ref={this.formRef}
          initialValues={initialValues}
          onValuesChange={(changedValue, values) => {
            if (onValuesChange) {
              onValuesChange(changedValue, values);
            }
          }}
        >
          {this.renderContent(currentStep)}
        </Form>
      </Modal>
    );
  }
}

export default StepFormModal;
