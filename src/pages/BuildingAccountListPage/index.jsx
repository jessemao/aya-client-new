import {
  Divider,
  Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';

import CommonListPage from '../common/CommonListPage';
import FormModal from '../../components/FormModal';
import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';

import PageHeaderWrapper from '../../components/PageHeaderWrapper';

const formItemList = [
  {
    key: 'buildingId._id',
    title: '名称',
    compType: 'select',
    asyncUrl: '/api/admin/building/option',
  },
  {
    key: 'accountId._id',
    title: '用户',
    compType: 'select',
    asyncUrl: '/api/admin/account/option',
  },

];


const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];


export default observer(() => {
  const { BuildingAccountStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const { searchQuery, currentPage, pageSize } = BuildingAccountStore;

  const columns = [
    {
      title: '项目名',
      dataIndex: ['buildingId', 'name'],
    },
    {
      title: '管理员',
      dataIndex: ['accountId', 'basicInfo'],
      render(val) {
        return val.fullname || val.nickName;
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
        </Fragment>
      ),
    },
  ];

  const handleSearch = (sq) => {
    BuildingAccountStore.SetAttributeByName('currentPage', 1);
    BuildingAccountStore.SetAttributeByName('searchQuery', sq);
  };


  const createFormMethods = {
    onOk: (item) => {
      BuildingAccountStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      BuildingAccountStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  useEffect(() => {
    BuildingAccountStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          BuildingAccountStore.DeleteMultipleItems(selectedIds);
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
        store={BuildingAccountStore}
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
          title="创建项目管理关系"
          {...createFormMethods}
          modalVisible={addVisible}
          showCreateBtn
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="更新项目管理关系"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />

      </CommonListPage>
    </PageHeaderWrapper>
  );
});
