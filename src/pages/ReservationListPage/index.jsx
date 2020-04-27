import {
  Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import CommonListPage from '../common/CommonListPage';
import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';

import {
  EVENT_USER_STATUS,
} from '../../constants/order';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { SUB_NAV_ROUTES } from '../../constants';


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

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];


export default observer(() => {
  const { ReservationRecordStore } = useStores();
  // const [reviewVisible, setReviewVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  // const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = ReservationRecordStore;

  const columns = [
    {
      title: '场地',
      dataIndex: ['storeId', 'name'],
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return EVENT_USER_STATUS[val];
      },
    },
    {
      title: '预约人',
      dataIndex: ['accountId', 'basicInfo'],
      render(val) {
        if (!val) {
          return null;
        }
        return val.fullname || val.nickName;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Link
            to={`${SUB_NAV_ROUTES.RESERVATION_REFUND_PAGE.path}?id=${record._id}`}
          >
            取消/退押金
          </Link>
        </Fragment>
      ),
    },
  ];


  // const reviewFormMethods = {
  //   onModalVisible: () => setReviewVisible(false),
  //   onOk: () => {
  //     setReviewVisible(false);
  //     ReservationRecordStore.PutItemRequest(selectedItem._id, updatedValue);
  //   },
  // };


  useEffect(() => {
    ReservationRecordStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          ReservationRecordStore.DeleteMultipleItems(selectedIds);
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
        store={ReservationRecordStore}
        columns={columns}
        showCreateBtn={false}
      />
    </PageHeaderWrapper>
  );
});
