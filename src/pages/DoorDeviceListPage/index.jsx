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


const searchItemList = [
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
    key: 'name',
    title: '名称',
    compType: 'input',
    dataType: 'text',
  },
  {
    key: 'deviceCode',
    title: '设备号(官方)',
    compType: 'input',
    dataType: 'text',
    validateRule: {
      rules: [
        {
          required: true,
          message: '必须',
        },
      ],
    },
  },
  {
    key: 'type',
    title: '型号',
    compType: 'select',
    asyncUrl: '/api/admin/door-device/type',
  },
  {
    key: 'storeId._id',
    title: '房间号',
    compType: 'select',
    asyncUrl: '/api/admin/store/option',
  },
  {
    key: 'buildingId',
    title: '项目楼',
    compType: 'select',
    asyncUrl: '/api/admin/building/option',
  },
  {
    key: 'boughtAt',
    title: '采购时间',
    compType: 'date',
  },
];


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
  const { DoorDeviceStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = DoorDeviceStore;

  const columns = [
    {
      title: '设备',
      dataIndex: 'name',
    },
    {
      title: '设备号',
      dataIndex: 'deviceCode',
    },
    {
      title: '设备Id',
      dataIndex: 'deviceId',
    },
    {
      title: '房间',
      dataIndex: 'storeId.name',
    },
    {
      title: '分组',
      dataIndex: 'groupId',
      render(val) {
        if (Array.isArray(val)) {
          return val.map((item) => item.name).join(', ');
        }
        return val && val.name;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      onFilter: (value, record) => record.status === value,
      render(val) {
        const value = DoorDeviceStore.statusOptions.find((item) => item.key === val);
        if (!value) {
          return null;
        }
        return <Badge status={value.value} text={value.value} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              setUpdateVisible(true);
              return setSelectedItem(record);
            }}
          >
            更新
          </a>

          <Divider type="vertical" />
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

  const handleSearch = (sq) => {
    DoorDeviceStore.SetAttributeByName('currentPage', 1);
    DoorDeviceStore.SetAttributeByName('searchQuery', sq);
  };


  const createFormMethods = {
    onOk: (item) => {
      DoorDeviceStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      DoorDeviceStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      DoorDeviceStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  useEffect(() => {
    DoorDeviceStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          DoorDeviceStore.DeleteMultipleItems(selectedIds);
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
        onSearch={handleSearch}
        onSelectRow={setSelectedRows}
        store={DoorDeviceStore}
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
          title="创建门禁"
          {...createFormMethods}
          modalVisible={addVisible}
          showCreateBtn
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="更新设备"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核门禁"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />

      </CommonListPage>
    </PageHeaderWrapper>
  );
});
