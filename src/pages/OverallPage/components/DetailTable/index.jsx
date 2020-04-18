import React, { useEffect, useState } from 'react';
import {
  Card, Tabs,
} from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../../stores/hook';
import styles from '../../index.module.less';
import {
  CURRENCY_MAP, PROFIT_TYPE, STRUCTURED_MAP, EXPORTPROCEEDS_MAP,
} from '../../../../constants/index';
import CommonListPage from '../../../common/CommonListPage';

const { TabPane } = Tabs;

function getColumnProps(item, titleMap, ignoreKeyList, fixedColumnKeyList) {
  if (!item) {
    return null;
  }
  return Object.keys(item).filter((key) => !ignoreKeyList.includes(key)).map((key) => ({
    key,
    dataIndex: key,
    title: titleMap[key],
    fixed: fixedColumnKeyList && fixedColumnKeyList.includes(key),
  }));
}

export default observer(() => {
  const {
    CurrencyStore, ProfitStore, ExportProceedsStore, StructuredStore,
  } = useStores();
  const { itemList: currencyList, pageSize: currencyPageSize, currentPage: currencyCurrentPage } = CurrencyStore;
  const { itemList: exportProceedsList, pageSize: exportPageSize, currentPage: exportCurrentPage } = ExportProceedsStore;
  const { itemList: structuredList, pageSize: structuredPageSize, currentPage: structuredCurrentPage } = StructuredStore;
  const { dateRangeValue } = ProfitStore;
  const ignoreKeyList = ['_id', 'createdAt', 'updatedAt', '__v', 'index', 'settlementProfit'];
  const currencyFixedColumnKeyList = ['bank', 'rateAdjustedDate'];
  const exportProceedsFixedColumnKeyList = ['customer', 'exportDate'];
  const currencyColumns = getColumnProps(currencyList[0], CURRENCY_MAP, ignoreKeyList, currencyFixedColumnKeyList);
  const exportProceedsColumns = getColumnProps(exportProceedsList[0], EXPORTPROCEEDS_MAP, ignoreKeyList, exportProceedsFixedColumnKeyList);
  const structuredColumns = getColumnProps(structuredList[0], STRUCTURED_MAP, ignoreKeyList);

  const [activeTab, setActiveTab] = useState('currency');

  useEffect(() => {
    CurrencyStore.FetchItemList({ rateAdjustedDate: { startDate: dateRangeValue[0], endDate: dateRangeValue[1] } });
  }, [dateRangeValue, currencyCurrentPage, currencyPageSize]);

  useEffect(() => {
    ExportProceedsStore.FetchItemList({ rateAdjustedDate: { startDate: dateRangeValue[0], endDate: dateRangeValue[1] } });
  }, [dateRangeValue, exportCurrentPage, exportPageSize]);

  useEffect(() => {
    StructuredStore.FetchItemList({ date: { startDate: dateRangeValue[0], endDate: dateRangeValue[1] } });
  }, [dateRangeValue, structuredCurrentPage, structuredPageSize]);

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
      <div className={styles.detailTable}>
        <Tabs
          size="large"
          onChange={setActiveTab}
          activeKey={activeTab}
          tabBarStyle={{
            marginBottom: 24,
          }}
        >
          <TabPane
            tab={PROFIT_TYPE.currency}
            key="currency"
          >
            <CommonListPage
              columns={currencyColumns}
              store={CurrencyStore}
              size="middle"
              scroll={{ x: true }}
            />
          </TabPane>
          <TabPane
            tab={PROFIT_TYPE.exportProceeds}
            key="exportProceeds"
          >
            <CommonListPage
              columns={exportProceedsColumns}
              store={ExportProceedsStore}
              size="middle"
              scroll={{ x: true }}
            />
          </TabPane>
          <TabPane
            tab={PROFIT_TYPE.structured}
            key="structured"
          >
            <CommonListPage
              columns={structuredColumns}
              store={StructuredStore}
              size="middle"
              scroll={{ x: true }}
            />
          </TabPane>
        </Tabs>

      </div>
    </Card>
  );
});
