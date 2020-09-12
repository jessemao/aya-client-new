const REVIEW_STATUS_MAP = {
  0: '未审批',
  1: '通过',
  2: '审批中',
  3: '拒绝',
  4: '撤销',
  5: '失效',
};

const REVIEW_STATUS_LIST = [
  '未审批', '通过', '审批中', '拒绝', '撤销', '失效',
];

const EVENT_USER_STATUS_LIST = [
  '已签到', '正在进行', '已参加', '已报名', '已取消', '已过期', '待支付', '待定', '失效', '提醒',
];

const EVENT_USER_STATUS = {
  100: EVENT_USER_STATUS_LIST[0],
  101: EVENT_USER_STATUS_LIST[1],
  102: EVENT_USER_STATUS_LIST[2],
  3: EVENT_USER_STATUS_LIST[3],
  9: EVENT_USER_STATUS_LIST[4],
  6: EVENT_USER_STATUS_LIST[5],
  1: EVENT_USER_STATUS_LIST[6],
  103: EVENT_USER_STATUS_LIST[7],
  104: EVENT_USER_STATUS_LIST[8],
  105: EVENT_USER_STATUS_LIST[9],
};

const ACCOUNT_ROLE = {
  ROOT: 1,
  DEVELOPER: 2,
  ADMIN: 10,
  PLATFORM_ADMIN: 19,
  PLATFORM: 20,
  USER: 40,
  AGENT: 49,
  GUEST: 50,
};

const ACCOUNT_KEY_VALUE = {
  1: '超级管理员',
  2: '开发人员',
  10: '管理员',
  19: '运营管理人员',
  20: '运营人员',
  40: '普通用户',
  49: '经纪人',
  50: '访客',
};

const ROLE_OPTION = Object.keys(ACCOUNT_KEY_VALUE).map((key) => ({
  key,
  value: ACCOUNT_KEY_VALUE[key],
}));

const ACCESS_ROLE = [
  {
    key: 1,
    title: 'Guest',
  },
  {
    key: 50,
    title: 'Operator',
  },
  {
    key: 51,
    title: 'Operator2',
  },
  {
    key: 52,
    title: 'Operator3',
  },
  {
    key: 53,
    title: 'Operator4',
  },
  {
    key: 90,
    title: 'Developer',
  },
  {
    key: 100,
    title: 'Admin',
  },
];

const ACCESS_LEVEL = {
  GUEST: 1,
  OPERATOR: 50,
  OPERATOR2: 51,
  OPERATOR3: 52,
  OPERATOR4: 53,
  DEVELOPER: 90,
  ADMIN: 100,
};

const USER_KEY = {
  EMPLOYEE: 'employee',
  USER: 'user',
};

const USER_TYPE = [
  {
    key: USER_KEY.USER,
    text: '用户',
  },
  {
    key: USER_KEY.EMPLOYEE,
    text: '员工',
  },
];

export {
  ACCOUNT_ROLE,
  ACCOUNT_KEY_VALUE,
  REVIEW_STATUS_MAP,
  REVIEW_STATUS_LIST,
  ROLE_OPTION,
  ACCESS_ROLE,
  USER_TYPE,
  EVENT_USER_STATUS_LIST,
  EVENT_USER_STATUS,
  ACCESS_LEVEL,
};
