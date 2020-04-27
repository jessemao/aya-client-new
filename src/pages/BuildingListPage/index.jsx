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

const formItemList = [
  {
    key: 'name',
    title: '名称',
    compType: 'input',
    dataType: 'text',
  },
  {
    key: 'address',
    title: '地址',
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
    key: 'floors',
    title: '楼层',
    compType: 'input',
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
  const { BuildingStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = BuildingStore;

  const columns = [
    {
      title: '项目名',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '楼层',
      dataIndex: 'floors',
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
    BuildingStore.SetAttributeByName('currentPage', 1);
    BuildingStore.SetAttributeByName('searchQuery', sq);
  };


  const createFormMethods = {
    onOk: (item) => {
      BuildingStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      BuildingStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      BuildingStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  useEffect(() => {
    BuildingStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          BuildingStore.DeleteMultipleItems(selectedIds);
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
        onSearch={handleSearch}
        onSelectRow={setSelectedRows}
        store={BuildingStore}
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
          title="创建项目"
          {...createFormMethods}
          modalVisible={addVisible}
          showCreateBtn
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="更新项目"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核项目"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
