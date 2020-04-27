import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default (props) => {
  const {
    pickerType, value, format, ...rest
  } = props;
  const defaultFormat = rest.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
  const dateFormat = format || defaultFormat;
  let momentDate = null;
  if (value) {
    momentDate = moment(value);
  }
  if (pickerType === 'range') {
    return (
      <RangePicker
        {...rest}
      />
    );
  }
  return (
    <DatePicker
      {...rest}
      format={dateFormat}
      value={momentDate}
    />
  );
};
