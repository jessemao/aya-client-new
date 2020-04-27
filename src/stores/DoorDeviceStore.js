import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import asyncFeedback from '../components/basic/async-feedback';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class DoorDeviceStore extends BaseStore {
  urlPrefix = 'door-device';

  @observable statusOptions = [];

  @observable deviceList = [];

  @action FetchOptions = async () => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/admin/${this.urlPrefix}/option`,
        method: 'GET',
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.deviceList = res.data.data;
      }
    });
  }

  @action FetchAllByGroupId = async (groupId, { withPagination = true } = {}) => {
    let res = {};
    let params = {
      groupId,
    };
    const { currentPage = 1, pageSize = 20 } = this;

    if (withPagination) {
      params = {
        ...params,
        pagination: {
          currentPage,
          pageSize,
        },
      };
    }

    try {
      res = await fetch({
        url: '/api/admin/door-device/group',
        method: 'GET',
        params,
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        const tempData = res.data.data;
        this.updateTableList(tempData);
        if (this.onFetchItemList) {
          this.onFetchItemList(tempData);
        }
      }
    });
  }


  @action FetchStatusOption = async () => {
    let res = {};

    try {
      res = await fetch({
        url: '/api/admin/door-device/status-option',
        method: 'GET',
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.SetAttributeByName('statusOptions', res.data.data);
      }
    });
  }

  @action Search = async (query) => {
    const newQuery = {};
    Object.keys(query).forEach((key) => {
      if (query[key]) {
        newQuery[key] = query[key];
      }
    });
    this.FetchItemList(newQuery, { urlPrefix: 'door-device/search', shouldRedirect: false });
  }
}

export default new DoorDeviceStore();
