import React from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

export default function BarChart(props) {
  const defaultProps = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {},
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
