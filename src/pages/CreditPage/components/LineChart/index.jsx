import React from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

export default function LineChart(props) {
  const defaultProps = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: { type: 'time', minInterval: 3600 * 24 * 1000 },
    yAxis: {},
    legend: {},
  };

  const { onEvents = {}, ...rest } = props;
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
