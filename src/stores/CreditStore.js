import {
  observable, action, configure, runInAction, computed,
} from 'mobx';
import fetch from 'axios';
import moment from 'moment';
// import LoginStore from './LoginStore';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';
import { toFixed, getDynamicPieSeries } from '../utils';
// import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class CreditStore extends BaseStore {
  urlPrefix = 'credit';

  @observable creditList = [];

  @observable paidExpiredLocSum = [];

  @observable unpaidExpiredLocSum = [];

  @observable paidExpiredLocDetail = [];

  @observable unpaidExpiredLocDetail = [];

  @observable selectedDate = moment().startOf('day');

  @observable searchQuery = {};

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

  @computed get inUseTotal() {
    const inUseTotal = this.creditList.map((item) => {
      const {
        amountInUseLoc, amountInUseStandbyLoc, amountInUseTTCurrencyExchange, amountInUseFloatingLoan, amountInUseGuaranty,
      } = item;
      return amountInUseGuaranty + amountInUseFloatingLoan + amountInUseLoc + amountInUseStandbyLoc + amountInUseTTCurrencyExchange;
    }).reduce((a, b) => a + b, 0);
    return inUseTotal;
  }

  @computed get inUseByCategory() {
    const inUseGuaranty = this.creditList.map((item) => item.amountInUseGuaranty).reduce((a, b) => a + b, 0);
    const inUseFloatingLoan = this.creditList.map((item) => item.amountInUseFloatingLoan).reduce((a, b) => a + b, 0);
    const inUseLoc = this.creditList.map((item) => item.amountInUseLoc).reduce((a, b) => a + b, 0);
    const inUseStandbyLoc = this.creditList.map((item) => item.amountInUseStandbyLoc).reduce((a, b) => a + b, 0);
    const inUseTTCurrencyExchange = this.creditList.map((item) => item.amountInUseTTCurrencyExchange).reduce((a, b) => a + b, 0);
    return {
      inUseGuaranty,
      inUseFloatingLoan,
      inUseLoc,
      inUseStandbyLoc,
      inUseTTCurrencyExchange,
    };
  }

  @computed get totalByCategory() {
    const totalGuaranty = this.creditList.map((item) => item.amountTotalGuaranty).reduce((a, b) => a + b, 0);
    const totalFloatingLoan = this.creditList.map((item) => item.amountTotalFloatingLoan).reduce((a, b) => a + b, 0);
    const totalLoc = this.creditList.map((item) => item.amountTotalLoc).reduce((a, b) => a + b, 0);
    const totalStandbyLoc = this.creditList.map((item) => item.amountTotalStandbyLoc).reduce((a, b) => a + b, 0);
    const totalTTCurrencyExchange = this.creditList.map((item) => item.amountTotalTTCurrencyExchange).reduce((a, b) => a + b, 0);
    return {
      totalGuaranty,
      totalFloatingLoan,
      totalLoc,
      totalStandbyLoc,
      totalTTCurrencyExchange,
    };
  }


  @computed get creditTotal() {
    const total = this.creditList.map((item) => item.amountTotal).reduce((a, b) => a + b, 0) || 1;
    return total;
  }

  @computed get reservedTotal() {
    const reservedTotal = this.creditList.map((item) => item.amountTotalReserved).reduce((a, b) => a + b, 0);
    return reservedTotal;
  }

  @computed get paidExpiredCount() {
    return this.paidExpiredLocDetail.length;
  }

  @computed get unpaidExpiredCount() {
    return this.unpaidExpiredLocDetail.length;
  }

  @computed get paidExpiredSum() {
    return this.paidExpiredLocSum.map((item) => item.amountTotal).reduce((a, b) => a + b, 0);
  }

  @computed get unpaidExpiredSum() {
    return this.unpaidExpiredLocSum.map((item) => item.amountTotal).reduce((a, b) => a + b, 0);
  }

  @computed get datasetForTotalCredit() {
    return [{
      source: [
        {
          name: '可用额度',
          amount: this.creditTotal - this.reservedTotal - this.inUseTotal,
        },
        {
          name: '已用额度',
          amount: this.inUseTotal,
        },
        {
          name: '不可使用',
          amount: this.reservedTotal,
        },
      ],
    }];
  }

  @computed get datasetForInUseCredit() {
    const {
      inUseFloatingLoan, inUseGuaranty, inUseLoc, inUseStandbyLoc, inUseTTCurrencyExchange,
    } = this.inUseByCategory;
    return [{
      source: [
        {
          name: '流贷',
          amount: inUseFloatingLoan,
        },
        {
          name: '保函',
          amount: inUseGuaranty,
        },
        {
          name: '信用证',
          amount: inUseLoc,
        },
        {
          name: '备付信用证',
          amount: inUseStandbyLoc,
        },
        {
          name: 'TT押汇',
          amount: inUseTTCurrencyExchange,
        },
      ],
    }];
  }

  @computed get datasetForAvailableByBank() {
    const inUseByBank = this.creditList.map((item) => ({
      name: item._id,
      amount: item.amountTotal - item.amountTotalReserved - item.amountInUseFloatingLoan - item.amountInUseGuaranty - item.amountInUseLoc - item.amountInUseStandbyLoc - item.amountInUseTTCurrencyExchange,
    }));
    return [
      { source: inUseByBank },
    ];
  }

  @computed get datasetForExpiredLoc() {
    return [
      {
        source: [
          {
            name: '超期未收款',
            amount: this.unpaidExpiredSum,
          },
          {
            name: '超期已收款',
            amount: this.paidExpiredSum,
          },
        ],
      },
    ];
  }

  @computed get datasetForAvailableProduct() {
    const {
      inUseFloatingLoan, inUseGuaranty, inUseLoc, inUseStandbyLoc, inUseTTCurrencyExchange,
    } = this.inUseByCategory;
    const {
      totalFloatingLoan, totalGuaranty, totalLoc, totalStandbyLoc, totalTTCurrencyExchange,
    } = this.totalByCategory;
    return [{
      source: [
        {
          name: '流贷',
          amount: totalFloatingLoan - inUseFloatingLoan,
        },
        {
          name: '保函',
          amount: totalGuaranty - inUseGuaranty,
        },
        {
          name: '信用证',
          amount: totalLoc - inUseLoc,
        },
        {
          name: '备付信用证',
          amount: totalStandbyLoc - inUseStandbyLoc,
        },
        {
          name: 'TT押汇',
          amount: totalTTCurrencyExchange - inUseTTCurrencyExchange,
        },
      ],
    }];
  }

  @action UpdateSelectedDate = (dateType, isNext) => {
    if (isNext) {
      this.selectedDate = moment(this.selectedDate.add(1, `${dateType}s`));
    } else {
      this.selectedDate = moment(this.selectedDate.subtract(1, `${dateType}s`));
    }
  }

  @action SetSelectedDate = (val) => {
    this.selectedDate = val;
  }

  @action FetchExpiredCreditSum = async ({ selectedDate = new Date() } = {}) => {
    if (!selectedDate) {
      return asyncFeedback.fail('必须选择开始 - 结束时间进行查询');
    }

    let res = {};
    try {
      res = await fetch({
        url: '/api/loc/expire/summary',
        method: 'GET',
        params: {
          startDate: selectedDate,
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
      this.paidExpiredLocSum = res.data.data.paid;
      this.unpaidExpiredLocSum = res.data.data.unpaid;
    });
  }

  @action FetchExpiredCreditDetail = async ({ selectedDate = new Date() } = {}) => {
    if (!selectedDate) {
      return asyncFeedback.fail('必须选择开始 - 结束时间进行查询');
    }

    let res = {};
    try {
      res = await fetch({
        url: '/api/loc/expire/detail',
        method: 'GET',
        params: {
          startDate: selectedDate,
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
      this.paidExpiredLocDetail = res.data.data.paid;
      this.unpaidExpiredLocDetail = res.data.data.unpaid;
    });
  }


  @action FetchListByDate = async ({ selectedDate = new Date() } = {}) => {
    if (!selectedDate) {
      return asyncFeedback.fail('必须选择开始 - 结束时间进行查询');
    }

    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.urlPrefix}/total-in-use`,
        method: 'GET',
        params: {
          startDate: selectedDate,
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
      this.creditList = res.data.data;
    });
  }
}

export default new CreditStore();
