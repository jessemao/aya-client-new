import React, { Component } from 'react';
import { observer } from 'mobx-react';

import debounce from 'lodash/debounce';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import './GlobalHeaderBase.less';
import globalStore from '../../stores/GlobalStore';

@observer
class GlobalHeaderBase extends Component {
  triggerResizeEvent = debounce(() => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  });

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    if (onCollapse) {
      onCollapse(!collapsed);
    } else {
      globalStore.collapseSideMenu(!collapsed);
    }
    this.triggerResizeEvent();
  };

  render() {
    const {
      collapsed, isMobile, logo, rightContentRender,
    } = this.props;
    return (
      <div className="ant-pro-global-header">
        {isMobile && (
          <a className="ant-pro-global-header-logo" key="logo">
            {defaultRenderLogo(logo)}
          </a>
        )}
        <span className="ant-pro-global-header-trigger" onClick={this.toggle}>
          {collapsed && <MenuUnfoldOutlined />}
          {!collapsed && <MenuFoldOutlined />}
        </span>
        {rightContentRender && rightContentRender(this.props)}
      </div>
    );
  }
}

export default GlobalHeaderBase;
