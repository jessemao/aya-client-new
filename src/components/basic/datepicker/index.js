import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default (props) => {
  const { pickerType, ...rest } = props;
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
    />
  );
};
