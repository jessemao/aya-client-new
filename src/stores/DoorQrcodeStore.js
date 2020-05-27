import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';


configure({ enforceActions: 'always' });

class DoorQrcodeStore extends BaseStore {
  urlPrefix = 'door-qrcode';

  @observable selectedQrcode = {};

  @action FetchQrcodeByReservation = async (reservationId) => {
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: '/api/admin/reservation-record/qrcode',
        params: {
          reservationId,
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
        this.selectedQrcode = {
          qrcodeData: res.data.data.qrcodeData,
        };
      }
    });
  }


  @action FetchQrcodeById = async (accountId, deviceId) => {
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: `/api/admin/${this.urlPrefix}`,
        params: {
          accountId,
          doorDeviceId: deviceId,
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
        this.selectedQrcode = {
          qrcodeData: res.data.data,
        };
      }
    });
  }
}

export default new DoorQrcodeStore();
