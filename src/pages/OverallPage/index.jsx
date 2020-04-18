import React from 'react';
import { observer } from 'mobx-react';
import VisualizationCard from './components/VisualizationCard';
// import DetailTable from './components/DetailTable';
import SummaryRow from './components/SummaryRow';
import styles from './index.module.less';


export default observer(() => (
  <div className={styles.overallPage}>
    <SummaryRow />
    <VisualizationCard />
  </div>
));
