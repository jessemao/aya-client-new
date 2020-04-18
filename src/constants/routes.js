import { ACCOUNT_ROLE } from './status';

const SUB_NAV_ROUTES = {
  NO_ACCESS: {
    path: '/no-access',
    name: '没有权限',
  },
  EDIT_CREDIT_PAGE: {
    path: '/edit/credit',
    name: '授信额度',
  },
  EDIT_LOC_PAGE: {
    path: '/edit/loc',
    name: '信用证',
  },
  EDIT_STANDBY_LOC_PAGE: {
    path: '/edit/loc-standby',
    name: '备付信用证',
  },
  EDIT_EXPOSURE_PAGE: {
    path: '/edit/exposure',
    name: '敞口',
  },
  EDIT_GUARANTY_CUSTOMS_PAGE: {
    path: '/edit/guaranty-customs',
    name: '保证金',
  },
  // OVERALL_PAGE: {}
  ACCOUNT_LIST: {
    path: '/account/account-list',
    name: '用户列表',
  },
  // COMPANY_LIST: {
  //   path: '/manager/company-list',
  //   name: '公司列表',
  // },
  // PROFILE_SETTING: {
  //   path: '/profile/settings',
  //   name: '用户设置',
  // },
};

const NAV_ROUTES = {
  OVERALL_PAGE: {
    path: '/overall',
    name: '营收汇总',
  },
  CREDIT_PAGE: {
    path: '/credit',
    name: '授信额度',
  },
  EDITABLE_PAGE: {
    path: '/edit',
    name: '数据编辑',
    accessRole: ACCOUNT_ROLE.PLATFORM,
    children: [
      SUB_NAV_ROUTES.EDIT_CREDIT_PAGE,
      SUB_NAV_ROUTES.EDIT_LOC_PAGE,
      SUB_NAV_ROUTES.EDIT_STANDBY_LOC_PAGE,
      SUB_NAV_ROUTES.EDIT_EXPOSURE_PAGE,
      SUB_NAV_ROUTES.EDIT_GUARANTY_CUSTOMS_PAGE,
    ],
  },
  ACCOUNT_PAGE: {
    path: '/account',
    name: '用户管理',
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
