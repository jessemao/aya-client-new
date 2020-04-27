import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class OrderRefundStore extends BaseStore {
  urlPrefix = 'refund';

  @observable captcha = '';

  @action RefundOrder = async (data) => {
    const { orderId, ...rest } = data;
    let res = {};
    try {
      res = await fetch({
        url: `/api/admin/${this.urlPrefix}/${orderId}`,
        method: 'PUT',
        data: rest,
      });
    } catch (error) {
      res = error;
    }
    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }
    this.Search();
    return {
      success: true,
    };
  }


  @action FetchCaptcha = async (phoneNumber, orderId) => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/admin/${this.urlPrefix}/captcha`,
        method: 'GET',
        params: {
          phoneNumber,
          orderId,
        },
      });
    } catch (error) {
      res = error;
    }
    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }

    return {
      success: true,
    };
  }
}

export default new OrderRefundStore();
