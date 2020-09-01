import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';

import CommonListPage from '../common/CommonListPage';
import FormModal from '../../components/FormModal';
import ConfirmModal from '../../components/ConfirmModal';
import { useStores } from '../../stores/hook';

import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { EVENT_USER_STATUS, FULFILLMENT_STATUS } from '../../constants/order';


const searchItemList = [
  {
    key: 'reservationDate',
    title: '预约日期',
    compType: 'date',
  },
  {
    key: 'storeId',
    title: '场地名',
    compType: 'select',
    asyncUrl: '/api/admin/store/option',
  },
];

const formItemList = [
  {
    key: 'reservationDate',
    title: '预约日期',
    compType: 'span',
  },
  {
    key: 'timeRangeText',
    title: '预约时间',
    compType: 'span',
  },

  {
    key: 'storeId.name',
    title: '场地名',
    compType: 'span',
  },
  {
    key: 'orderId.orderNumber',
    title: '订单号',
    compType: 'span',
  },
  {
    key: 'orderId.deposit',
    title: '押金',
    compType: 'span',
  },
  {
    key: 'refundTotal',
    title: '可退金额',
    compType: 'input',
    dataType: 'number',
  },
];


export default observer(() => {
  const { OrderRefundStore, AccountStore } = useStores();
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = OrderRefundStore;
  const { currentUser } = AccountStore;
  const { basicInfo = {} } = currentUser || {};
  const refundTotal = updatedValue.refundTotal || selectedItem.refundTotal;
  const phoneNumber = updatedValue.phoneNumber || basicInfo.phoneNumber;

  const columns = [
    {
      title: '预约日期',
      dataIndex: 'reservationDate',
    },
    {
      title: '预约时间',
      dataIndex: 'timeRangeText',
    },
    {
      key: ['accountId', 'basicInfo'],
      title: '用户名',
      render(val, record) {
        const { accountId } = record;
        return accountId.basicInfo.fullname || accountId.basicInfo.nickName;
      },
    },
    {
      key: ['accountId', 'basicInfo', 'phoneNumber'],
      title: '联系方式',
      render(val, record) {
        const { accountId } = record;
        return accountId.basicInfo.phoneNumber;
      },
    },
    {
      title: '场地',
      dataIndex: ['storeId', 'name'],
    },
    {
      title: '订单号',
      dataIndex: ['orderId', 'orderNumber'],
    },
    {
      title: '押金',
      dataIndex: ['orderId', 'deposit'],
    },
    {
      title: '可退金额',
      dataIndex: 'refundTotal',
    },
    {
      title: '订单状态',
      dataIndex: ['orderId', 'status'],
      render(val) {
        return EVENT_USER_STATUS[val];
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        if (record.orderId.status === FULFILLMENT_STATUS.REFUNDED || record.orderId.status === FULFILLMENT_STATUS.CANCELED) {
          return null;
        }
        return (
          <Fragment>
            <a
              onClick={() => {
                setUpdateVisible(true);
                return setSelectedItem(record);
              }}
            >
              退订
            </a>
          </Fragment>
        );
      },
    },
  ];

  const handleSearch = (sq) => {
    OrderRefundStore.SetAttributeByName('currentPage', 1);
    OrderRefundStore.SetAttributeByName('searchQuery', sq);
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: async () => {
      if (selectedItem.refundTotal) {
        setConfirmVisible(true);
      } else {
        const res = await OrderRefundStore.RefundOrder({ autoRefundable: true, orderId: selectedItem.orderId._id });
        if (res && res.success) {
          setUpdateVisible(false);
        }
      }
      // setUpdateVisible(false);
      // OrderRefundStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const confirmMethods = {
    onOk: async (fields) => {
      const res = await OrderRefundStore.RefundOrder({ ...fields, orderId: selectedItem.orderId._id });
      setConfirmVisible(false);
      if (res && res.success) {
        setUpdateVisible(false);
      }
    },
    onCancel: () => {
      setConfirmVisible(false);
    },
    onCaptcha: () => {
      OrderRefundStore.FetchCaptcha(phoneNumber, selectedItem.orderId._id);
      // setCaptcha(cap);
    },
  };

  useEffect(() => {
    OrderRefundStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);


  return (
    <PageHeaderWrapper>
      <CommonListPage
        searchItemList={searchItemList}
        onSearch={handleSearch}
        store={OrderRefundStore}
        columns={columns}
        type="checkbox"
      >
        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="退款"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />
        <ConfirmModal
          title="确认退款"
          refundTotal={refundTotal}
          phoneNumber={phoneNumber}
          visible={confirmVisible}
          captcha={captcha}
          {...confirmMethods}
          onValuesChange={setUpdatedValue}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
