import {
  observable, action, configure, runInAction,
} from 'mobx';

import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class StoreDescriptionStore extends BaseStore {
  urlPrefix = 'store-description';

  @action FindByStore = (store) => {
    const storeId = store._id;
    const res = this.itemListFlat.find((item) => {
      if (!item || !item.storeId) {
        return false;
      }
      return item.storeId._id === storeId;
    });
    if (!res) {
      this.FetchItemByQuery({ storeId });
    } else {
      this.selectedItem = res;
    }
  }
}

export default new StoreDescriptionStore();
