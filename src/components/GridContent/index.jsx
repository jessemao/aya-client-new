import React from 'react';
import './index.module.less';


const GridContent = (props) => {
  const { children, contentWidth } = props;
  let className = 'ant-pro-grid-content';
  if (contentWidth === 'Fixed') {
    className = 'ant-pro-grid-content wide';
  }
  return <div className={className}>{children}</div>;
};

export default GridContent;
