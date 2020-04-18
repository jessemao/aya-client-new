import React, { Component } from 'react';
import {
  Form, Input, Modal,
} from 'antd';

import { PASSWORD_REGEX } from '../../../constants';
import { EncryptPassword } from '../../../utils';
import GlobalStore from '../../../stores/GlobalStore';

const { Item } = Form;


class ResetPwdModal extends Component {
  formRef = React.createRef();

  static defaultProps = {
    formItemLayout: {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      disableOk: true,
    };
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  }

  validateToNextPassword = (rule, value, callback) => {
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      this.formRef.current.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== this.formRef.current.getFieldValue('password')) {
      callback('密码输入不一致！');
      const { disableOk } = this.state;
      if (!disableOk) {
        this.setState({
          disableOk: true,
        });
      }
    } else {
      this.setState({
        disableOk: false,
      });
      callback();
    }
  }

  handlePassword = () => {
    const { onOk } = this.props;
    const password = EncryptPassword(this.formRef.current.getFieldValue('password'), GlobalStore.privateKey);
    if (onOk) {
      onOk({ password });
    }
  }


  render() {
    const { formItemLayout, ...rest } = this.props;
    const { disableOk } = this.state;

    return (
      <Modal
        maskClosable={false}
        {...rest}
        okButtonProps={
          { disabled: disableOk }
        }
        onOk={this.handlePassword}
      >
        <Form
          hideRequiredMark
          ref={this.formRef}
        >
          <Item
            {...formItemLayout}
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              {
                pattern: PASSWORD_REGEX,
                message: '密码必须至少包含1个大写字母，1个小写字母和1个数字，且至少8个字符',
              },
              {
                validator: this.validateToNextPassword,
              },
            ]}
            hasFeedback
            whitespace
          >
            <Input.Password
              placeholder="密码"
            />
          </Item>
          <Item
            {...formItemLayout}
            label="确认密码"
            name="confirm"
            rules={[{
              required: true,
              message: '请再次输入新密码',
            }, {
              validator: this.compareToFirstPassword,
            }]}
            hasFeedback
            whitespace
          >
            <Input.Password
              placeholder="确认密码"
              onBlur={this.handleConfirmBlur}
            />
          </Item>
        </Form>
      </Modal>
    );
  }
}

export default ResetPwdModal;
