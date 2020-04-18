import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Menu } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import AccountStore from '../../stores/AccountStore';

import BaseView from './components/base';
import SecurityView from './components/security';
import styles from './index.module.less';

const { Item } = Menu;

@observer
class ProfileSettingPage extends Component {
  main = undefined;

  constructor(props) {
    super(props);
    const menuMap = {
      base: '基本设置',
      security: '安全设置',
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  handleSubmit = (fields) => {
    const { currentUser } = AccountStore;
    AccountStore.PutItemRequest(currentUser._id, fields, { urlPrefix: 'employee' });
  }

  renderChildren = () => {
    const { selectKey } = this.state;
    const { currentUser } = AccountStore;
    const { basicInfo } = currentUser;
    switch (selectKey) {
      case 'base':
        return <BaseView onFinish={this.handleSubmit} value={basicInfo} />;
      case 'security':
        return <SecurityView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = AccountStore;
    const { mode, selectKey } = this.state;
    return (
      <PageHeaderWrapper>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ProfileSettingPage;
