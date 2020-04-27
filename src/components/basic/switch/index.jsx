import React from 'react';
import { Switch } from 'antd';

export default function SwitchWrapper(props) {
  const { value, ...others } = props;
  return (
    <Switch
      {...others}
      checked={!!value}
    />
  );
}
