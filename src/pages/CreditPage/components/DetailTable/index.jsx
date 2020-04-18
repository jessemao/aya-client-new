import React, { useEffect } from 'react';
import numeral from 'numeral';
import { observer } from 'mobx-react';
import { useStores } from '../../../../stores/hook';
import styles from '../../index.module.less';
import {
  LOC_EXPIRE_MAP,
} from '../../../../constants/index';
import { toFixed } from '../../../../utils';
import StandardTable from '../../../../components/StandardTable';


function getColumnProps(titleMap, ignoreKeyList, sortList) {
  return Object.keys(titleMap).filter((key) => !ignoreKeyList.includes(key)).map((key) => {
    if (!titleMap[key]) {
      return null;
    }
    let sorter = null;
    if (sortList && sortList.includes(key)) {
      sorter = {
        compare: (a, b) => a[key] - b[key],

      };
    }
    return {
      key,
      dataIndex: key,
      title: titleMap[key],
      render(val) {
        if (typeof val === 'number') {
          return numeral(toFixed(val)).format('0,0');
        }
        return val;
      },
      sorter,
      // fixed: fixedColumnKeyList && fixedColumnKeyList.includes(key),
    };
  }).filter((itmKey) => !!itmKey);
}

export default observer(() => {
  const {
    CreditStore,
  } = useStores();
  const { paidExpiredLocDetail, unpaidExpiredLocDetail } = CreditStore;
  const ignoreKeyList = ['_id', 'createdAt', 'updatedAt', '__v', 'index'];
  const sortList = ['dateOfExpire', 'amountTotal', 'expireDay', 'dateOfPayment'];
  const expireColumns = getColumnProps(LOC_EXPIRE_MAP, ignoreKeyList, sortList);

  const expireList = paidExpiredLocDetail.concat(unpaidExpiredLocDetail);

  return (
    <StandardTable
      columns={expireColumns}
      size="middle"
      rowKey="_id"
      data={expireList}
      scroll={{ x: true }}
      pagination={{
        showSizeChanger: false,
      }}
    />
  );
});
