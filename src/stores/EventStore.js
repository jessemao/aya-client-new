import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';

import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class EventStore extends BaseStore {
  urlPrefix = 'event';

  @observable reorderList = [];

  @action PostListOrder = async (list) => {
    let res = {};

    try {
      res = await fetch({
        url: '/api/admin/event/sort-list',
        method: 'POST',
        data: {
          list,
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
      this.reorderList = res.data.data;
    });
  }

  @action FetchItemForReorder = async () => {
    let res = {};
    try {
      res = await fetch({
        url: '/api/admin/event/sort-list',
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
      this.reorderList = res.data.data;
    });
    return res;
  }
}

export default new EventStore();
