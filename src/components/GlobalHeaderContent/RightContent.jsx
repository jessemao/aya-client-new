import { Icon, Tooltip } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import NoticeIconView from './NoticeIconView';
import styles from './index.module.less';

const GlobalHeaderRight = (props) => {
  const { theme, layout, currentUser } = props;
  let className = `${styles.right}`;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {/*
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        dataSource={[
          formatMessage({
            id: 'component.globalHeader.search.example1',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example2',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example3',
          }),
        ]}
        onSearch={(value) => {
          console.log('input', value);
        }}
        onPressEnter={(value) => {
          console.log('enter', value);
        }}
      />
      */}
      <Tooltip
        title="帮助"
      >
        <a
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <Icon type="question-circle-o" />
        </a>
      </Tooltip>
      <NoticeIconView />
      <Avatar
        currentUser={currentUser}
        menu
      />
    </div>
  );
};

export default GlobalHeaderRight;
