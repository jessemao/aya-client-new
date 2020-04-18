import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';

import { List, Form } from 'antd';

import ResetPwdModal from './ResetPwdModal';
import AccountStore from '../../../stores/AccountStore';

const passwordStrength = {
  strong: (
    <span className="strong">
      强
    </span>
  ),
  medium: (
    <span className="medium">
      中
    </span>
  ),
  weak: (
    <span className="weak">
      差
    </span>
  ),
};


const MODAL_TYPE = {
  password: 'passwordVisible',
};

@observer
class SecurityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordVisible: false,
    };
  }

  getData = () => [
    {
      title: '账户密码',
      description: (
        <Fragment>
          当前密码强度：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a key="Modify" onClick={() => this.handleModalVisible({ type: MODAL_TYPE.password, visible: true })}>
          修改
        </a>,
      ],
    },
    // {
    //   title: '电话号码',
    //   description: '输入电话号码',
    //   actions: [
    //     <a key="Modify">
    //       修改
    //     </a>,
    //   ],
    // },

    // {
    //   title: '密保邮箱',
    //   description: '输入密保邮箱',
    //   actions: [
    //     <a key="Modify">
    //       修改
    //     </a>,
    //   ],
    // },

  ];


  handleModalVisible = ({ type, visible }) => {
    this.setState({
      [type]: visible,
    });
  }

  handlePassword = (fields) => {
    const { currentUser } = AccountStore;
    AccountStore.ResetPassword({ accountId: currentUser._id, password: fields.password });
    this.setState({
      [MODAL_TYPE.password]: false,
    });
  }

  render() {
    const data = this.getData();
    const { passwordVisible } = this.state;

    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <ResetPwdModal
          visible={passwordVisible}
          onOk={this.handlePassword}
          onCancel={() => {
            this.handleModalVisible({ type: MODAL_TYPE.password, visible: false });
          }}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
