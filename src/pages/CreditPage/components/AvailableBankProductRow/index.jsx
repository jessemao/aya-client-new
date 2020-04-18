import React, { useEffect, useState } from 'react';
import {
  Card, Col, Row,
} from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../../stores/hook';
import BarChart from '../BarChart';
import styles from './index.module.less';
import { getDynamicBarSeries } from '../../../../utils';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,

};

export default observer(() => {
  const { CreditStore } = useStores();
  const { datasetForAvailableProduct, datasetForAvailableByBank } = CreditStore;

  const barSeries = getDynamicBarSeries({ encode: { x: 'name', y: 'amount' } });
  console.log(barSeries);
  return (
    <Card
      bordered={false}
      className={styles.cardWrap}
      bodyStyle={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 0,
      }}
    >
      <Row className={styles.availableRow}>
        <Col {...topColResponsiveProps}>
          <BarChart
            title={{ text: '产品可用额度' }}
            dataset={datasetForAvailableProduct}
            series={barSeries}
            color={['#3fb1e3', '#6be6c1', '#cccccc']}
            xAxis={{
              type: 'category',
              axisTick: {
                alignWithLabel: true,
              },
            }}
          />
        </Col>
        <Col {...topColResponsiveProps}>
          <BarChart
            title={{ text: '银行可用额度' }}
            dataset={datasetForAvailableByBank}
            series={barSeries}
            color={['#3fb1e3', '#6be6c1', '#cccccc']}
            xAxis={{
              type: 'category',
              axisTick: {
                alignWithLabel: true,
              },
            }}
          />
        </Col>
      </Row>
    </Card>
  );
});
