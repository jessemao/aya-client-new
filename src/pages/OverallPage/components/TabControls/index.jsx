import React from 'react';
import { DatePicker, Switch } from 'antd';
import styles from './index.module.less';

const { RangePicker } = DatePicker;

function isActive(type, selectType) {
  return type === selectType ? styles.selectedDateType : '';
}

function getPickerType(selectType) {
  if (selectType === 'week') {
    return 'date';
  }
  return selectType;
}

export default ({
  selectedDateType, dateRangeValue, UpdateActiveDateType, HandleRangePickerChange, HandleChangeBarChartType, stackedBarChart,
}) => (
  <div className={styles.visExtraWrap}>
    <div className={styles.switchControl}>
      <Switch
        onChange={HandleChangeBarChartType}
        checked={stackedBarChart}
        checkedChildren="汇总"
      />
    </div>
    <div className={styles.visExtra}>
      <a className={isActive('week', selectedDateType)} onClick={() => UpdateActiveDateType('week')}>
        周
      </a>
      <a className={isActive('month', selectedDateType)} onClick={() => UpdateActiveDateType('month')}>
        月
      </a>
      <a className={isActive('year', selectedDateType)} onClick={() => UpdateActiveDateType('year')}>
        年
      </a>
    </div>
    <div>
      <RangePicker
        value={dateRangeValue}
        onCalendarChange={(val) => {
          HandleRangePickerChange(val);
        }}
        picker={getPickerType(selectedDateType)}
        style={{
          width: 256,
        }}
      />
    </div>
  </div>
);
