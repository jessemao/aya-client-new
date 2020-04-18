import React, { useEffect, useState } from 'react';
import {
  Card, Col, Row, Tabs,
} from 'antd';
import { observer } from 'mobx-react';

import TabControl from '../TabControls';
import StackedBarChart from '../StackedBarChart';
import GroupBarChart from '../GroupBarChart';
import PieChart from '../PieChart';
import styles from '../../index.module.less';
import { useStores } from '../../../../stores/hook';
import { PROFIT_TYPE } from '../../../../constants';
import { getDynamicStackGroupBarSeries, getDynamicPieSeries } from '../../../../utils';

const { TabPane } = Tabs;


export default observer(() => {
  const {
    ProfitStore, CurrencyStore, ExportProceedsStore, StructuredStore,
  } = useStores();
  const {
    dateRangeValue,
    selectedDateType,
    profitForStackBar,
    profitForPieChart,
    stackedBarChart,
    legendSelected,
    GetBarSeries,
    GetPieSeries,
    HandleLegendSelectionChange,
  } = ProfitStore;

  const { datasetByProvider, datasetForBar, datasetForPie } = CurrencyStore;
  const { datasetByProvider: datasetByProviderExport, datasetForBar: datasetForBarExport, datasetForPie: datasetForPieExport } = ExportProceedsStore;
  const { datasetByProvider: datasetByProviderStructured, datasetForBar: datasetForBarStructured, datasetForPie: datasetForPieStructured } = StructuredStore;

  useEffect(() => {
    ProfitStore.FetchListByDate({ startDate: dateRangeValue[0], endDate: dateRangeValue[1] });
  }, [dateRangeValue]);

  useEffect(() => {
    CurrencyStore.FetchListByDate({ startDate: dateRangeValue[0], endDate: dateRangeValue[1], dateType: selectedDateType });
  }, [dateRangeValue]);

  useEffect(() => {
    ExportProceedsStore.FetchListByDate({ startDate: dateRangeValue[0], endDate: dateRangeValue[1], dateType: selectedDateType });
  }, [dateRangeValue]);

  useEffect(() => {
    StructuredStore.FetchListByDate({ startDate: dateRangeValue[0], endDate: dateRangeValue[1], dateType: selectedDateType });
  }, [dateRangeValue]);

  const [activeTab, setActiveTab] = useState('total');

  const handleEvents = {
    // legendselectchanged: (val) => {
    //   HandleLegendSelectionChange(val, 'legendSelected');
    // },
  };

  return (
    <Card
      bordered={false}
      className={styles.cardWrap}
      bodyStyle={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <div className={styles.visCard}>
        <Tabs
          size="large"
          onChange={setActiveTab}
          activeKey={activeTab}
          tabBarStyle={{
            marginBottom: 24,
          }}
          tabBarExtraContent={TabControl(ProfitStore)}
        >
          <TabPane
            tab="收益汇总"
            key="total"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visBar}>
                  {
                    stackedBarChart && (
                      <StackedBarChart
                        series={GetBarSeries('stack')}
                        title={{
                          text: '资金理财收益',
                        }}
                        onEvents={handleEvents}
                        legend={{ selected: legendSelected }}
                        dataset={[{ source: profitForStackBar.currencyFormatted }, { source: profitForStackBar.exportProceedsFormatted }, { source: profitForStackBar.structuredFinancingFormatted }]}

                      />
                    )
                  }
                  {
                    !stackedBarChart && (
                      <GroupBarChart
                        title={{
                          text: '资金理财收益',
                        }}
                        series={GetBarSeries()}
                        onEvents={handleEvents}
                        legend={{ selected: legendSelected }}
                        dataset={[{ source: profitForStackBar.currencyFormatted }, { source: profitForStackBar.exportProceedsFormatted }, { source: profitForStackBar.structuredFinancingFormatted }]}
                      />
                    )
                  }
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visPie}>
                  <PieChart
                    id="profit-pie"
                    title={{
                      text: '理财种类',
                    }}
                    onEvents={handleEvents}
                    legend={{ selected: legendSelected }}
                    series={GetPieSeries()}
                    dataset={[{ source: profitForPieChart }]}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={PROFIT_TYPE.currency}
            key="currency"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visBar}>
                  {
                    stackedBarChart && (
                      <StackedBarChart
                        title={{
                          text: '进口购汇细节',
                        }}
                        onEvents={handleEvents}
                        dataset={datasetForBar}
                        series={getDynamicStackGroupBarSeries(datasetByProvider, 'stack')}
                      />
                    )
                  }
                  {
                    !stackedBarChart && (
                      <GroupBarChart
                        title={{
                          text: '进口购汇细节',
                        }}
                        onEvents={handleEvents}
                        dataset={datasetForBar}
                        series={getDynamicStackGroupBarSeries(datasetByProvider)}
                      />
                    )
                  }
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visPie}>
                  <PieChart
                    id="profit-pie"
                    title={{
                      text: '理财种类',
                    }}
                    dataset={datasetForPie}
                    onEvents={handleEvents}
                    series={getDynamicPieSeries({ itemName: 'provider', seriesName: '进口收益' })}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={PROFIT_TYPE.exportProceeds}
            key="export"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visBar}>
                  {
                    stackedBarChart && (
                      <StackedBarChart
                        title={{
                          text: '出口调汇细节',
                        }}
                        onEvents={handleEvents}
                        dataset={datasetForBarExport}
                        series={getDynamicStackGroupBarSeries(datasetByProviderExport, 'stack')}
                      />
                    )
                  }
                  {
                    !stackedBarChart && (
                      <GroupBarChart
                        title={{
                          text: '出口调汇细节',
                        }}
                        onEvents={handleEvents}
                        dataset={datasetForBarExport}
                        series={getDynamicStackGroupBarSeries(datasetByProviderExport)}
                      />
                    )
                  }
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visPie}>
                  <PieChart
                    id="profit-pie"
                    title={{
                      text: '理财种类',
                    }}
                    dataset={datasetForPieExport}
                    onEvents={handleEvents}
                    series={getDynamicPieSeries({ itemName: 'provider', seriesName: '出口调汇' })}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={PROFIT_TYPE.structured}
            key="structured"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visBar}>
                  {
                    stackedBarChart && (
                      <StackedBarChart
                        title={{
                          text: '结构理财细节',
                        }}
                        onEvents={handleEvents}
                        dataset={datasetForBarStructured}
                        series={getDynamicStackGroupBarSeries(datasetByProviderStructured, 'stack')}
                      />
                    )
                  }
                  {
                    !stackedBarChart && (
                      <GroupBarChart
                        title={{
                          text: '结构理财细节',
                        }}
                        onEvents={handleEvents}
                        dataset={datasetForBarStructured}
                        series={getDynamicStackGroupBarSeries(datasetByProviderStructured)}
                      />
                    )
                  }
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.visPie}>
                  <PieChart
                    id="profit-pie"
                    title={{
                      text: '理财种类',
                    }}
                    dataset={datasetForPieStructured}
                    onEvents={handleEvents}
                    series={getDynamicPieSeries({ itemName: 'provider', seriesName: '结构理财' })}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>

        </Tabs>
      </div>
    </Card>
  );
});
