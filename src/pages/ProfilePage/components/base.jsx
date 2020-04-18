import {
  Form, Button,
} from 'antd';
import React, { Component } from 'react';

import { getComponent } from '../../../utils/component-map';
import styles from './base.module.less';

const FormItem = Form.Item;

const ItemList = [
  {
    key: 'username',
    title: '用户名',
    compType: 'input',
    dataType: 'text',
    validateRule: {
      rules: [
        {
          required: true,
          message: '必须',
        },
      ],
    },
  },
  {
    key: 'email',
    title: '邮箱',
    compType: 'input',
    dataType: 'text',
  },
  {
    key: 'phoneNumber',
    title: '电话',
    compType: 'input',
    dataType: 'text',
    validateRule: {
      rules: [
        {
          required: true,
          message: '必须',
        },
      ],
    },
  },
  {
    key: 'lastname',
    title: '姓',
    compType: 'input',
    dataType: 'text',
    validateRule: {
      rules: [
        {
          required: true,
          message: '必须',
        },
      ],
    },
  },
  {
    key: 'firstname',
    title: '名',
    compType: 'input',
    dataType: 'text',
    validateRule: {
      rules: [
        {
          required: true,
          message: '必须',
        },
      ],
    },
  },

];

class BaseView extends Component {
  formRef = React.createRef();

  view = undefined;

  getViewDom = (ref) => {
    this.view = ref;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { onFinish } = this.props;
    this.formRef.current.validateFields().then((err, fields) => {
      if (err) {
        return null;
      }
      if (onFinish) {
        onFinish(fields);
      }
    });
  };

  handleChangeAvatar = (value) => {
    const { onFinish } = this.props;
    if (onFinish) {
      onFinish({ avatarUrl: value });
    }
  }


  renderAvatar() {
    const { form, value } = this.props;
    const avatar = {
      key: 'avatarUrl',
      compType: 'image',
    };
    const itemLabelAndLayout = {
      wrapperCol: { span: 24 },
    };

    const itemProps = {
      ...avatar, form, data: value, onChange: this.handleChangeAvatar,
    };
    return (
      <FormItem
        key={avatar.key}
        {...itemLabelAndLayout}
      >
        {getComponent(itemProps)}
      </FormItem>
    );
  }

  renderFormItemDOMList = (itemList, layoutTemp) => {
    const { value } = this.props;
    return itemList.map((item) => {
      const customLayout = { ...item.layout, ...layoutTemp };
      const itemLabelAndLayout = {
        label: item.title,
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        ...customLayout,
      };
      const itemProps = { ...item, name: item.key, data: value };
      return (
        <FormItem
          key={item.key}
          {...itemLabelAndLayout}
        >
          {getComponent(itemProps)}
        </FormItem>
      );
    });
  }

  render() {
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form ref={this.formRef} layout="vertical" hideRequiredMark>
            {
              this.renderFormItemDOMList(ItemList)
            }
            <Button type="primary" onClick={this.handleSubmit}>
              更新信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          {
            this.renderAvatar()
          }
        </div>
      </div>
    );
  }
}

export default BaseView;
