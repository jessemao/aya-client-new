import React from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

export default function GroupBarChart(props) {
  const defaultProps = {
    tooltip: {},
    xAxis: { type: 'time', minInterval: 3600 * 24 * 1000 },
    yAxis: { },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      top: 5,
      width: '70%',
      right: 50,
    },
  };
  const { data, onEvents = {}, ...rest } = props;
  const mergedProps = _.merge(defaultProps, rest);

  return (
    <ReactEcharts
      onEvents={onEvents}
      option={{
        ...mergedProps,
      }}
    />
  );
}
