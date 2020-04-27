import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class DoorDeviceAccountStore extends BaseStore {
  urlPrefix = 'door-device-account';

  @observable selectedQrcode = {};

  @action FetchQrcodeById = async (accountId, deviceId) => {
    let res = {};
    try {
      res = await fetch({
        method: 'POST',
        url: `/api/admin/${this.urlPrefix}`,
        data: {
          accountId,
          deviceId,
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
        this.selectedQrcode = undefined;
      } else {
        this.selectedQrcode = res.data.data;
      }
    });
  }

  // @observable groupOptions = [];

  // @action onPostItem(res) {
  //   this.itemList = this.itemList.map((item) => {
  //     let temp = item;
  //     if (res.accountId._id === item.accountId._id) {
  //       temp = res;
  //     }
  //     return temp;
  //   });
  // }
}

export default new DoorDeviceAccountStore();
