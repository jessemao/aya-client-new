/* eslint-disable react/jsx-fragments */
import {
  Divider,
  Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';

// import { Link } from 'react-router-dom';
import CommonListPage from '../common/CommonListPage';
import FormModal from '../../components/FormModal';
import StepFormModal from '../../components/StepFormModal';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';

import {
  ROLE_OPTION,
  ACCOUNT_KEY_VALUE,
} from '../../constants/status';


const roleItemList = [
  {
    key: 'role',
    title: '角色',
    compType: 'select',
    option: ROLE_OPTION,
  },
];

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
    key: 'role',
    title: '角色',
    compType: 'select',
    option: ROLE_OPTION,
  },
];

const userInfoItemList = {
  0: [
    {
      key: 'username',
      title: '用户名',
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
      key: 'email',
      title: '邮箱',
      compType: 'input',
      dataType: 'text',
    },
    {
      key: 'phoneNumber',
      title: '电话',
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
      key: 'lastname',
      title: '姓',
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
      key: 'firstname',
      title: '名',
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
  ],
  1: [
    {
      key: 'password',
      title: '初始密码',
      compType: 'input',
      type: 'password',
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
      key: 'needResetPassword',
      title: '初次登陆后重置密码？',
      compType: 'switch',
    },
  ],
  2: [
    {
      key: 'role',
      title: '角色',
      compType: 'select',
      option: ROLE_OPTION,
    },

  ],
};

const pwdItemList = [
  {
    key: 'password',
    title: '修改密码',
    compType: 'input',
    type: 'password',
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
    key: 'needResetPassword',
    title: '登陆后重置密码？',
    compType: 'switch',
  },
];

const multiMenuList = [
  {
    key: 'delete',
    title: '删除',
  },
];

const stepTitle = ['基本信息', '密码', '其他'];
const updateStepTitle = ['基本信息'];

const updateStepForm = {
  0: userInfoItemList[0],
};

export default observer(() => {
  const { AccountStore } = useStores();
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [multiActionKey, setMultiActionKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedValue, setUpdatedValue] = useState({});

  const { searchQuery, currentPage, pageSize } = AccountStore;

  const columns = [
    {
      title: '用户名',
      dataIndex: ['basicInfo', 'username'],
    },
    {
      title: '姓名(昵称)',
      dataIndex: ['basicInfo', 'fullname'],
      render(val, record) {
        let displayValue = val;
        if (record.basicInfo) {
          if (record.basicInfo.fullname) {
            displayValue = record.basicInfo.fullname;
          }
        }
        return displayValue;
      },
    },
    {
      title: '电话',
      dataIndex: ['basicInfo', 'phoneNumber'],
    },
    {
      title: '角色',
      dataIndex: 'role',
      render(val) {
        return ACCOUNT_KEY_VALUE[val];
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
              setRoleVisible(true);
              return setSelectedItem(record);
            }}
          >
            权限
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setPwdVisible(true);
              return setSelectedItem(record);
            }}
          >
            更改密码
          </a>
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    AccountStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);

  useEffect(() => {
    if (multiActionKey === 'delete') {
      Modal.confirm({
        title: '是否删除',
        content: `是否确认删除您已选中的${selectedRows.length}条数据`,
        onOk: () => {
          const selectedIds = selectedRows.map((row) => row._id);
          AccountStore.DeleteMultipleItems(selectedIds);
        },
      });
    }
    setMultiActionKey('');
  }, [multiActionKey]);


  const createFormMethods = {
    onOk: (item) => {
      AccountStore.PostItemRequest(item);
      setAddVisible(false);
    },
    onModalVisible: () => setAddVisible(false)
    ,
  };

  const updateFormMethods = {
    onModalVisible: () => setUpdateVisible(false),
    onOk: () => {
      setUpdateVisible(false);
      const {
        basicInfo, userBasicId, employeeBasicId, openidWeapp, unionidWechat, createdAt, updatedAt, status, _id, ...rest
      } = updatedValue;
      const updateInfo = { ...basicInfo, ...rest };
      AccountStore.PutItemRequest(selectedItem._id, updateInfo);
    }
    ,
  };

  const passwordFormMethods = {
    onModalVisible: () => setPwdVisible(false),
    onOk: () => {
      setPwdVisible(false);
      AccountStore.ResetPassword({ accountId: selectedItem._id, password: updatedValue.password });
    }
    ,
  };

  const roleFormMethods = {
    onModalVisible: () => setRoleVisible(false),
    onOk: () => {
      setRoleVisible(false);
      AccountStore.PutItemRequest(selectedItem._id, updatedValue);
    },
  };

  const { basicInfo, ...rest } = selectedItem;
  const flattedItem = { ...basicInfo, ...rest };

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
        onSelectRow={setSelectedRows}
        showCreateBtn
        onCreate={() => {
          setAddVisible(true);
        }}
        store={AccountStore}
        columns={columns}
        type="checkbox"
      >
        <StepFormModal
          formItemMap={userInfoItemList}
          stepTitle={stepTitle}
          title="新建用户"
          {...createFormMethods}
          modalVisible={addVisible}
          onValuesChange={setUpdatedValue}
        />

        <StepFormModal
          value={flattedItem}
          formItemMap={updateStepForm}
          stepTitle={updateStepTitle}
          title="更新用户"
          {...updateFormMethods}
          modalVisible={updateVisible}
          onValuesChange={setUpdatedValue}

        />
        <FormModal
          value={flattedItem}
          formItemList={pwdItemList}
          {...passwordFormMethods}
          modalVisible={pwdVisible}
          onValuesChange={setUpdatedValue}

        />
        <FormModal
          value={flattedItem}
          formItemList={roleItemList}
          {...roleFormMethods}
          modalVisible={roleVisible}
          onValuesChange={setUpdatedValue}

        />
      </CommonListPage>
    </PageHeaderWrapper>
  );
});
