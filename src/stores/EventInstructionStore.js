import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class EventInstructionStore extends BaseStore {
  urlPrefix = 'event-instruction';
}

export default new EventInstructionStore();
