import React from 'react';

export default function Span(props) {
  let displayText = props.value;
  if (props.value && props.value.isValid) {
    displayText = props.value.format('YYYY-MM-DD');
  }
  return (
    <span>
      {displayText}
    </span>
  );
}
