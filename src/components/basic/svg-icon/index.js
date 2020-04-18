import React from 'react';
import classnames from 'classnames';

const SvgIcon = ({ svgId, className }) => {
  const classNames = classnames('svg-icon', className);
  return (
    <svg className={classNames}>
      <use xlinkHref={`${process.env.PUBLIC_URL}/resources/svg-sprite.svg#${svgId}`} />
    </svg>
  );
};

export default SvgIcon;
