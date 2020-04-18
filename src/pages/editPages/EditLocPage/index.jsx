/* eslint-disable react/jsx-fragments */
import {
  Select,
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
import { CREDIT_MAP, LOC_MAP } from '../../../constants';

const searchItemList = [
  {
    key: 'bank',
    title: '银行',
    compType: 'input',
    allowClear: true,
  },
  {
    key: 'beneficiary',
    title: '客户',
    compType: 'input',
    allowClear: true,
  },
];

const uploadFormList = [
  {
    key: 'uploadFile',
    name: 'uploadFile',
    compType: 'file',
    uploadUrl: '/api/admin/loc/upload',
    fileType: ['xlsx', 'csv'],
    layout: {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    },
  },
];

const updateFormList = getColumnsForModal({
  titleMap: LOC_MAP,
  customKeyProps: {
    dateOfIssue: { compType: 'date' },
    dateOfExpire: { compType: 'date' },
    dateOfReceiveDeclaration: { compType: 'date' },
    dateOfAcceptance: { compType: 'date' },
    dateOfPayment: { compType: 'date' },
    amountUSD: { dataType: 'number' },
    guarantyAmount: { dataType: 'number' },
    issueFee: { dataType: 'number' },
    rateOfIssueFee: { dataType: 'number', precision: 2 },
    acceptanceFee: { dataType: 'number' },
    rateOfAcceptance: { dataType: 'number', precision: 2 },
    changesFee: { dataType: 'number' },
    confirmationFee: { dataType: 'number' },
    rateOfConfirmationFee: { dataType: 'number', precision: 2 },
    otherFees: { dataType: 'number' },
  },
});

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];

export default observer(() => {
  const { LetterOfCreditStore } = useStores();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [uploadRefresh, setUploadRefresh] = useState(false);
  const [updatedValue, setUpdatedValue] = useState({});
  const {
    searchQuery, currentPage, pageSize,
  } = LetterOfCreditStore;

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
    titleMap: LOC_MAP, fixedColumnKeyList: ['bank', 'beneficiary'], sortList: ['dateOfExpire', 'amountUSD', 'dateOfPayment'], actionColumn,
  });

  useEffect(() => {
    LetterOfCreditStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (uploadRefresh) {
      LetterOfCreditStore.Search(searchQuery);
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
          LetterOfCreditStore.DeleteMultipleItems(selectedIds);
        },
      });
    }
    setMultiActionKey('');
  }, [multiActionKey]);

  const handleSearch = (sq) => {
    LetterOfCreditStore.SetAttributeByName('currentPage', 1);
    LetterOfCreditStore.SetAttributeByName('searchQuery', sq);
  };

  const uploadFormMethods = {
    onModalVisible: () => setUploadVisible(false),
    onOk: () => setUploadVisible(false),
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      LetterOfCreditStore.PutItemRequest(selectedItem._id, updatedValue);
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
        store={LetterOfCreditStore}
        columns={columns}
        scroll={{ x: 3800 }}
        type="checkbox"
      />
      <FormModal
        title="上传信用证数据"
        maskClosable={false}
        onValuesChange={() => {
          setUploadRefresh(true);
        }}
        formItemList={uploadFormList}
        {...uploadFormMethods}
        modalVisible={uploadVisible}
      />
      <FormModal
        title="修改信用证数据信息"
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
