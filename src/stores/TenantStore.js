import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class TenantStore extends BaseStore {
  urlPrefix = 'tenant'
}

export default new TenantStore();
