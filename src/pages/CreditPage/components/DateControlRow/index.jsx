import {
  Select, DatePicker, Card,
} from 'antd';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useStores } from '../../../../stores/hook';
import styles from './index.module.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  style: {
    marginBottom: 24,
  },
};

const { Option } = Select;

const DATE_TYPE_OPTION_LIST = [
  {
    key: 'day',
    label: '日',
  },
  {
    key: 'week',
    label: '周',
  },
  {
    key: 'month',
    label: '月',
  },
];

const DATE_TYPE_SELECT_BTN = {
  day: ['前一日', '后一日'],
  week: ['前一星期', '后一星期'],
  month: ['前一月', '后一月'],
};

export default observer(() => {
  const { CreditStore } = useStores();
  const [dateType, setDateType] = useState('day');
  const { UpdateSelectedDate, SetSelectedDate, selectedDate } = CreditStore;
  return (
    <Card className={styles.controlRow}>
      <div className={styles.cardRow}>

        <div className={styles.pageTitle}>
          授信额度
        </div>
        <div className={styles.visExtraWrap}>
          <div className={styles.visExtra}>
            <a className={styles.selectBtn} onClick={() => UpdateSelectedDate(dateType, false)}>
              {DATE_TYPE_SELECT_BTN[dateType][0]}
            </a>
            <a className={styles.selectBtn} onClick={() => UpdateSelectedDate(dateType, true)}>
              {DATE_TYPE_SELECT_BTN[dateType][1]}
            </a>
          </div>
          <div className={styles.visDatePicker}>
            <DatePicker
              onChange={SetSelectedDate}
              value={selectedDate}
            />
          </div>
          <div className={styles.visDateType}>
            <Select
              value={dateType}
              onChange={setDateType}
            >
              {
            DATE_TYPE_OPTION_LIST.map((item) => (
              <Option value={item.key} key={item.key}>{item.label}</Option>
            ))
          }
            </Select>
          </div>

        </div>
      </div>
    </Card>
  );
});
