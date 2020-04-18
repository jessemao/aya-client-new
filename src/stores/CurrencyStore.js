import {
  observable, action, configure, runInAction, computed,
} from 'mobx';
import fetch from 'axios';

// import LoginStore from './LoginStore';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';
import { toFixed } from '../utils';
// import asyncFeedback from '../components/basic/async-feedback';
// import { toFixed } from '../utils';
// import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class CurrencyStore extends BaseStore {
  urlPrefix = 'currency-exchange';

  @observable datasetByProvider = {};

  @computed get datasetForBar() {
    return Object.values(this.datasetByProvider).map((list) => ({
      source: list.map((item) => ({
        ...item,
        profit: toFixed(item.profit),
      })),
    }));
  }

  @computed get datasetForPie() {
    const newList = Object.values(this.datasetByProvider).map((list) => list.reduce((a, b) => ({
      provider: b.provider,
      profit: toFixed(a.profit + b.profit),
    }), { profit: 0 }));
    return [
      { source: newList },
    ];
  }

  @action FetchListByDate = async ({ startDate, endDate, dateType }) => {
    if (!(startDate || endDate)) {
      return asyncFeedback.fail('必须选择开始 - 结束时间进行查询');
    }

    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.urlPrefix}/profit-summary`,
        method: 'GET',
        params: {
          startDate,
          endDate,
          dateType,
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
      this.datasetByProvider = res.data.data;
    });
  }
}

export default new CurrencyStore();
