const FULFILLMENT_STATUS_VALUE_MAP = {
  0: '初始化',
  1: '待支付',
  2: '预下单',
  3: '已下单',
  4: '已寄出',
  5: '已收到',
  6: '已过期',
  7: '已支付',
  8: '取消中',
  9: '已取消',
  10: '退款中',
  11: '已退款',
};

const FULFILLMENT_STATUS = {
  INIT: 0,
  PENDING: 1,
  PREORDER: 2,
  PLACED: 3,
  SHIPPED: 4,
  RECEIVED: 5,
  EXPIRED: 6,
  FULFILLED: 7,
  CANCELING: 8,
  CANCELED: 9,
  REFUNDING: 10,
  REFUNDED: 11,
};

const EVENT_USER_STATUS = {
  101: '进行中',
  102: '已参与',
  3: '已预定',
  9: '已取消',
  6: '已过期',
  1: '待支付',
  10: '退款中',
  11: '已退款/已退订',
  103: '待支付',
  104: '已失效',
};

const RESERVATION_STATUS = {
  REFUNDED: 11,
  REFUNDING: 10,
  CANCELED: 9,
  EXPIRED: 6,
};

export {
  EVENT_USER_STATUS,
  FULFILLMENT_STATUS,
  FULFILLMENT_STATUS_VALUE_MAP,
  RESERVATION_STATUS,
};
