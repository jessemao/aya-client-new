import React, { Component } from 'react';
import { Layout } from 'antd';
import GlobalHeaderBase from './GlobalHeaderBase';

import './index.less';

const { Header } = Layout;

class GlobalHeaderView extends Component {
  ticking = false

  oldScrollTop = 0

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }


  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount(): void {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const {
      isMobile,
      collapsed,
      fixedHeader,
      layout,
      siderWidth = 256,
    } = this.props;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : `calc(100% - ${siderWidth}px)`;
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  renderContent = () => {
    const {
      handleMenuCollapse,
    } = this.props;
    const defaultDom = (
      <GlobalHeaderBase onCollapse={handleMenuCollapse} {...this.props} />
    );

    return defaultDom;
  };

  render() {
    const { fixedHeader } = this.props;
    const { visible } = this.state;
    const width = this.getHeadWidth();
    return visible ? (
      <Header
        style={{ padding: 0, width, zIndex: 2 }}
        className={fixedHeader ? 'ant-pro-fixed-header' : ''}
      >
        {this.renderContent()}
      </Header>
    ) : null;
  }
}

export default GlobalHeaderView;
