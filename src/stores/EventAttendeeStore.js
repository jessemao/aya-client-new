import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class EventAttendeeStore extends BaseStore {
  urlPrefix = 'event-attendee';

  @observable selectedEventId = '';
}

export default new EventAttendeeStore();
