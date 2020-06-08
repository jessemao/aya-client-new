import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class EventDescriptionStore extends BaseStore {
  urlPrefix = 'event-description';

  @action FindByEvent = (event) => {
    const eventId = event._id;
    const res = this.itemListFlat.find((item) => {
      if (!item || !item.eventId) {
        return false;
      }
      return item.eventId._id === eventId;
    });
    if (!res) {
      this.FetchItemByQuery({ eventId });
    } else {
      this.selectedItem = res;
    }
  }
}

export default new EventDescriptionStore();
