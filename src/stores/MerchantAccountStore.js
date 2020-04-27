import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';

import asyncFeedback from '../components/basic/async-feedback';

import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class MerchantAccountStore extends BaseStore {
  urlPrefix = 'merchant-account'

  @observable storeOptions = [];

  onFetchItem = (data) => {
    if (Array.isArray(data)) {
      if (data.length) {
        this.selectedItem = data[0];
      } else {
        this.selectedItem = null;
      }
    } else {
      this.selectedItem = data;
    }
    if (!this.selectedItem) {
      return;
    }
    const { merchantId } = this.selectedItem;
    let id = '';
    if (merchantId._id) {
      id = merchantId._id;
    } else {
      id = merchantId;
    }
    this.FetchStoreOption({ merchantId: id });
  }

  @action SetSelectedItemByFilter = (query) => {
    this.selectedItem = this.itemListFlat.find((item) => {
      let isFind = true;
      Object.keys(query).forEach((key) => {
        if (item[key] !== query[key]) {
          isFind = false;
        }
      });
      return isFind;
    });
    if (!(this.selectedItem && this.selectedItem._id)) {
      this.FetchItemByQuery(query);
    }
  }


  @action FetchStoreOption = async (query) => {
    let res = {};

    try {
      res = await fetch({
        method: 'GET',
        url: '/api/admin/store/option',
        params: query,
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.storeOptions = res.data.data;
      }
    });
  }
}

export default new MerchantAccountStore();
