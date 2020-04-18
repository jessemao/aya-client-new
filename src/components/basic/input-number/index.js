import React from 'react';
import { InputNumber } from 'antd';

import styles from './index.module.less';

export default (props) => (
  <InputNumber
    className={styles.input}
    {...props}
  />
);
