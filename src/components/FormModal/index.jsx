import { Form, Modal } from 'antd';

import React, { useEffect, useState } from 'react';
import { getComponent } from '../../utils/component-map';
import { getFormInitValue } from '../../utils';

const FormModal = (props) => {
  const [form] = Form.useForm();

  const {
    value = {},
    modalVisible,
    onOk,
    onModalVisible,
    title,
    layout = {},
    formItemList = [],
  } = props;

  const [initialed, setInitialed] = useState(false);

  const okHandle = () => {
    form.validateFields().then((values) => {
      onOk(values);
    });
  };

  const FormItemDOMList = (itemList, layoutTemp) => itemList.map((item) => {
    const customLayout = { ...item.layout, ...layoutTemp };
    const itemLabelAndLayout = {
      label: item.title,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      ...customLayout,
    };
    return getComponent(item, { name: item.key, ...itemLabelAndLayout });
  });

  const initialValues = getFormInitValue(formItemList, value);
  // form.setFieldsValue(initialValues);

  useEffect(() => {
    if (initialed) {
      form.setFieldsValue(initialValues);
    }
  }, [JSON.stringify(value), initialed]);

  useEffect(() => {
    if (modalVisible) {
      setInitialed(true);
    } else {
      const emptyValues = getFormInitValue(formItemList, {});
      form.setFieldsValue(emptyValues);
    }
  }, [modalVisible]);

  return (
    <Modal
      {...props}
      destroyOnClose
      getContainer={false}
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onModalVisible()}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(changedValue, values) => {
          if (props.onValuesChange) {
            props.onValuesChange(values);
          }
        }}
      >
        {FormItemDOMList(formItemList, layout)}
      </Form>
    </Modal>
  );
};

export default FormModal;
