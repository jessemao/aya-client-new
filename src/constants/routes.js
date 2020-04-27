import { ACCOUNT_ROLE } from './status';

const SUB_NAV_ROUTES = {
  NO_ACCESS: {
    path: '/no-access',
    name: '没有权限',
  },
  ACCOUNT_LIST: {
    path: '/account/account-list',
    name: '用户列表',
  },
  BUILDING_LIST: {
    path: '/building/building-list',
    name: '项目列表',
  },
  BUILDING_ACCOUNT_LIST: {
    path: '/building/building-account-list',
    name: '项目管理',
  },
  DOOR_DEVICE_LIST: {
    path: '/door/door-list',
    name: '门禁列表',
  },
  DOOR_ACCOUNT_LIST: {
    path: '/door/door-account-list',
    name: '门禁权限',
  },
  STORE_LIST: {
    path: '/store/store-list',
    name: '场地列表',
  },
  STORE_PRICE_LIST: {
    path: '/store/store-price-list',
    name: '场地价格',
  },
  RESERVATION_GROUP: {
    path: '/reservation/reservation-list',
    name: '预约列表',
  },
  RESERVATION_REFUND_PAGE: {
    path: '/reservation/refund',
    name: '预约退款',
  },
  RESERVATION_REFUND_LIST_PAGE: {
    path: '/reservation/refund-list',
    name: '退款管理',
  },
};

const NAV_ROUTES = {
  BUILDING_GROUP: {
    path: '/building',
    name: '项目',
    accessRole: ACCOUNT_ROLE.PLATFORM,
    children: [
      SUB_NAV_ROUTES.BUILDING_LIST,
      SUB_NAV_ROUTES.BUILDING_ACCOUNT_LIST,
    ],
  },
  DOOR_GROUP: {
    path: '/door',
    name: '门禁',
    accessRole: ACCOUNT_ROLE.PLATFORM,
    children: [
      SUB_NAV_ROUTES.DOOR_DEVICE_LIST,
      SUB_NAV_ROUTES.DOOR_ACCOUNT_LIST,
    ],
  },
  STORE_GROUP: {
    path: '/store',
    name: '场地',
    accessRole: ACCOUNT_ROLE.PLATFORM,
    children: [
      SUB_NAV_ROUTES.STORE_LIST,
      SUB_NAV_ROUTES.STORE_PRICE_LIST,
    ],
  },
  RESERVATION_GROUP: {
    path: '/reservation',
    name: '预约',
    accessRole: ACCOUNT_ROLE.PLATFORM,
    children: [
      SUB_NAV_ROUTES.RESERVATION_GROUP,
      SUB_NAV_ROUTES.RESERVATION_REFUND_LIST_PAGE,
    ],
  },
  // EDITABLE_PAGE: {
  //   path: '/edit',
  //   name: '数据编辑',
  //   accessRole: ACCOUNT_ROLE.PLATFORM,
  //   children: [
  //     SUB_NAV_ROUTES.EDIT_CREDIT_PAGE,
  //     SUB_NAV_ROUTES.EDIT_LOC_PAGE,
  //     SUB_NAV_ROUTES.EDIT_STANDBY_LOC_PAGE,
  //     SUB_NAV_ROUTES.EDIT_EXPOSURE_PAGE,
  //     SUB_NAV_ROUTES.EDIT_GUARANTY_CUSTOMS_PAGE,
  //   ],
  // },
  ACCOUNT_PAGE: {
    path: '/account',
    name: '用户管理',
    accessRole: ACCOUNT_ROLE.ADMIN,
    accessRole: ACCOUNT_ROLE.ADMIN,
    children: [
      SUB_NAV_ROUTES.ACCOUNT_LIST,
    ],
  },
  LOGIN: {
    path: '/login',
    name: '登陆',
  },
};


export {
  NAV_ROUTES,
  SUB_NAV_ROUTES,
};
