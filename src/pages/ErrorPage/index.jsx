import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export default ({
  redirectPath = '/', redirectPageTitle = '返回首页', subTitle = '抱歉，你无权访问该页面。', status, title,
} = {}) => (
  <Result
    status={status}
    title={title}
    style={{
      background: 'none',
    }}
    subTitle={subTitle}
    extra={(
      <Link to={redirectPath}>
        <Button type="primary">
          {redirectPageTitle}
        </Button>
      </Link>
    )}
  />
);
