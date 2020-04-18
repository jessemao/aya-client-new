import {
  observable, action, configure, runInAction, computed,
} from 'mobx';
// import fetch from 'axios';

// import LoginStore from './LoginStore';
import BaseStore from '../utils/store/BaseStore';
// import asyncFeedback from '../components/basic/async-feedback';
// import { toFixed } from '../utils';
// import asyncFeedback from '../components/basic/async-feedback';
// import { toFixed } from '../utils';
// import asyncFeedback from '../components/basic/async-feedback';

configure({ enforceActions: 'always' });

class ExposureStore extends BaseStore {
  urlPrefix = 'exposure';
}

export default new ExposureStore();
