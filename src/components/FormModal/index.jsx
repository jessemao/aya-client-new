import { Form, Modal } from 'antd';

import React from 'react';
import { getComponent } from '../../utils/component-map';
import { getFormInitValue } from '../../utils';

const FormItem = Form.Item;

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
    return (
      <FormItem
        name={item.key}
        {...itemLabelAndLayout}
      >
        {getComponent(item)}
      </FormItem>
    );
  });

  const initialValues = getFormInitValue(formItemList, value);
  return (
    <Modal
      {...props}
      destroyOnClose
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
            props.onValuesChange(changedValue, values);
          }
        }}

      >
        {FormItemDOMList(formItemList, layout)}
      </Form>
    </Modal>
  );
};

export default FormModal;
