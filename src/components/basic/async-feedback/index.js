import { message } from 'antd';

class AsyncFeedback {
  success(msg) {
    message.success(msg);
  }

  fail(msg) {
    message.error(msg);
  }

  error(msg) {
    return this.fail(msg);
  }
}

export default new AsyncFeedback();
