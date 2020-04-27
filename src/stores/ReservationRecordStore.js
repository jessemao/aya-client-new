import {
  observable, action, configure, runInAction,
} from 'mobx';
import BaseStore from '../utils/store/BaseStore';

configure({ enforceActions: 'always' });

class ReservationRecordStore extends BaseStore {
  urlPrefix = 'reservation-record';

  @observable contactPerson = {};

  @observable reservationDate = new Date();

  @observable reservationList = [];

  @observable selectedBtnList = [];
}

export default new ReservationRecordStore();
