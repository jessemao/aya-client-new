import {
  Badge,
  // Divider,
  // Modal,
} from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';

import moment from 'moment';
import CommonListPage from '../common/CommonListPage';
// import FormModal from '../../components/FormModal';
// import MultiActionMenu from '../../components/MultiActionMenu';
import { useStores } from '../../stores/hook';

import {
  EVENT_USER_STATUS_LIST, EVENT_USER_STATUS,
} from '../../constants/status';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';


const searchItemList = [
  {
    key: 'eventId',
    title: '活动',
    compType: 'select',
    allowClear: true,
    asyncUrl: '/api/admin/event/option',
  },
];


export default observer(() => {
  const { EventAttendeeStore } = useStores();
  // const [selectedItem, setSelectedItem] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const { searchQuery, currentPage, pageSize } = EventAttendeeStore;

  const columns = [
    {
      title: '活动名',
      dataIndex: ['eventId', 'name'],
    },
    {
      title: '姓名',
      dataIndex: ['attendeeId', 'basicInfo'],
      render(value) {
        if (value) {
          return value.fullname || value.nickName;
        }
        return null;
      },
    },
    {
      title: '电话',
      dataIndex: ['attendeeId', 'basicInfo', 'phoneNumber'],
    },
    {
      title: '报名时间',
      dataIndex: 'updatedAt',
      render(val) {
        return moment(val).format('YYYY-MM-DD hh:mm');
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      onFilter: (value, record) => record.status === value,
      filters: EVENT_USER_STATUS_LIST.map((text, index) => ({
        text,
        value: index,
      })),
      render(val) {
        return <Badge status={EVENT_USER_STATUS[val]} text={EVENT_USER_STATUS[val]} />;
      },
    },
  ];

  const handleSearch = (sq) => {
    EventAttendeeStore.SetAttributeByName('currentPage', 1);
    EventAttendeeStore.SetAttributeByName('searchQuery', sq);
  };


  useEffect(() => {
    EventAttendeeStore.Search(searchQuery);
  }, [JSON.stringify(searchQuery), currentPage, pageSize]);


  return (
    <PageHeaderWrapper>
      <CommonListPage
        searchItemList={searchItemList}
        onSearch={handleSearch}
        onSelectRow={setSelectedRows}
        store={EventAttendeeStore}
        columns={columns}
        type="checkbox"
      />
    </PageHeaderWrapper>
  );
});
