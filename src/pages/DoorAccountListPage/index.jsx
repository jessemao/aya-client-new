import {
  Badge,
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
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import {
  QRCODE_TYPE_OPTION, QRCODE_TYPE_NAME, DOOR_ACCESS_STATUS, DOOR_ACCESS_STATUS_NAME, QRCODE_TYPE,
} from '../../constants/door';

const searchItemList = [
  {
    key: 'fullname',
    title: '姓名',
    compType: 'input',
    allowClear: true,
    placeholder: '输入姓名/昵称',
  },
  {
    key: 'phoneNumber',
    title: '电话',
    compType: 'input',
    dataType: 'tel',
    allowClear: true,
    placeholder: '输入电话号码',
  },
  {
    key: 'name',
    title: '设备名',
    compType: 'input',
    allowClear: true,
    placeholder: '输入自定义名称',
  },
  {
    key: 'deviceCode',
    title: '设备号',
    compType: 'input',
    allowClear: true,
    placeholder: '输入设备号',
  },
  {
    key: 'deviceId',
    title: '设备Id',
    compType: 'input',
    allowClear: true,
    placeholder: '输入设备Id',
  },
];

const formItemList = [
  {
    key: 'doorDeviceIdList._id',
    title: '门禁',
    compType: 'select',
    mode: 'multiple',
    showSearch: true,
    asyncUrl: '/api/admin/door-device/option',
  },
  {
    key: 'accountId._id',
    title: '用户',
    showSearch: true,
    compType: 'select',
    asyncUrl: '/api/admin/door-device/account-option',
  },
  {
    key: 'type',
    title: '权限类型',
    compType: 'select',
    option: QRCODE_TYPE_OPTION,
  },
];

const qrcodeFormList = [
  {
    key: 'qrcodeData',
    compType: 'image',
    readOnly: true,
  },
];

const reviewFormList = [
  {
    key: 'doorDeviceId._id',
    title: '门禁',
    compType: 'select',
    mode: 'multiple',
    asyncUrl: '/api/admin/door-device/option',
  },
  {
    key: 'accountId.basicInfo.fullname',
    title: '用户',
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

const accessTypeFormList = [
  {
    key: 'doorDeviceId.name',
    title: '门禁',
    compType: 'span',
  },
  {
    key: 'accountId.basicInfo.fullname',
    title: '用户',
    compType: 'span',
  },
  {
    key: 'type',
    title: '权限类型',
    compType: 'select',
    option: QRCODE_TYPE_OPTION,
  },
];

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];


export default observer(() => {
  const { DoorDeviceAccountStore, DoorQrcodeStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [accessTypeVisible, setAccessTypeVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [qrcodeVisible, setQrcodeVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = DoorDeviceAccountStore;
  const {
    selectedQrcode,
  } = DoorQrcodeStore;

  const handleViewQrcode = (record) => {
    setQrcodeVisible(true);
    DoorQrcodeStore.FetchQrcodeById(record.accountId._id, record.doorDeviceId._id);
  };

  const handleUpdateQrCode = (record) => {
    Modal.confirm({
      centered: true,
      title: '更新二维码？',
      content: '注意，您正在更新访客二维码，一旦确认，访客将拥有对应门禁的权限，请确认您是否同意？',
      onOk: () => {
        DoorDeviceAccountStore.PutItemRequest(record.qrcode._id, { type: QRCODE_TYPE.GUEST, status: DOOR_ACCESS_STATUS.GRANTED });
      },
    });
  };


  const columns = [
    {
      title: '门禁',
      dataIndex: ['doorDeviceId', 'name'],
    },
    {
      title: '用户',
      dataIndex: ['accountId', 'basicInfo'],
      render(val, record) {
        if (!val) {
          return null;
        }
        return val.nickName || val.fullname;
      },
    },
    {
      title: '二维码',
      dataIndex: 'type',
      render(val) {
        return QRCODE_TYPE_NAME[val];
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      render(val) {
        if (val) {
          return <Badge status={DOOR_ACCESS_STATUS_NAME[val]} text={DOOR_ACCESS_STATUS_NAME[val]} />;
        }
        return null;
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        const { status } = record;
        let qrCodeNode = {};
        if (status === DOOR_ACCESS_STATUS.GRANTED) {
          qrCodeNode = (
            <a
              onClick={() => handleViewQrcode(record)}
            >
              查看二维码
            </a>
          );
        } else {
          qrCodeNode = (
            <a
              onClick={() => handleUpdateQrCode(record)}
            >
              更新二维码
            </a>
          );
        }
        return (
          <Fragment>
            <Fragment>
              <a
                onClick={() => {
                  setAccessTypeVisible(true);
                  return setSelectedItem(record);
                }}
              >
                权限类型
              </a>
              <Divider type="vertical" />
            </Fragment>

            <a
              onClick={() => {
                setReviewVisible(true);
                return setSelectedItem(record);
              }}
            >
              绑定状态
            </a>
            <Divider type="vertical" />

            { qrCodeNode }
          </Fragment>
        );
      },
    },
  ];

  const createFormMethods = {
    onOk: (item) => {
      DoorDeviceAccountStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const accessTypeModalVisibleFormMethods = {
    onModalVisible: () => setAccessTypeVisible(false),
    onOk: () => {
      setAccessTypeVisible(false);
      DoorDeviceAccountStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      DoorDeviceAccountStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  const qrcodeFormMethods = {
    onModalVisible: () => setQrcodeVisible(false),
    onOk: () => {
      setQrcodeVisible(false);
    },
  };

  useEffect(() => {
    DoorDeviceAccountStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          DoorDeviceAccountStore.DeleteMultipleItems(selectedIds);
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
        searchItemList={searchItemList}
        onSelectRow={setSelectedRows}
        store={DoorDeviceAccountStore}
        columns={columns}
        showCreateBtn
        onCreate={() => {
          setAddVisible(true);
        }}
        type="checkbox"
      >
        <FormModal
          width={800}
          formItemList={formItemList}
          title="新建门禁用户权限"
          {...createFormMethods}
          modalVisible={addVisible}
          showCreateBtn
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={accessTypeFormList}
          title="门禁权限状态"
          {...accessTypeModalVisibleFormMethods}
          modalVisible={accessTypeVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核门禁权限"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          title="门禁二维码"
          value={selectedQrcode}
          formItemList={qrcodeFormList}
          {...qrcodeFormMethods}
          modalVisible={qrcodeVisible}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
