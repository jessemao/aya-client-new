import {
  observable, action, configure, runInAction, computed,
} from 'mobx';
import fetch from 'axios';
import moment from 'moment';
// import LoginStore from './LoginStore';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';
import { toFixed, getDynamicPieSeries } from '../utils';
import { PROFIT_TYPE } from '../constants';
// import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class ProfitStore extends BaseStore {
  urlPrefix = 'profit';

  @observable overallProfit = [];

  @observable currencyProfit = [];

  @observable exportProceedsProfit = [];

  @observable structuredFinancingProfit = [];

  @observable selectedDateType = 'year';

  @observable legendSelected = {};

  @observable currencyLegendSelected = {};

  @observable dateRangeValue = [moment().startOf('year'), moment().endOf('year')];

  @observable stackedBarChart = true;

  @observable summary = {
    yearly: { currentTotal: 0 },
    monthly: { currentTotal: 0 },
    weekly: { currentTotal: 0 },
  };

  @observable yearlyTarget = 50000000;

  @action UpdateActiveDateType = (type) => {
    this.selectedDateType = type;
  }

  @action HandleChangeBarChartType = (val) => {
    this.stackedBarChart = val;
  }

  @action HandleRangePickerChange = (val) => {
    let startType = this.selectedDateType;
    if (this.selectedDateType === 'week') {
      startType = 'day';
    }

    if (this.dateRangeValue[0].isSame(moment(val[0]).startOf(startType)) && this.dateRangeValue[1].isSame(moment(val[1]).endOf(startType))) {
      return;
    }

    this.dateRangeValue = [moment(val[0]).startOf(startType), moment(val[1]).endOf(startType)];
  }

  formatProfit(list) {
    return list.map((item) => ({
      ...item,
      profit: toFixed(item.profit),
    }));
  }

  @computed get profitForStackBar() {
    const currencyFormatted = this.formatProfit(this.currencyProfit);
    const exportProceedsFormatted = this.formatProfit(this.exportProceedsProfit);
    const structuredFinancingFormatted = this.formatProfit(this.structuredFinancingProfit);

    return {
      currencyFormatted,
      exportProceedsFormatted,
      structuredFinancingFormatted,
    };
  }

  @computed get profitForPieChart() {
    const currencyFormatted = this.currencyProfit.length ? this.currencyProfit : [{ name: '进口购汇', profit: 0 }];
    const exportFormatted = this.exportProceedsProfit.length ? this.exportProceedsProfit : [{ name: '出口调汇', profit: 0 }];
    const structuredFormatted = this.structuredFinancingProfit.length ? this.structuredFinancingProfit : [{ name: '结构理财', profit: 0 }];

    return [currencyFormatted, exportFormatted, structuredFormatted].map((list) => list.reduce((a, b) => ({
      ...b,
      profit: toFixed(a.profit + b.profit),
    }), { profit: 0 }));
  }

  GetPieSeries = () => getDynamicPieSeries({ itemName: 'name', seriesName: '收益' })

  GetBarSeries(type) {
    return Object.values(PROFIT_TYPE).map((val, index) => {
      const item = {
        name: val,
        type: 'bar',
        encode: {
          x: 'startDate',
          y: 'profit',
        },
        datasetIndex: index,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      };
      if (type === 'stack') {
        return {
          ...item,
          stack: true,
        };
      }
      return item;
    });
  }

  @action FetchListByDate = async ({ startDate, endDate }) => {
    if (!(startDate || endDate)) {
      return asyncFeedback.fail('必须选择开始 - 结束时间进行查询');
    }

    let res = {};

    try {
      res = await fetch({
        url: `/api/${this.urlPrefix}`,
        method: 'GET',
        params: {
          startDate,
          endDate,
          dateType: this.selectedDateType,
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
      this.currencyProfit = res.data.data.currencyProfit;
      this.exportProceedsProfit = res.data.data.exportProceedsProfit;
      this.structuredFinancingProfit = res.data.data.structuredFinancingProfit;
    });
  }

  @action FetchSummary = async () => {
    let res = {};

    try {
      res = await fetch({
        url: `/api/${this.urlPrefix}/summary`,
        method: 'GET',
      });
    } catch (error) {
      res = error;
    }

    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }

    runInAction(() => {
      this.summary = res.data.data;
    });
  }

  @action HandleLegendSelectionChange = (val, type) => {
    this[type] = val.selected;
    // console.log(val);
  }
}

export default new ProfitStore();
