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

const CURRENCY_MAP = {
  bank: '银行',
  rateAdjustedDate: '调汇日期',
  goodsTotalCNY: '货值金额(CNY)',
  currencyRates: '购汇汇率',
  transactionType: '是否购汇',
  receivedDate: '到账日期',
  receivedDifference: '到帐差额',
  receivedBadaTotal: '八达到帐金额',
  rateAdjustedUSD: '调汇金额(USD)',
  rateAdjustedHKD: '调汇金额(HKD)',
  rateAdjustedCNY: '调汇金额(CNY)',
  rateAdjustedEUR: '调汇金额(EUR)',
  rateMarketing: '市场参考牌价',
  rateDifference: '实时汇率与10点汇率差异点',
  rateDifferenceProfitUSD: '汇差',
  lockedRate: '锁价时点汇率',
  notes: '备注',
  benefitRate: '优惠点',
};

const EXPORTPROCEEDS_MAP = {
  exportDate: '日期',
  customer: '客户名称',
  totalUSD: '金额（USD）',
  ratesOfReceivedDate: '收款日汇率',
  settlementCNY: '结汇人民币',
  rateAdjustedDate: '调汇日期',
  balanceUSD: '汇率10点',
  rateAtTenOClock: '调汇美金（USD)',
  rateAdjustedUSD: '余额（USD）',
  rateDifference: '汇差',
  rateDifferenceProfitUSD: '结汇资金成本',
  settlementMoneyCosts: '出口结汇收益',
  settlementProfit: '合计USD',
  notes: '备注',
};

const TRANSACTON_MAP = {
  dueDate: '应付日期',
  account: '客户',
  transactionDate: '到账日期',
  detail: '详情',
  receivableIncomes: '应收',
  incomes: '收入',
  outcomes: '支出',
  totalBalance: '余额',
  notes: '备注',
};

const LOC_MAP = {
  beneficiary: '客户',
  bank: '开证行',
  dateOfIssue: '开证日期',
  titleType: '单双抬头',
  creditNumber: '信用证号',
  contractNumber: '合同号',
  amountUSD: '开证金额USD',
  currencyCode: '币种',
  amountTotal: '开证金额CNY',
  rules: '议付条件',
  dateOfExpire: '效期',
  guarantyStyle: '担保方式',
  guarantyAmount: '银行保证金',
  issueFee: '开证费',
  rateOfIssueFee: '开证费率',
  acceptanceFee: '承兑费',
  rateOfAcceptance: '承兑费率',
  changesFee: '改证费',
  confirmationFee: '保兑费',
  rateOfConfirmationFee: '保兑费率',
  otherFees: '其它费用',
  dateOfReceiveDeclaration: '到单日期',
  dateOfAcceptance: '承兑日期',
  dateOfPayment: '买单日期',
  paymentOfForeignExchangeAmountUSD: '付汇金额(USD)',
  paymentOfForeignExchangeAmountCNY: '付汇金额(CNY)',
  rateOfForeignExchange: '付款汇率',
};

const LOC_EXPIRE_MAP = {
  // dateOfIssue: '开证日期',
  beneficiary: '客户',
  bank: '开证行',
  // titleType: '单双抬头',
  creditNumber: '信用证号',
  // contractNumber: '合同号',
  amountTotal: '开证金额',
  // currencyCode: '币种',
  // rules: '议付条件',
  dateOfExpire: '效期',
  expireDay: '超期天数',
  // guarantyStyle: '担保方式',
  // guarantyAmount: '银行保证金',
  // issueFee: '开证费',
  // rateOfIssueFee: '开证费率',
  // acceptanceFee: '承兑费',
  // rateOfAcceptance: '承兑费率',
  // changesFee: '改证费',
  // confirmationFee: '保兑费',
  // rateOfConfirmationFee: '保兑费率',
  // otherFees: '其它费用',
  // dateOfReceiveDeclaration: '到单日期',
  // dateOfAcceptance: '承兑日期',
  dateOfPayment: '买单日期',
  // paymentOfForeignExchangeAmountUSD: '付汇金额(USD)',
  // paymentOfForeignExchangeAmountCNY: '付汇金额(CNY)',
  // rateOfForeignExchange: '付款汇率',
};

const STRUCTURED_MAP = {
  date: '日期',
  bank: '银行',
  principalCNY: '本金(CNY)',
  principalUSD: '本金(USD)',
  currencyExchangeProfit: '综合收益 - 购汇分摊',
  financingProfit: '综合收益 - 理财分摊',
  profitRate: '收益率',
};

const PROFIT_TYPE = {
  currency: '进口购汇',
  exportProceeds: '出口调汇',
  structured: '结构理财',
};

const CREDIT_MAP = {
  grantor: '授信主体',
  bank: '金融机构',
  dateOfExpire: '到日期',
  amountTotal: '银行授信敞口',
  amountTotalReserved: '暂不可使用额度',
  amountTotalLoc: '信用证',
  amountTotalTTCurrencyExchange: 'TT押汇',
  amountTotalStandbyLoc: '备付证',
  amountTotalGuaranty: '保函',
  amountTotalFloatingLoan: '流贷',
  notes: '备注',
};

const EXPOSURE_MAP = {
  bank: '授信银行',
  type: '产品类型',
  amountCNY: '人民币',
  amountUSD: 'USD',
  dateOfIssue: '开出日期',
  dateOfExpire: '还款日期',
  dateOfPayment: '实际还款日',
  rateOfInterests: '还款利率',
  paymentTermInMonth: '账期(月)',
  guarantyAmount: '保证金CNY',
  interests: '利息（USD）',
};

const GUARANTY_CUSTOMS_MAP = {
  bank: '授信银行',
  type: '授信方式',
  amountCNY: '人民币',
  amountUSD: 'USD',
  dateOfIssue: '开出日期',
  dateOfExpire: '到期日期',
  guarantyAmount: '保证金CNY',
  isUsing: '是否在用',
  notes: '备注',
};

export {
  NAV_MENU,
  NAV_ROUTES,
  SUB_NAV_ROUTES,
  PASSWORD_REGEX,
  PASSWORD_MEDIUM_STRONG,
  EMAIL_REGEX,
  OSS_PREFIX,
  QQ_MAP_KEY,
  CURRENCY_MAP,
  PROFIT_TYPE,
  EXPORTPROCEEDS_MAP,
  STRUCTURED_MAP,
  TRANSACTON_MAP,
  LOC_MAP,
  LOC_EXPIRE_MAP,
  CREDIT_MAP,
  EXPOSURE_MAP,
  GUARANTY_CUSTOMS_MAP,
};
