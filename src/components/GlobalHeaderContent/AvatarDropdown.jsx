import { Link, withRouter } from 'react-router-dom';
import {
  Avatar, Icon, Menu, Spin,
} from 'antd';
import { observer } from 'mobx-react';

import React from 'react';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.module.less';
import AccountStore from '../../stores/LoginStore';

@observer
class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;
    const { history } = this.props;

    if (key === 'logout') {
      AccountStore.HandleLogout();
      history.push('/login');
      return;
    }

    history.push(`/profile/${key}`);
  };

  render() {
    const { menu, currentUser = {} } = this.props;
    const { basicInfo: userInfo } = currentUser;
    if (!menu) {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={userInfo.avatarUrl}
            alt={userInfo.username}
          />
          <span
            className={styles.name}
          >
            {currentUser.username}
          </span>
        </span>
      );
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <Icon type="user" />
          <span>用户中心</span>
        </Menu.Item>
        <Menu.Item key="settings">
          <Icon type="setting" />
          <span>用户设置</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span>登出</span>
        </Menu.Item>
      </Menu>
    );
    return userInfo && userInfo.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={userInfo.avatarUrl}
          >
            {userInfo.username[0].toUpperCase()}
          </Avatar>
          <span className={styles.name}>{userInfo.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </HeaderDropdown>

    );
  }
}

export default withRouter(AvatarDropdown);
