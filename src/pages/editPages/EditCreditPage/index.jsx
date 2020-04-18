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
import { CREDIT_MAP } from '../../../constants';

const searchItemList = [
  {
    key: 'bank',
    title: '银行',
    compType: 'input',
    allowClear: true,
  },
  {
    key: 'grantor',
    title: '授信主体',
    compType: 'input',
    allowClear: true,
  },
];

const uploadFormList = [
  {
    key: 'uploadFile',
    name: 'uploadFile',
    compType: 'file',
    uploadUrl: '/api/admin/credit/upload',
    fileType: ['xlsx', 'csv'],
    layout: {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    },
  },
];

const updateFormList = getColumnsForModal({
  titleMap: CREDIT_MAP,
  customKeyProps: {
    dateOfExpire: { compType: 'date' },
    amountTotal: { dataType: 'number' },
    amountTotalReserved: { dataType: 'number' },
    amountTotalLoc: { dataType: 'number' },
    amountTotalTTCurrencyExchange: { dataType: 'number' },
    amountTotalStandbyLoc: { dataType: 'number' },
    amountTotalGuaranty: { dataType: 'number' },
    amountTotalFloatingLoan: { dataType: 'number' },
  },
});

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
  {
    key: 'download-template',
    title: '下载数据模板',
  },
  {
    key: 'download-selection',
    title: '下载选中',
  },
  {
    key: 'download-all',
    title: '下载全部',
  },
];

export default observer(() => {
  const { CreditStore } = useStores();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [uploadRefresh, setUploadRefresh] = useState(false);
  const [updatedValue, setUpdatedValue] = useState({});
  const {
    searchQuery, currentPage, pageSize,
  } = CreditStore;

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
    titleMap: CREDIT_MAP, fixedColumnKeyList: ['bank', 'grantor'], sortList: ['dateOfExpire', 'amountTotal', 'expireDay', 'dateOfPayment'], actionColumn,
  });

  useEffect(() => {
    CreditStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (uploadRefresh) {
      CreditStore.Search(searchQuery);
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
          CreditStore.DeleteMultipleItems(selectedIds);
        },
      });
    } else if (multiActionKey === 'download-template') {
      CreditStore.DownloadTemplate();
    } else if (multiActionKey === 'download-selection') {
      const selectedIds = selectedRows.map((row) => row._id);
      if (!selectedIds.length) {
        Modal.info({
          title: '无法下载',
          content: '尚未选中想要下载的数据',
        });
      } else {
        CreditStore.DownloadData({ _id: selectedIds });
      }
    } else if (multiActionKey === 'download-all') {
      CreditStore.DownloadData({}, { downloadAll: true });
    }
    setMultiActionKey('');
  }, [multiActionKey]);

  const handleSearch = (sq) => {
    CreditStore.SetAttributeByName('currentPage', 1);
    CreditStore.SetAttributeByName('searchQuery', sq);
  };

  const uploadFormMethods = {
    onModalVisible: () => setUploadVisible(false),
    onOk: () => setUploadVisible(false),
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      CreditStore.PutItemRequest(selectedItem._id, updatedValue);
      setUpdateVisible(false);
    },
  };

  return (
    <PageHeaderWrapper>
      <CommonListPage
        searchItemList={searchItemList}
        multiActionMenu={(
          <MultiActionMenu
            onClick={setMultiActionKey}
            menuList={multiMenuList}
          />
        )}
        onSearch={handleSearch}
        onSelectRow={setSelectedRows}
        showCreateBtn={false}
        onUpload={() => {
          setUploadVisible(true);
        }}
        showUploadBtn
        store={CreditStore}
        columns={columns}
        scroll={{ x: 1800 }}
        type="checkbox"
      />
      <FormModal
        title="上传授信"
        maskClosable={false}
        onValuesChange={() => {
          setUploadRefresh(true);
        }}
        formItemList={uploadFormList}
        {...uploadFormMethods}
        modalVisible={uploadVisible}
      />
      <FormModal
        title="修改授信信息"
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
