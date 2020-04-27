import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class MerchantStore extends BaseStore {
  urlPrefix = 'merchant'
}

export default new MerchantStore();
