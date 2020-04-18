import { PageHeader, Tabs } from 'antd';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { withRouter } from 'react-router-dom';

import './index.module.less';

import GridContent from '../GridContent';
import { getMenuData } from '../../utils/menu';
import { NAV_ROUTE_REGISTER } from '../../constants/nav';
import { getBreadcrumbProps } from '../../utils/breadcrumb';

const prefixedClassName = 'ant-pro-page-header-wrap';

/**
 * render Footer tabList
 * In order to be compatible with the old version of the PageHeader
 * basically all the functions are implemented.
 */
const renderFooter = ({
  tabList,
  tabActiveKey,
  onTabChange,
  tabBarExtraContent,
}) => (tabList && tabList.length ? (
  <Tabs
    className={`${prefixedClassName}-tabs`}
    activeKey={tabActiveKey}
    onChange={(key) => {
      if (onTabChange) {
        onTabChange(key);
      }
    }}
    tabBarExtraContent={tabBarExtraContent}
  >
    {tabList.map((item) => (
      <Tabs.TabPane tab={item.tab} key={item.key} />
    ))}
  </Tabs>
) : null);

const renderPageHeader = (
  content,
  extraContent,
) => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div className={`${prefixedClassName}-detail`}>
      <div className={`${prefixedClassName}-main`}>
        <div className={`${prefixedClassName}-row`}>
          {content && (
            <div className={`${prefixedClassName}-content`}>{content}</div>
          )}
          {extraContent && (
            <div className={`${prefixedClassName}-extraContent`}>
              {extraContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const defaultPageHeaderRender = (
  props,
) => {
  const {
    title,
    content,
    pageHeaderRender,
    extraContent,
    ...restProps
  } = props;

  if (pageHeaderRender) {
    return pageHeaderRender({ ...props });
  }
  return (
    <PageHeader
      title={title}
      {...restProps}
      footer={renderFooter(restProps)}
    >
      {renderPageHeader(content, extraContent)}
    </PageHeader>
  );
};

const PageHeaderWrapper = (props) => {
  const { children, location } = props;
  const { breadcrumb } = getMenuData(NAV_ROUTE_REGISTER);

  // TODO: 把 breadcrumb 转换成 Routes
  const pathInfo = breadcrumb[location.pathname];
  const title = pathInfo.name;

  const breadcrumbData = getBreadcrumbProps({
    location,
    breadcrumb,
  });
  const pageHeaderProps = {
    ...props,
    title,
    breadcrumb: breadcrumbData,
  };

  return (
    <DocumentTitle
      title={title}
    >
      <div>
        <div className={`${prefixedClassName}-page-header-warp`}>
          <GridContent>{defaultPageHeaderRender(pageHeaderProps)}</GridContent>
        </div>
        {children ? (
          <GridContent>
            <div className={`${prefixedClassName}-children-content`}>
              {children}
            </div>
          </GridContent>
        ) : null}
      </div>
    </DocumentTitle>

  );
};

export default withRouter(PageHeaderWrapper);
