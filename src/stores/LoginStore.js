import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import AccountStore from './AccountStore';
import asyncFeedback from '../components/basic/async-feedback';
import GlobalStore from './GlobalStore';
import { ACCOUNT_ROLE } from '../constants/status';

configure({ enforceActions: 'always' });

class LoginStore {
  @observable loginName = '';

  @observable password = '';

  @observable shouldRedirect = false;

  @observable submitting = false;

  @observable isLogin = false;

  @observable displayLoginPopup = false;

  @observable hasRoleAccess = true;

  @action toggleLoginPopup = (visible) => {
    this.displayLoginPopup = visible;
  }

  @action checkUserAccess = (user) => {
    this.hasRoleAccess = user.role <= ACCOUNT_ROLE.PLATFORM;
  }

  @action changeValue = (value, field) => {
    if (field.loginName) {
      this.loginName = field.loginName.value;
    } else if (field.password) {
      this.password = field.password.value;
    }
  }

  @action UpdateLogin = (status) => {
    this.isLogin = status;
  }

  @action UpdateRedirect = (status) => {
    this.shouldRedirect = status;
  }

  @action HandleAuthLogin = async () => {
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: '/wechat/login',
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }
    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = res.response.data.message || res.message || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.shouldRedirect = true;
        this.isLogin = true;
        AccountStore.UpdateAccount(res.data.data.user);
      }
    });
  }

  @action HandleGetSMSCode = async (phoneNumber) => {
    let res = {};
    this.submitting = true;
    try {
      res = await fetch({
        method: 'GET',
        url: '/api/send-sms/login',
        params: {
          phoneNumber,
        },
      });
    } catch (error) {
      res = error;
    }

    runInAction(() => {
      this.submitting = false;
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      }
    });
  }

  @action HandleLocalLogin = async (values) => {
    let res = {};
    this.submitting = true;
    let postData = null;
    let auth = null;
    if (values.captcha) {
      postData = {
        smsCode: values.captcha,
        loginName: values.mobile,
      };
    } else {
      auth = {
        username: values.userName,
        password: values.password,
      };
    }

    const authData = auth ? { auth } : { data: postData };

    try {
      res = await fetch({
        method: 'POST',
        url: '/api/login',
        headers: {
          'content-type': 'application/json',
        },
        ...authData,
      });
    } catch (e) {
      res = e;
    }
    runInAction(() => {
      this.submitting = false;
      if (res.status !== 200 || !res.data.success) {
        const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.shouldRedirect = true;
        this.isLogin = true;
        // this.checkUserAccess(res.data.data);
        AccountStore.UpdateAccount(res.data.data);
      }
    });
  }

  @action HandleLogout = async () => {
    let res = {};
    try {
      res = await fetch({
        method: 'GET',
        url: '/api/logout',
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        const errMsg = res.response.data.message || res.message || res.data.errorMsg;
        asyncFeedback.error(errMsg);
      } else {
        this.shouldRedirect = false;
        this.isLogin = false;
        this.hasRoleAccess = false;
        AccountStore.UpdateAccount({});
      }
    });
  }
}

export default new LoginStore();
