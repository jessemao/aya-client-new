import {
  Badge,
  Divider,
  Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';

import CommonListPage from '../common/CommonListPage';
import FormModal from '../../components/FormModal';
import StepFormModal from '../../components/StepFormModal';
import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';

import {
  REVIEW_STATUS_LIST, REVIEW_STATUS_MAP,
} from '../../constants/status';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { STORE_TYPE_LIST, STORE_TYPE_MAP } from '../../constants';


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

const galleryFormList = [
  {
    key: 'gallery',
    compType: 'imagePicker',
    ossDir: 'store',
    layout: {
      wrapperCol: {
        span: 24,
      },
    },
    mode: 'multiple',
  },
];

const descriptionFormList = [
  {
    key: 'description',
    compType: 'richtext',
    ossDir: 'store_description',
    layout: {
      wrapperCol: {
        span: 24,
      },
    },
  },
];

const stepItemMap = {
  0: [
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
    {
      key: 'secondName',
      title: '名称（En）',
      compType: 'input',
      dataType: 'text',
    },
    {
      key: 'instruction',
      title: '描述',
      compType: 'textarea',
    },
    {
      key: 'logoUrl',
      title: '商标',
      compType: 'imagePicker',
      ossDir: 'store_logo',
    },
    {
      key: 'merchantId._id',
      title: '商家',
      compType: 'select',
      validateRule: {
        rules: [
          {
            required: true,
            message: '必须填写名称',
          },
        ],
      },
      asyncUrl: '/api/admin/merchant/option',
    },
    {
      key: 'type',
      title: '类别',
      compType: 'select',
      allowClear: true,
      option: Object.keys(STORE_TYPE_MAP).map((key) => ({
        key,
        value: STORE_TYPE_MAP[key],
      })),
    },
  ],
  1: [
    {
      key: 'buildingId',
      title: '项目楼',
      compType: 'select',
      asyncUrl: '/api/admin/building/option',
    },
    {
      key: 'address',
      title: '详细地址',
      compType: 'input',
    },
    {
      key: 'phoneNumber',
      title: '联系电话',
      compType: 'input',
      dataType: 'tel',
    },
    {
      key: 'roomSize',
      title: '场地大小',
      compType: 'input',
      dataType: 'number',
    },
    {
      key: 'capacity',
      title: '最多容纳',
      compType: 'input',
      dataType: 'number',
    },
    {
      key: 'reservable',
      title: '是否可预约?',
      compType: 'switch',
    },
  ],
};

const workingHourFormList = [
  {
    key: 'openHour',
    title: '开门时间',
    compType: 'time',
    minuteStep: 30,
    format: 'HH:mm',
  },
  {
    key: 'closeHour',
    title: '关门时间',
    compType: 'time',
    minuteStep: 30,
    format: 'HH:mm',
  },
  {
    key: 'workingHour',
    title: '工作时间',
    mode: 'multiple',
    compType: 'map',
    childComponent: [{
      compType: 'time',
      key: 'startAt',
      placeholder: '开始时间',
      minuteStep: 30,
      format: 'HH:mm',
    }, {
      compType: 'time',
      key: 'endAt',
      placeholder: '结束时间',
      minuteStep: 30,
      format: 'HH:mm',
    }],
  },
  {
    key: 'closeDate',
    title: '放假休息日期',
    compType: 'date',
  },
  {
    key: 'closeWeekday',
    title: '每周休息日',
    compType: 'input',
    dataType: 'number',
    mode: 'multiple',
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
  const { StoreStore, StoreDescriptionStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [workinghourVisible, setWorkinghourVisible] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});
  const [updatedDescValue, setUpdatedDescValue] = useState({});
  const { searchQuery, currentPage, pageSize } = StoreStore;
  const { selectedItem: selectedDescItem } = StoreDescriptionStore;

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
      title: '商家',
      dataIndex: 'merchantId.name',
    },

    {
      title: '类型',
      dataIndex: 'type',
      sorter: (a, b) => a.type - b.type,
      onFilter: (value, record) => record.type === value,
      filters: STORE_TYPE_LIST.map((text, index) => ({
        text,
        value: index,
      })),
      render(val) {
        return <Badge status={STORE_TYPE_LIST[val]} text={STORE_TYPE_LIST[val]} />;
      },
    },
    {
      title: '可预约?',
      dataIndex: 'reservable',
      render(val) {
        return val ? 'Y' : 'N';
      },
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
              setWorkinghourVisible(true);
              return setSelectedItem(record);
            }}
          >
            工作时间
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setDescriptionVisible(true);
              StoreDescriptionStore.FindByStore(record);
              return setSelectedItem(record);
            }}
          >
            详情
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setGalleryVisible(true);
              return setSelectedItem(record);
            }}
          >
            图库
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
    StoreStore.SetAttributeByName('currentPage', 1);
    StoreStore.SetAttributeByName('searchQuery', sq);
  };


  const createFormMethods = {
    onOk: (item) => {
      StoreStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      StoreStore.PutItemRequest(selectedItem._id, updatedValue);
    }
    ,
  };

  const reviewFormMethods = {
    onModalVisible: () => setReviewVisible(false),
    onOk: () => {
      setReviewVisible(false);
      StoreStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  const galleryFormMethods = {
    onModalVisible: () => setGalleryVisible(false),
    onOk: () => {
      setGalleryVisible(false);
      const imageUrls = updatedValue.gallery.map((img) => img.ossUrl);

      StoreStore.PutItemRequest(selectedItem._id, { gallery: imageUrls });
    }
    ,
  };

  const workingHourFormMethods = {
    onModalVisible: () => {
      setWorkinghourVisible(false);
    },
    onOk: (values) => {
      setWorkinghourVisible(false);
      StoreStore.PutItemRequest(selectedItem._id, values);
    },
  };

  const descriptionFormMethods = {
    onModalVisible: () => {
      setDescriptionVisible(false);
    },
    onOk: () => {
      setDescriptionVisible(false);
      StoreDescriptionStore.PutItemByQuery({ storeId: selectedItem._id }, { description: updatedDescValue.description });
    },
  };

  const stepTitle = ['基本信息', '地址'];


  useEffect(() => {
    StoreStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          StoreStore.DeleteMultipleItems(selectedIds);
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
        store={StoreStore}
        columns={columns}
        showCreateBtn
        onCreate={() => {
          setAddVisible(true);
        }}
        type="checkbox"
      >
        <FormModal
          title="工作时间"
          maskClosable={false}
          value={selectedItem}
          formItemList={workingHourFormList}
          {...workingHourFormMethods}
          modalVisible={workinghourVisible}
          onValuesChange={setUpdatedValue}
        />
        <StepFormModal
          width={800}
          formItemMap={stepItemMap}
          showDraftButton={false}
          title="创建场地"
          {...createFormMethods}
          stepTitle={stepTitle}
          modalVisible={addVisible}
          onValuesChange={setUpdatedValue}
        />
        <StepFormModal
          value={selectedItem}
          title="更新场地"
          width={800}
          formItemMap={stepItemMap}
          {...updateFormMethods}
          stepTitle={stepTitle}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          value={selectedItem}
          formItemList={reviewFormList}
          title="审核场地"
          {...reviewFormMethods}
          modalVisible={reviewVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          title="图库"
          value={selectedItem}
          formItemList={galleryFormList}
          {...galleryFormMethods}
          modalVisible={galleryVisible}
          onValuesChange={setUpdatedValue}
        />
        <FormModal
          title="详情"
          width={1000}
          value={selectedDescItem}
          maskClosable={false}
          formItemList={descriptionFormList}
          {...descriptionFormMethods}
          modalVisible={descriptionVisible}
          onValuesChange={setUpdatedDescValue}
        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
