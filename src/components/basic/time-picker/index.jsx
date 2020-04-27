import React from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';

export default (props) => {
  const {
    value, format, onChange, ...rest
  } = props;
  const defaultFormat = 'HH:mm:ss';
  const renderFormat = format || defaultFormat;
  const defaultValue = moment('00:00:00', defaultFormat);
  let momentDate = null;
  if (!value) {
    momentDate = defaultValue;
  } else {
    momentDate = moment(value, renderFormat);
  }
  return (
    <TimePicker
      format={renderFormat}
      value={momentDate}
      onChange={(val, stringVal) => {
        onChange(stringVal);
      }}
      {...rest}
    />
  );
};
