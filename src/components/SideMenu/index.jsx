import React from 'react';
import { Drawer } from 'antd';
import {
  Link, withRouter,
} from 'react-router-dom';

import SideMenu from './SideMenu';
import { getFlatMenuKeys } from './SideMenuUtils';
import { NAV_MENU } from '../../constants';

const SideMenuWrapper = (props) => {
  const {
    isMobile, menuData, collapsed, onCollapse, accountRole,
  } = props;
  const filteredMenuData = menuData.filter((menuItem) => {
    if (typeof menuItem.accessRole === 'undefined') {
      return true;
    }
    return menuItem.accessRole >= accountRole;
  });
  const flatMenuKeys = getFlatMenuKeys(filteredMenuData);
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      className="ant-pro-sider-menu"
      onClose={() => onCollapse && onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SideMenu
        {...props}
        menuData={filteredMenuData}
        flatMenuKeys={flatMenuKeys}
        collapsed={isMobile ? false : collapsed}
      />
    </Drawer>
  ) : (
    <SideMenu
      className="ant-pro-sider-menu"
      {...props}
      menuData={filteredMenuData}
      flatMenuKeys={flatMenuKeys}
    />
  );
};

SideMenuWrapper.defaultProps = {
  menuData: NAV_MENU,
  theme: 'dark',
  layout: 'sidemenu',
  menuItemRender: (props, defaultDom) => (
    <Link to={props.path}>{defaultDom}</Link>
  ),
};

export default withRouter(SideMenuWrapper);
