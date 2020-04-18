import React, { useEffect, useState } from 'react';
import {
  Card, Row,
} from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../../stores/hook';
import ScoreCard from '../ScoreCard';
import DetailTable from '../DetailTable';
import styles from './index.module.less';
import Yuan from '../../../OverallPage/components/Yuan';

export default observer(() => {
  const { CreditStore } = useStores();
  const {
    paidExpiredCount, unpaidExpiredCount, paidExpiredSum, unpaidExpiredSum, selectedDate,
  } = CreditStore;
  useEffect(() => {
    CreditStore.FetchExpiredCreditDetail({ selectedDate });
  }, [selectedDate]);
  return (
    <Card
      bordered={false}
      className={styles.cardWrap}
      bodyStyle={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <Row className={styles.expireRow}>
        <div className={styles.infoCardCol}>
          <ScoreCard
            title="未支付超期单数"
            content={unpaidExpiredCount}
            footer={(
              <div>
                超期金额:
                <Yuan>{unpaidExpiredSum}</Yuan>
              </div>
            )}
          />
          <ScoreCard
            title="已支付超期单数"
            content={paidExpiredCount}
            footer={(
              <div>
                超期金额:
                <Yuan>{paidExpiredSum}</Yuan>
              </div>
            )}
          />
        </div>
        <div className={styles.tableCol}>
          <DetailTable />
        </div>
      </Row>
    </Card>
  );
});
