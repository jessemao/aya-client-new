import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';
import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class BuildingStore extends BaseStore {
  urlPrefix = 'building';

  @observable typeList = [];

  @observable statusOptions = [];
}

export default new BuildingStore();
