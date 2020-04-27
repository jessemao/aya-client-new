
const QRCODE_TYPE = {
  GUEST: 1,
  TENANT: 2,
};

const QRCODE_TYPE_NAME = {
  1: '访客',
  2: '租户',
};

const QRCODE_TYPE_OPTION = Object.keys(QRCODE_TYPE_NAME).map((key) => ({
  key,
  value: QRCODE_TYPE_NAME[key],
}));

const DOOR_ACCESS_STATUS = {
  NO_ACCESS: 1,
  GRANTED: 2,
  EXPIRED: 3,
  INVALID: 4,
};

const DOOR_ACCESS_STATUS_NAME = {
  1: '无权限',
  2: '已授权',
  3: '已过期',
  4: '失效',
};

const DOOR_ACCESS_STATUS_OPTION = Object.keys(DOOR_ACCESS_STATUS_NAME).map((key) => ({
  key,
  value: DOOR_ACCESS_STATUS_NAME[key],
}));

export {
  QRCODE_TYPE,
  QRCODE_TYPE_NAME,
  QRCODE_TYPE_OPTION,
  DOOR_ACCESS_STATUS,
  DOOR_ACCESS_STATUS_NAME,
  DOOR_ACCESS_STATUS_OPTION,
};
