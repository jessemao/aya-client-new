/* eslint-disable no-restricted-globals */
import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import numeral from 'numeral';
import { observer } from 'mobx-react';
import ChartCard from '../../../OverallPage/components/ChartCard';
import Yuan from '../../../OverallPage/components/Yuan';
import PieChart from '../../../OverallPage/components/PieChart';
import { useStores } from '../../../../stores/hook';
import styles from '../../index.module.less';
import { toFixed, getDynamicPieSeries } from '../../../../utils';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};


export default observer(() => {
  const { CreditStore } = useStores();

  const {
    datasetForTotalCredit, creditTotal, reservedTotal, inUseTotal, datasetForInUseCredit, datasetForAvailableByBank, datasetForExpiredLoc, selectedDate,
  } = CreditStore;

  const donutProps = getDynamicPieSeries({
    itemName: 'name',
    seriesName: '余额',
    radius: ['65%', '85%'],
    center: ['50%', '45%'],
    value: 'amount',
    height: 280,
    label: {
      position: 'center',
      show: false,
    },
    avoidLabelOverlap: false,
  });

  const bankPieProps = getDynamicPieSeries({
    itemName: 'name',
    seriesName: '余额',
    center: ['50%', '45%'],
    value: 'amount',
    height: 280,
    label: {
      formatter: (params) => {
        const {
          value, dimensionNames, encode, percent,
        } = params;
        return `${numeral(value[dimensionNames[encode.value[0]]]).format(' a')}`;
      },
      position: 'outer',
      alignTo: 'edge',
      margin: 0,
    },
    avoidLabelOverlap: false,
  });
  useEffect(() => {
    CreditStore.FetchListByDate({ selectedDate });
    CreditStore.FetchExpiredCreditSum({ selectedDate });
  }, [selectedDate]);
  return (
    <Row gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <ChartCard
          className={styles.totalDonuts}
          bordered={false}
          title={(
            <div>
              总额度:
              {' '}
              <Yuan>{creditTotal}</Yuan>
            </div>
          )}
          action={(
            <Tooltip
              title="当前可用授信余额"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          contentHeight={340}
        >
          <div className={styles.donutWrap}>
            <PieChart
              id="credit-pie"
              dataset={datasetForTotalCredit}
              series={donutProps}
              color={['#3fb1e3', '#6be6c1', '#cccccc']}
              legend={
                {
                  orient: 'horizontal',
                  type: 'plain',
                  bottom: 0,
                  width: '100%',
                  top: 'auto',
                  right: 'auto',
                }
              }
            />
            <div className={styles.donutTitle}>
              <div>可使用</div>
              <Yuan>{creditTotal - reservedTotal - inUseTotal}</Yuan>
            </div>
          </div>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          className={styles.totalDonuts}
          bordered={false}
          title={(
            <div>
              已使用额度
            </div>
          )}
          action={(
            <Tooltip
              title="当前已使用授信"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          contentHeight={340}
        >
          <div className={styles.donutWrap}>
            <PieChart
              id="in-use-pie"
              dataset={datasetForInUseCredit}
              series={donutProps}
              color={['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8']}
              legend={
                {
                  orient: 'horizontal',
                  type: 'plain',
                  bottom: 0,
                  width: '100%',
                  top: 'auto',
                  right: 'auto',
                }
              }
            />
            <div className={styles.inUseDonutTitle}>
              <Yuan>{inUseTotal}</Yuan>
            </div>
          </div>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          className={styles.totalDonuts}
          bordered={false}
          title={(
            <div>
              各银行可用余额
            </div>
          )}
          action={(
            <Tooltip
              title="各个银行可用余额"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          contentHeight={340}
        >
          <div className={styles.donutWrap}>
            <PieChart
              id="bank-pie"
              dataset={datasetForAvailableByBank}
              series={bankPieProps}
              color={['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8']}
              legend={
                {
                  orient: 'horizontal',
                  type: 'plain',
                  bottom: 0,
                  width: '100%',
                  top: 'auto',
                  right: 'auto',
                }
              }
            />

          </div>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          className={styles.totalDonuts}
          bordered={false}
          title={(
            <div>
              超期账款
            </div>
          )}
          action={(
            <Tooltip
              title="超期账款"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          contentHeight={340}
        >
          <div className={styles.donutWrap}>
            <PieChart
              id="expire-pie"
              dataset={datasetForExpiredLoc}
              series={bankPieProps}
              color={['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8']}
              legend={
                {
                  orient: 'horizontal',
                  type: 'plain',
                  bottom: 0,
                  width: '100%',
                  top: 'auto',
                  right: 'auto',
                }
              }
            />

          </div>
        </ChartCard>
      </Col>

    </Row>
  );
});
