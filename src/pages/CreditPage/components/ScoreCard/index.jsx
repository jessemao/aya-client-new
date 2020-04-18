import React from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

export default function (props) {
  const {
    title, content, footer, className,
  } = props;
  const scorecardClass = classnames(className, styles.scorecard);
  return (
    <div className={scorecardClass}>
      {
        !!title && (<div className={styles.title}>{title}</div>)
      }
      <div className={styles.content}>{content}</div>
      {
        !!footer && (<div className={styles.footer}>{footer}</div>)
      }
    </div>
  );
}
