import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class EventDescriptionStore extends BaseStore {
  urlPrefix = 'event-description';
}

export default new EventDescriptionStore();
