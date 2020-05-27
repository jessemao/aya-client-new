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
  REVIEW_STATUS_LIST, REVIEW_STATUS_MAP,
} from '../../constants/status';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';


const searchItemList = [
  {
    key: 'name',
    title: '名称',
    compType: 'input',
    allowClear: true,
    placeholder: '输入活动名',
  },
  {
    key: 'address',
    title: '地址',
    compType: 'input',
    allowClear: true,
    placeholder: '输入活动地址',
  },

];

const formItemList = [
  {
    key: 'name',
    title: '名称',
    compType: 'input',
  },
  {
    key: 'address',
    title: '地址',
    compType: 'input',
  },
  {
    key: 'startTime',
    title: '开始时间',
    compType: 'date',
    showTime: true,
  },
  {
    key: 'endTime',
    title: '结束时间',
    compType: 'date',
    showTime: true,
  },
  {
    key: 'phoneNumber',
    title: '联系人电话',
    compType: 'input',
    dataType: 'tel',
  },
  {
    key: 'posterUrl',
    title: '活动海报',
    compType: 'imagePicker',
    mode: 'multiple',
    ossDir: 'event/',
  },
  {
    key: 'maxCount',
    title: '最多容纳',
    compType: 'input',
    dataType: 'number',
  },
  {
    key: 'deposit',
    title: '订金',
    compType: 'input',
    dataType: 'number',
  },
  {
    key: 'total',
    title: '总价',
    compType: 'input',
    dataType: 'number',
  },
  {
    key: 'storeId',
    title: '场地',
    compType: 'select',
    asyncUrl: '/api/admin/store/option',
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
  const { EventStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = EventStore;


  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '场地名',
      dataIndex: 'storeId.name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      onFilter: (value, record) => record.status === value,
      filters: REVIEW_STATUS_LIST.map((text, index) => ({
        text,
        value: index,
      })),
      render(val) {
        return <Badge status={REVIEW_STATUS_MAP[val]} text={REVIEW_STATUS_MAP[val]} />;
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
            审核
          </a>
        </Fragment>
      ),
    },
  ];

  const handleSearch = (sq) => {
    EventStore.SetAttributeByName('currentPage', 1);
    EventStore.SetAttributeByName('searchQuery', sq);
  };

  const createFormMethods = {
    onOk: (item) => {
      EventStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      EventStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      EventStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  useEffect(() => {
    EventStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          EventStore.DeleteMultipleItems(selectedIds);
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
        store={EventStore}
        columns={columns}
        showCreateBtn
        onCreate={() => {
          setAddVisible(true);
        }}
        type="checkbox"
      >

        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="新建活动"
          {...createFormMethods}
          modalVisible={addVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="更新活动"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核活动"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
