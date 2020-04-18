import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { getRenderNode } from '../../../utils/react-utils';

import './index.css';

const Label = (props) => {
  const { dataType, populateKey, align = 'left' } = props;
  let { value } = props;
  if (populateKey) {
    value = getRenderNode({ value, populateKey, prop: props });
  }
  if (dataType === 'date') {
    value = moment(value).format('YYYY-MM-DD h:mm:ss');
  }
  const classes = classNames('common-label', `align-${align}`);
  return (
    <div className={classes}>
      {value}
    </div>
  );
};

export default Label;
