import {
  observable, action, configure, runInAction, computed,
} from 'mobx';
import fetch from 'axios';

// import LoginStore from './LoginStore';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';
import { toFixed } from '../utils';
// import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class BalanceStore extends BaseStore {
  urlPrefix = 'transaction';

  @observable receivedBalanceList = [];

  @observable receivableBalanceList = [];

  @computed get currentBalance() {
    if (!this.receivedBalanceList.length) {
      return 0;
    }
    return this.receivedBalanceList[this.receivedBalanceList.length - 1].balance;
  }

  @computed get balanceOverDue() {
    if (!this.receivableBalanceList.length) {
      return 0;
    }
    return this.receivableBalanceList[0].balanceOverDue;
  }

  @computed get datasetForLine() {
    return [this.receivedBalanceList, this.receivableBalanceList].map((list) => ({
      source: list.map((item) => ({
        ...item,
        balance: toFixed(item.balance),
      })),
    }));
  }

  @computed get lineSeries() {
    return [this.receivedBalanceList, this.receivableBalanceList].map((list, index) => ({
      name: index === 0 ? '到账余额' : '余额预测',
      type: 'line',
      encode: {
        x: '_id',
        y: 'balance',
      },
      datasetIndex: index,
      label: {
        position: [10, 10],
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }));
  }

  @action FetchListByDate = async ({ startDate, endDate }) => {
    if (!(startDate || endDate)) {
      return asyncFeedback.fail('必须选择开始 - 结束时间进行查询');
    }

    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.urlPrefix}/balance`,
        method: 'GET',
        params: {
          startDate,
          endDate,
        },
      });
    } catch (error) {
      res = error;
    }

    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }

    runInAction(() => {
      this.receivableBalanceList = res.data.data.receivableBalanceList;
      this.receivedBalanceList = res.data.data.receivedBalanceList;
    });
  }
}

export default new BalanceStore();
