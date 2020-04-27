import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class BuildingStore extends BaseStore {
  urlPrefix = 'building-account';

  @observable typeList = [];
}

export default new BuildingStore();
