import React from 'react';
import ReactEcharts from 'echarts-for-react';
import numeral from 'numeral';
import _ from 'lodash';

export default function PieChart(props) {
  const defaultProps = {
    tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b} : {@profit} ({d})',
      formatter: (params) => {
        const {
          name, value, dimensionNames, encode, marker, percent,
        } = params;
        return `${marker}${name}: ${numeral(value[dimensionNames[encode.value[0]]]).format('0,0')} (${percent}%)`;
      },
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      width: 150,
      height: '80%',
    },

  };
  const { data, onEvents, ...rest } = props;
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
