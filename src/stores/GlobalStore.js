import {
  configure, observable, action, runInAction, computed,
} from 'mobx';
import fetch from 'axios';

configure({ enforceActions: 'always' });

class GlobalStore {
  @observable collapsed = false;

  @observable privateKey = '';

  @action collapseSideMenu = (collapsed) => {
    this.collapsed = collapsed;
  }
}

export default new GlobalStore();
