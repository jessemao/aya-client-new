/* eslint-disable react/jsx-fragments */
import {
  Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';

import CommonListPage from '../../common/CommonListPage';
import FormModal from '../../../components/FormModal';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import MultiActionMenu from '../components/MultiActionMenu';
import { useStores } from '../../../stores/hook';
import { getColumnsForTable, getColumnsForModal } from '../../../utils';
import { EXPOSURE_MAP } from '../../../constants';

const searchItemList = [
  {
    key: 'bank',
    title: '银行',
    compType: 'input',
    allowClear: true,
  },
  {
    key: 'type',
    title: '产品类型',
    compType: 'input',
    allowClear: true,
  },
];

const uploadFormList = [
  {
    key: 'uploadFile',
    name: 'uploadFile',
    compType: 'file',
    uploadUrl: '/api/admin/exposure/upload',
    fileType: ['xlsx', 'csv'],
    layout: {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    },
  },
];

const updateFormList = getColumnsForModal({
  titleMap: EXPOSURE_MAP,
  customKeyProps: {
    dateOfIssue: { compType: 'date' },
    dateOfExpire: { compType: 'date' },
    dateOfPayment: { compType: 'date' },
    amountCNY: { dataType: 'number' },
    amountUSD: { dataType: 'number' },
    rateOfInterests: { dataType: 'number', precision: 2 },
    paymentTermInMonth: { dataType: 'number' },
    guarantyAmount: { dataType: 'number' },
    interests: { dataType: 'number', precision: 2 },
  },
});

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];

export default observer(() => {
  const { ExposureStore } = useStores();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [uploadRefresh, setUploadRefresh] = useState(false);
  const [updatedValue, setUpdatedValue] = useState({});
  const {
    searchQuery, currentPage, pageSize,
  } = ExposureStore;

  const actionColumn = {
    title: '操作',
    fixed: 'right',
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
  };

  const columns = getColumnsForTable({
    titleMap: EXPOSURE_MAP, fixedColumnKeyList: ['bank', 'type'], sortList: ['dateOfExpire', 'dateOfIssue', 'dateOfPayment', 'amountCNY', 'amountUSD', 'rateOfInterests', 'paymentTermInMonth'], actionColumn,
  });

  useEffect(() => {
    ExposureStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (uploadRefresh) {
      ExposureStore.Search(searchQuery);
      setUploadRefresh(false);
    }
  }, [uploadRefresh]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          ExposureStore.DeleteMultipleItems(selectedIds);
        },
      });
    }
    setMultiActionKey('');
  }, [multiActionKey]);

  const handleSearch = (sq) => {
    ExposureStore.SetAttributeByName('currentPage', 1);
    ExposureStore.SetAttributeByName('searchQuery', sq);
  };

  const uploadFormMethods = {
    onModalVisible: () => setUploadVisible(false),
    onOk: () => setUploadVisible(false),
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      ExposureStore.PutItemRequest(selectedItem._id, updatedValue);
      setUpdateVisible(false);
    },
  };

  return (
    <PageHeaderWrapper>
      <CommonListPage
        searchItemList={searchItemList}
        multiActionMenu={<MultiActionMenu onClick={setMultiActionKey} menuList={multiMenuList} />}
        onSearch={handleSearch}
        onSelectRow={setSelectedRows}
        showCreateBtn={false}
        onUpload={() => {
          setUploadVisible(true);
        }}
        showUploadBtn
        store={ExposureStore}
        columns={columns}
        scroll={{ x: 1800 }}
        type="checkbox"
      />
      <FormModal
        title="上传敞口"
        maskClosable={false}
        onValuesChange={() => {
          setUploadRefresh(true);
        }}
        formItemList={uploadFormList}
        {...uploadFormMethods}
        modalVisible={uploadVisible}
      />
      <FormModal
        title="修改敞口信息"
        maskClosable={false}
        width={800}
        value={selectedItem}
        formItemList={updateFormList}
        {...updateFormMethods}
        modalVisible={updateVisible}
        onValuesChange={setUpdatedValue}
      />
    </PageHeaderWrapper>
  );
});
