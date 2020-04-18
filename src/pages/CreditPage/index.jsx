import React from 'react';
import { observer } from 'mobx-react';
import DateControlRow from './components/DateControlRow';
import CreditRow from './components/CreditRow';
import AvailableBankProductRow from './components/AvailableBankProductRow';
import ExpireRow from './components/ExpireRow';
import styles from './index.module.less';


export default observer(() => (
  <div className={styles.creditPage}>
    <DateControlRow />
    <CreditRow />
    <AvailableBankProductRow />
    <ExpireRow />
  </div>
));
