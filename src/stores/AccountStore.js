import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import LoginStore from './LoginStore';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';
import { ACCOUNT_ROLE } from '../constants/status';

configure({ enforceActions: 'always' });


class AccoutStore extends BaseStore {
  urlPrefix = 'account';

  @observable currentUser = {
    fullname: 'mao',
    role: ACCOUNT_ROLE.GUEST,
  };

  @observable hasGetInfo = false;

  @action UpdateListWithNewItem(newItem) {
    this.itemList = this.itemList.map((item) => {
      if (item._id === newItem._id) {
        return newItem;
      }
      return item;
    });
  }

  @action UpdateAccount = (currentUser) => {
    this.currentUser = currentUser;
  }

  @action GetUserInfo = async () => {
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: '/api/login-status',
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }
    runInAction(() => {
      this.hasGetInfo = true;
      if (res.status !== 200 || !res.data.success) {
        LoginStore.UpdateLogin(false);
      } else if (res.data.success) {
        LoginStore.UpdateLogin(true);
        // LoginStore.checkUserAccess(res.data.data);
        this.currentUser = res.data.data;
      }
    });
  }

  @action ResetPassword = async ({ accountId, password }) => {
    let res = {};
    try {
      res = await fetch({
        method: 'PUT',
        url: '/api/reset-password',
        data: {
          accountId,
          password,
        },
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }
    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res);
      } else if (res.data.success) {
        asyncFeedback.success('Success!');
        // this.selectedItem = res.data.data;
      }
    });
  }
}

export default new AccoutStore();
