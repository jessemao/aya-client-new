import {
  Avatar,
  Divider,
  Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import CommonListPage from '../common/CommonListPage';
import FormModal from '../../components/FormModal';
import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';

import {
  REVIEW_STATUS_MAP,
} from '../../constants/status';
import {
  FULFILLMENT_STATUS, FULFILLMENT_STATUS_VALUE_MAP,
} from '../../constants/order';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';


// const searchItemList = [
//   {
//     key: 'name',
//     title: '名称',
//     compType: 'input',
//     allowClear: true,
//     placeholder: '输入活动名',
//   },
//   {
//     key: 'address',
//     title: '地址',
//     compType: 'input',
//     allowClear: true,
//     placeholder: '输入活动地址',
//   },
// ];


const reviewFormList = [
  {
    key: 'name',
    title: '名称',
    compType: 'span',
  },
  {
    key: 'status',
    title: '审核状态',
    compType: 'select',
    option: Object.keys(REVIEW_STATUS_MAP).map((key) => ({
      key,
      value: REVIEW_STATUS_MAP[key],
    })),
  },
];

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];


export default observer(() => {
  const { OrderStore } = useStores();
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = OrderStore;

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',

    },
    {
      title: '订单商品',
      dataIndex: 'itemList',
      render: (rec) => {
        if (!rec[0]) {
          return null;
        }
        return (
          <Fragment>
            <Avatar
              src={rec[0].imageUrl}
              alt={rec[0].name}
            />
            <div>
              {rec[0].name}
            </div>
          </Fragment>
        );
      },
    },
    {
      title: '费用',
      dataIndex: 'subtotal',
    },
    {
      title: '购买人',
      dataIndex: 'userId.basicInfo.nickName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => FULFILLMENT_STATUS_VALUE_MAP[val],
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {
            record.status !== FULFILLMENT_STATUS.PENDING && (
              <Fragment>
                <a
                  onClick={() => handleAcceptRefund(record)}
                >
                  退款
                </a>
                <Divider type="vertical" />
              </Fragment>
            )
          }
          <a
            onClick={() => {
              setReviewVisible(true);
              return setSelectedItem(record);
            }}
          >
            修改状态
          </a>
        </Fragment>
      ),
    },
  ];

  // const handleSearch = (sq) => {
  //   OrderStore.SetAttributeByName('currentPage', 1);
  //   OrderStore.SetAttributeByName('searchQuery', sq);
  // };

  const handleAcceptRefund = (record) => {
    OrderStore.RefundOrder(record._id);
  };


  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      OrderStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  useEffect(() => {
    OrderStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          OrderStore.DeleteMultipleItems(selectedIds);
        },
      });
    }
    setMultiActionKey('');
  }, [multiActionKey]);

  return (
    <PageHeaderWrapper>
      <CommonListPage
        multiActionMenu={(
          <MultiActionMenu
            onClick={setMultiActionKey}
            menuList={multiMenuList}
          />
        )}
        onSelectRow={setSelectedRows}
        store={OrderStore}
        columns={columns}
        showCreateBtn={false}

        type="checkbox"
      >
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核订单"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
