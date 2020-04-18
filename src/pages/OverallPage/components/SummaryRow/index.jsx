/* eslint-disable no-restricted-globals */
import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import ChartCard from '../ChartCard';
import Yuan from '../Yuan';
import Trend from '../Trend';
import { useStores } from '../../../../stores/hook';
import styles from '../../index.module.less';
import { toFixed } from '../../../../utils';

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
  const { ProfitStore } = useStores();
  const { summary, yearlyTarget } = ProfitStore;
  const { yearly, monthly, weekly } = summary;
  useEffect(() => {
    ProfitStore.FetchSummary();
  }, []);

  const profitDiff = yearlyTarget - yearly.currentTotal;
  let yearlyFlag = '';
  let monthlyFlag = '';
  let weeklyFlag = '';
  let diffFlag = '';
  if (!(!yearly.gain || isNaN(yearly.gain))) {
    yearlyFlag = yearly.gain > 0 ? 'up' : 'down';
  }
  if (!(!monthly.gain || isNaN(monthly.gain))) {
    monthlyFlag = monthly.gain > 0 ? 'up' : 'down';
  }
  if (!(!weekly.gain || isNaN(weekly.gain))) {
    weeklyFlag = weekly.gain > 0 ? 'up' : 'down';
  }

  diffFlag = profitDiff < 0 ? 'up' : 'down';

  return (
    <Row gutter={24} type="flex">

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="周营收"
          action={(
            <Tooltip
              title="周营收: 当前周营收总数"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          total={() => <Yuan>{weekly.currentTotal}</Yuan>}
          footer={(
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend flag={weeklyFlag}>
                <span style={{ marginRight: 5 }}>上周营收</span>
                <Yuan>{weekly.lastTotal}</Yuan>
                <span style={{ marginLeft: 10 }}>同比</span>
                <span className={styles.trendText}>
                  {weekly.gain * 100}
                  %
                </span>
              </Trend>
            </div>
        )}
          contentHeight={46}
        />
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="月营收"
          action={(
            <Tooltip
              title="月营收: 当前月度营收总数"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          total={() => <Yuan>{monthly.currentTotal}</Yuan>}
          footer={(
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend flag={monthlyFlag}>
                <span style={{ marginRight: 5 }}>上月营收</span>
                <Yuan>{monthly.lastTotal}</Yuan>
                <span style={{ marginLeft: 10 }}>同比</span>
                <span className={styles.trendText}>
                  {monthly.gain * 100}
                  %
                </span>
              </Trend>
            </div>
          )}
          contentHeight={46}
        />
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="年营收"
          action={(
            <Tooltip
              title="年营收: 当前年营收总数"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          total={() => <Yuan>{yearly.currentTotal}</Yuan>}
          footer={(
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend flag={yearlyFlag}>
                <span style={{ marginRight: 5 }}>去年营收</span>
                <Yuan>{yearly.lastTotal}</Yuan>
                <span style={{ marginLeft: 10 }}>同比</span>
                <span className={styles.trendText}>
                  {yearly.gain * 100}
                  %
                </span>
              </Trend>
            </div>
        )}
          contentHeight={46}
        />
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="全年目标"
          action={(
            <Tooltip
              title="全年目标 - 未达标会用红色标记，达标后会变成绿色"
            >
              <InfoCircleOutlined />
            </Tooltip>
          )}
          total={
            <Yuan>{yearlyTarget}</Yuan>
          }
          footer={(
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend flag={diffFlag}>
                <span style={{ marginRight: 5 }}>差值</span>
                <Yuan className={profitDiff >= 0 ? styles.redText : styles.greenText}>{Math.abs(profitDiff)}</Yuan>
                <span style={{ marginLeft: 10 }}>百分比</span>
                <span className={profitDiff >= 0 ? styles.redText : styles.greenText} style={{ marginLeft: 8 }}>
                  {Math.abs(toFixed(profitDiff / yearlyTarget, 4)) * 100}
                  %
                </span>
              </Trend>
            </div>
          )}
          contentHeight={46}
        />
      </Col>
    </Row>
  );
});
