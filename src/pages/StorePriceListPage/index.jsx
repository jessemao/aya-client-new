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

import {
  REVIEW_STATUS_MAP,
} from '../../constants/status';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';


const searchItemList = [
  {
    key: 'name',
    title: '名称',
    compType: 'input',
    allowClear: true,
    placeholder: '输入场地名',
  },
  {
    key: 'address',
    title: '地址',
    compType: 'input',
    allowClear: true,
    placeholder: '输入场地地址',
  },

];

const reviewFormList = [
  {
    key: 'storeId.name',
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
  const { StorePriceStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const {
    searchQuery, currentPage, pageSize, typeByMember, typeByTime,
  } = StorePriceStore;

  const formItemList = [
    {
      key: 'storeId._id',
      title: '场地',
      compType: 'select',
      validateRule: {
        rules: [
          {
            required: true,
            message: '必须选择',
          },
        ],
      },
      asyncUrl: '/api/admin/store/option',
    },
    {
      key: 'name',
      title: '名称',
      compType: 'input',
      validateRule: {
        rules: [
          {
            required: true,
            message: '必须填写名称',
          },
        ],
      },
      dataType: 'text',
    },
    // {
    //   key: 'secondName',
    //   title: '名称（En）',
    //   compType: 'input',
    //   dataType: 'text',
    // },
    {
      key: 'price',
      title: '价格',
      precision: '2',
      compType: 'input',
      dataType: 'number',
    },

    {
      key: 'typeByMember',
      title: '客户分类',
      compType: 'select',
      option: typeByMember,
      allowClear: true,
    },
    {
      key: 'typeByTime',
      title: '用时分类',
      compType: 'select',
      option: typeByTime,
      allowClear: true,
    },
    {
      key: 'isWorkingHours',
      title: '是否工作时间？',
      compType: 'switch',
    },
    {
      key: 'isDeposit',
      title: '订金？',
      compType: 'switch',
    },
  ];

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render(val, record) {
        // return <Link to={`${SUB_NAV_ROUTES.STORE_INFO.path}?id=${record._id}`}>{val}</Link>;
        return val;
      },
    },
    {
      title: '场地',
      dataIndex: ['storeId', 'name'],
    },
    {
      title: '用户类别',
      dataIndex: 'typeByMember',
      render(val) {
        const res = typeByMember.find((item) => `${item.key}` === `${val}`);
        if (res) {
          return res.value;
        }
        return res;
      },
    },
    {
      title: '时间类别',
      dataIndex: 'typeByTime',
      render(val) {
        const res = typeByTime.find((item) => `${item.key}` === `${val}`);
        if (res) {
          return res.value;
        }
        return res;
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '工作时间？',
      dataIndex: 'isWorkingHours',
      render(val) {
        return val ? 'Y' : 'N';
      },
    },
    {
      title: '订金',
      dataIndex: 'isDeposit',
      render(val) {
        return val ? 'Y' : 'N';
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
    StorePriceStore.SetAttributeByName('currentPage', 1);
    StorePriceStore.SetAttributeByName('searchQuery', sq);
  };


  const createFormMethods = {
    onOk: (item) => {
      StorePriceStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      StorePriceStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      StorePriceStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  useEffect(() => {
    StorePriceStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    StorePriceStore.FetchTypeOption('typeByMember');
    StorePriceStore.FetchTypeOption('typeByTime');
  }, []);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          StorePriceStore.DeleteMultipleItems(selectedIds);
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
        store={StorePriceStore}
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
          title="新建场地价格"
          {...createFormMethods}
          modalVisible={addVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={formItemList}
          title="更新场地价格"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核场地价格"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
