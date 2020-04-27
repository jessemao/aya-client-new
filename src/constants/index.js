import { NAV_MENU } from './nav';

import {
  NAV_ROUTES,
  SUB_NAV_ROUTES,
} from './routes';

// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,100}$/g;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/g;

const PASSWORD_MEDIUM_STRONG = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g;

const EMAIL_REGEX = /^([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{1,10}){0,2})+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,10}){1,2})$/im;

const OSS_PREFIX = 'https://mclub-image-01.oss-cn-shenzhen.aliyuncs.com/';

const QQ_MAP_KEY = 'BRGBZ-XWULX-FS34K-TEE3X-7HWY5-XOFNR';

const MERCHANT_TYPE_MAP = {
  0: '平台',
  1: '签约商户',
  2: '第三方商户',
  3: '其他',
};

const MERCHANT_TYPE_LIST = [
  '平台',
  '签约商户',
  '第三方商户',
  '其他',
];

const STORE_TYPE_MAP = {
  0: '咖啡厅',
  1: '会议室',
  2: '茶室',
  3: '雪茄吧',
  4: '健身房',
  5: '酒吧',
  6: '路演厅',
};

const STORE_TYPE_LIST = [
  '咖啡厅',
  '会议室',
  '茶室',
  '雪茄吧',
  '健身房',
  '酒吧',
  '路演厅',
];

const TENANT_STATUS_MAP = {
  0: '未签约',
  1: '已签约',
  2: '待续签',
  3: '已退租',
  4: '欠费',
};

const TENANT_STATUS_LIST = [
  '未签约',
  '已签约',
  '待续签',
  '已退租',
  '欠费',
];

export {
  NAV_MENU,
  NAV_ROUTES,
  SUB_NAV_ROUTES,
  PASSWORD_REGEX,
  PASSWORD_MEDIUM_STRONG,
  EMAIL_REGEX,
  OSS_PREFIX,
  QQ_MAP_KEY,
  MERCHANT_TYPE_MAP,
  MERCHANT_TYPE_LIST,
  STORE_TYPE_MAP,
  STORE_TYPE_LIST,
  TENANT_STATUS_MAP,
  TENANT_STATUS_LIST,
};
