import { Icon, Menu } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import { getMenuMatches } from './SideMenuUtils';
import { isUrl, urlToList } from '../../utils';

import './index.less';

const { SubMenu } = Menu;

let IconFont = '';

const getIcon = (icon) => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return (
        <Icon
          component={() => (
            <img
              src={icon}
              alt="icon"
              className="ant-prefix}-pro-sider-menu-icon"
            />
          )}
        />
      );
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

export default class SideMenuBase extends Component {
  constructor(props) {
    super(props);
    const { iconfontUrl } = props;
    // reset IconFont
    if (iconfontUrl) {
      IconFont = Icon.createFromIconfontCN({
        scriptUrl: iconfontUrl,
      });
    }
  }

  state = {};

  getNavMenuItems = (menusData = []) => menusData
    .filter((item) => item.name && !item.hideInMenu)
    .map((item) => this.getSubMenuOrItem(item))
    .filter((item) => item);

  // Get the currently selected menu
  getSelectedMenuKeys = (pathname) => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname)
      .map((itemPath) => getMenuMatches(flatMenuKeys, itemPath).pop())
      .filter((item) => item);
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    if (
      Array.isArray(item.children)
      && !item.hideChildrenInMenu
      && item.children.some((child) => !!child.name)
    ) {
      const name = this.getIntlName(item);
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getIntlName(item) {
    return item.name;
  }

  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const {
      location = { pathname: '/' },
      isMobile,
      onCollapse,
      menuItemRender,
    } = this.props;
    const { target } = item;
    // if local is true formatMessage all name。
    const name = this.getIntlName(item);
    let defaultItem = (
      <div>
        {icon}
        <span>{name}</span>
      </div>
    );

    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      defaultItem = (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    if (menuItemRender) {
      return menuItemRender(
        {
          ...item,
          itemPath,
          replace: itemPath === location.pathname,
          onClick: () => (isMobile ? onCollapse && onCollapse(true) : null),
        },
        defaultItem,
      );
    }
    return defaultItem;
  };

  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  getPopupContainer = (fixedHeader, layout) => {
    if (fixedHeader && layout === 'topmenu' && this.warp) {
      return this.warp;
    }
    return document.body;
  };

  getRef = (ref) => {
    this.warp = ref;
  };


  render() {
    const {
      openKeys,
      theme,
      mode,
      location = {
        pathname: '/',
      },
      className,
      collapsed,
      handleOpenChange,
      style,
      fixedHeader = false,
      layout = 'sidemenu',
      menuData,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(location.pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys && !collapsed && layout === 'sidemenu') {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <div>
        <Menu
          {...props}
          key="Menu"
          mode={mode}
          theme={theme}
          onOpenChange={handleOpenChange}
          selectedKeys={selectedKeys}
          style={style}
          className={cls}
          getPopupContainer={() => this.getPopupContainer(fixedHeader, layout)}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
        <div ref={this.getRef} />
      </div>
    );
  }
}
