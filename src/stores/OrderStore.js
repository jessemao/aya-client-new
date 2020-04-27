import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class OrderStore extends BaseStore {
  urlPrefix = 'order';

  refundUrlPrefix = 'admin/refund';

  @observable refundableFee = {};

  @observable refundCaptcha = '';

  @observable refundingOrder = {};

  @action GetRefundableFee = async (orderId) => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.refundUrlPrefix}/calc/${orderId}`,
        method: 'GET',
      });
    } catch (e) {
      res = e;
    }
    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }
    runInAction(() => {
      this.refundableFee = res.data.data;
    });
    return res.data.data;
  }

  @action InitRefund = async (orderId) => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.refundUrlPrefix}/init/${orderId}`,
        method: 'PUT',
      });
    } catch (e) {
      res = e;
    }
    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }
    runInAction(() => {
      this.refundingOrder = res.data.data;
    });
    return res.data.data;
  }


  @action RefundOrder = async (data) => {
    const { orderId } = this.refundingOrder;
    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.refundUrlPrefix}/${orderId}`,
        method: 'PUT',
        data,
      });
    } catch (e) {
      res = e;
    }

    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }
    runInAction(() => {
      this.refundingOrder = res.data.data;
    });
    return res.data.data;
  }


  @action FetchRefundingInfo = async (orderId) => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.refundUrlPrefix}/${orderId}`,
        method: 'GET',
      });
    } catch (e) {
      res = e;
    }

    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }
    runInAction(() => {
      this.refundingOrder = res.data.data;
      this.refundableFee = {
        deposit: res.data.data.refundDeposit,
        subtotal: res.data.data.refundSubtotal,
        total: res.data.data.refundTotal,
      };
    });
    return res.data.data;
  }

  @action RequestRefundCaptcha = async (orderId) => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/${this.refundUrlPrefix}/captcha`,
        method: 'GET',
        params: {
          orderId,
        },
      });
    } catch (e) {
      res = e;
    }
    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }
    runInAction(() => {
      this.refundCaptcha = res.data.data;
    });
    return res.data.data;
  }
}

export default new OrderStore();
