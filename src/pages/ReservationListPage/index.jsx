import {
  Modal,
  Divider,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import CommonListPage from '../common/CommonListPage';
import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';
import FormModal from '../../components/FormModal';

import {
  EVENT_USER_STATUS,
} from '../../constants/order';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];

const qrcodeFormList = [
  {
    key: 'qrcodeData',
    compType: 'image',
    readOnly: true,
  },
];

export default observer(() => {
  const { ReservationRecordStore, DoorQrcodeStore } = useStores();
  // const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [qrcodeVisible, setQrcodeVisible] = useState(false);
  const { searchQuery, currentPage, pageSize } = ReservationRecordStore;

  const {
    selectedQrcode,
  } = DoorQrcodeStore;

  const handleViewQrcode = (record) => {
    setQrcodeVisible(true);
    DoorQrcodeStore.FetchQrcodeByReservation(record._id);
  };


  const columns = [
    {
      title: '预约时间',
      dataIndex: 'name',
    },
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
          <a
            onClick={() => {
              setCancelVisible(true);
              setSelectedItem(record);
            }}
          >
            取消
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleViewQrcode(record);
            }}
          >
            二维码
          </a>
        </Fragment>
      ),
    },
  ];

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

  useEffect(() => {
    if (cancelVisible) {
      Modal.confirm({
        title: '是否取消',
        content: `是否取消 - 场地${selectedItem.storeId.name} - ${selectedItem.name}的预约`,
        onOk: () => {
          // ReservationRecordStore.PutItemByQuery({_id: selectedItem._id}, )
          setCancelVisible(false);
        },

      });
    }
  }, [cancelVisible]);

  const qrcodeFormMethods = {
    onModalVisible: () => setQrcodeVisible(false),
    onOk: () => {
      setQrcodeVisible(false);
    },
  };

  console.log('sss', selectedQrcode);
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
      <FormModal
        title="门禁二维码"
        value={selectedQrcode}
        formItemList={qrcodeFormList}
        {...qrcodeFormMethods}
        modalVisible={qrcodeVisible}
      />
    </PageHeaderWrapper>
  );
});
