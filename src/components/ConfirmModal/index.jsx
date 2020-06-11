import {
  Form, Modal, Row, Col, Button,
} from 'antd';

import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { getComponent } from '../../utils/component-map';

const ConfirmModal = (props) => {
  const [form] = Form.useForm();

  const {
    getCaptchaButtonText = '获取验证码',
    getCaptchaSecondText = '秒',
    refundTotal = 0,
    countDown = 60,
    onOk = () => {},
    onCancel = () => {},
    onCaptcha = () => {},
    title,
    visible,
    phoneNumber,
    captcha,
  } = props;

  const [count, setCount] = useState(countDown);

  const onGetCaptcha = () => {
    onCaptcha();
    setCount(59);
  };

  useEffect(() => {
    if (count >= 1 && count < 60) {
      setTimeout(() => {
        const newCountDown = count - 1;

        setCount(newCountDown);
      }, 1000);
    }
  }, [count]);


  const handleOk = () => {
    form.validateFields().then((fieldsValue) => {
      form.resetFields();
      onOk(fieldsValue);
    });
  };

  const itemProps = [{
    key: 'phoneNumber',
    compType: 'input',
    title: '手机',
    validateRule: {
      rules: [
        {
          required: true,
          message: 'Please enter PhoneNumber!',
        },
      ],
    },
  }, {
    key: 'captcha',
    compType: 'input',
    title: '验证码',
    validateRule: {
      rules: [
        {
          required: true,
          message: 'Please enter Captcha!',
        },
      ],
    },
  }];

  const FormItemDOMList = (itemList, layoutTemp = {}) => itemList.map((item) => {
    const customLayout = { ...item.layout, ...layoutTemp };
    const itemLabelAndLayout = {
      label: item.title,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      ...customLayout,
    };
    return getComponent(item, { name: item.key, ...itemLabelAndLayout });
  });

  const initialValues = { phoneNumber, captcha };


  return (
    <Modal
      title={title}
      destroyOnClose
      getContainer={false}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Row>
        <div className={styles.content}>
          {
            `该退款发生后将原路退款 ${refundTotal}，请确认是否同意？`
          }
        </div>
      </Row>
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(changedValue, values) => {
          if (props.onValuesChange) {
            props.onValuesChange(values);
          }
        }}
      >
        <Row>
          <Col span={16}>
            {FormItemDOMList([itemProps[0]])}
          </Col>

        </Row>
        <Row>
          <Col span={16}>
            {FormItemDOMList([itemProps[1]])}
          </Col>
          <Col span={8}>
            <Button
              disabled={count !== 60}
              className={styles.getCaptcha}
              size="middle"
              onClick={onGetCaptcha}
            >
              {count !== 60 ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ConfirmModal;
