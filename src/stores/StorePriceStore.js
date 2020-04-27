import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';

import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class StorePriceStore extends BaseStore {
  urlPrefix = 'store-price';

  @observable typeByMember = [];

  @observable typeByTime = [];

  @action FetchTypeOption = async (typeString) => {
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: `/api/admin/${this.urlPrefix}/${typeString}`,
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.SetAttributeByName(typeString, res.data.data);
      }
    });
  }
}

export default new StorePriceStore();
