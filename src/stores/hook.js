import React from 'react';

import AccountStore from './AccountStore';
import BuildingStore from './BuildingStore';
import BuildingAccountStore from './BuildingAccountStore';
import DoorDeviceAccountStore from './DoorDeviceAccountStore';
import DoorDeviceStore from './DoorDeviceStore';
import DoorQrcodeStore from './DoorQrcodeStore';
import EventAttendeeStore from './EventAttendeeStore';
import EventDescriptionStore from './EventDescriptionStore';
import EventInstructionStore from './EventInstructionStore';
import EventStore from './EventStore';
import GlobalStore from './GlobalStore';
import LoginStore from './LoginStore';
import MerchantAccountStore from './MerchantAccountStore';
import MerchantStore from './MerchantStore';
import OrderStore from './OrderStore';
import OrderRefundStore from './OrderRefundStore';
import ReservationRecordStore from './ReservationRecordStore';
import StoreDescriptionStore from './StoreDescriptionStore';
import StorePriceStore from './StorePriceStore';
import StoreStore from './StoreStore';
import TenantLeaseStore from './TenantLeaseStore';
import TenantStore from './TenantStore';

export const storeContext = React.createContext({
  AccountStore,
  BuildingStore,
  BuildingAccountStore,
  DoorDeviceAccountStore,
  DoorDeviceStore,
  DoorQrcodeStore,
  EventAttendeeStore,
  EventDescriptionStore,
  EventInstructionStore,
  EventStore,
  GlobalStore,
  LoginStore,
  MerchantAccountStore,
  MerchantStore,
  OrderStore,
  OrderRefundStore,
  ReservationRecordStore,
  StoreDescriptionStore,
  StorePriceStore,
  StoreStore,
  TenantLeaseStore,
  TenantStore,
});

export const useStores = () => React.useContext(storeContext);
