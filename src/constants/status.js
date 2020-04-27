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

const ACCOUNT_ROLE = {
  ROOT: 1,
  DEVELOPER: 2,
  ADMIN: 10,
  PLATFORM: 20,
  USER: 40,
  GUEST: 50,
};

const ACCOUNT_KEY_VALUE = {
  1: '超级管理员',
  2: '开发人员',
  10: '管理员',
  20: '运营人员',
  40: '普通用户',
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
  ACCESS_LEVEL,
};
