import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class TenantLeaseStore extends BaseStore {
  urlPrefix = 'tenant-lease'
}

export default new TenantLeaseStore();
