import React from 'react';

import AccountStore from './AccountStore';
import BalanceStore from './BalanceStore';
import CreditStore from './CreditStore';
import CurrencyStore from './CurrencyStore';
import ExposureStore from './ExposureStore';
import ExportProceedsStore from './ExportProceedsStore';
import GlobalStore from './GlobalStore';
import GuarantyCustomsStore from './GuarantyCustomsStore';
import LetterOfCreditStore from './LetterOfCreditStore';
import LoginStore from './LoginStore';
import ProfitStore from './ProfitStore';
import StructuredStore from './StructuredStore';

export const storeContext = React.createContext({
  AccountStore,
  BalanceStore,
  CurrencyStore,
  CreditStore,
  ExposureStore,
  ExportProceedsStore,
  GlobalStore,
  GuarantyCustomsStore,
  LetterOfCreditStore,
  LoginStore,
  ProfitStore,
  StructuredStore,
});

export const useStores = () => React.useContext(storeContext);
