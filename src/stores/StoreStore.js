import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class StoreStore extends BaseStore {
  urlPrefix = 'store'
}

export default new StoreStore();
