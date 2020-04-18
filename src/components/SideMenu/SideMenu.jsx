import React, { Component } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import BaseMenu from './BaseMenu';
import { getDefaultCollapsedSubMenus } from './SideMenuUtils';
import DEFAULT_LOGO from '../../images/logo.png';

import './index.less';

const { Sider } = Layout;

let firstMount = true;

export const defaultRenderLogo = (logo) => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />;
  }
  if (typeof logo === 'function') {
    return logo();
  }
  return logo;
};


class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  componentDidMount() {
    firstMount = false;
  }

  isMainMenu = (key) => {
    const { menuData = [] } = this.props;
    return menuData.some((item) => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = (openKeys) => {
    const moreThanOne = openKeys.filter((openKey) => this.isMainMenu(openKey)).length > 1;
    if (moreThanOne) {
      this.setState({
        openKeys: [openKeys.pop()].filter((item) => item),
      });
    } else {
      this.setState({ openKeys: [...openKeys] });
    }
  };

  render() {
    const {
      logo = DEFAULT_LOGO,
      collapsed,
      title,
      fixSiderbar,
      onCollapse,
      theme,
      siderWidth = 256,
      isMobile,
      layout,
    } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed || layout !== 'sidemenu' ? {} : { openKeys };
    const siderClassName = classNames('ant-pro-sider-menu-sider', {
      'fix-sider-bar': fixSiderbar,
      light: theme === 'light',
    });
    return (
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={(collapse) => {
          if (firstMount || !isMobile) {
            if (onCollapse) {
              onCollapse(collapse);
            }
          }
        }}
        width={siderWidth}
        theme={theme}
        className={siderClassName}
      >
        <div className="ant-pro-sider-menu-logo" id="logo">
          <a>
            {defaultRenderLogo(logo)}
            <h1>{title}</h1>
          </a>
        </div>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}

export default SideMenu;
