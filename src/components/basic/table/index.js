import React, { Component } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { propertiesToTableColumn } from '../../../utils/react-utils';

import './index.css';

class CustomTable extends Component {
  static defaultProps = {
    columnConfig: {
      useDefaultAction: true,
    },
  }

  formatColumns() {
    const {
      editPageLink, columnConfig = {}, tableProps,
    } = this.props;

    const newColumns = propertiesToTableColumn(tableProps, columnConfig);

    if (columnConfig.useDefaultAction && !columnConfig.customAction) {
      newColumns.push(
        {
          title: 'Action',
          key: 'action',
          width: 100,
          fixed: 'right',
          render: (text, record) => (
            <span>
              <Link to={`${editPageLink}?id=${record._id}`}>编辑</Link>
            </span>
          ),
        },
      );
    }

    if (columnConfig.customAction) {
      newColumns.push(columnConfig.customAction);
    }

    return newColumns;
  }

  render() {
    const {
      dataSource, rowKey, className, value, title, ...others
    } = this.props;

    const tableData = dataSource || value;

    const newColumns = this.formatColumns();
    const classes = classNames(className, 'item-list__table');
    if (!tableData) {
      return null;
    }
    return (
      <Table
        className={classes}
        columns={newColumns}
        dataSource={tableData}
        rowKey={rowKey}
        size="small"
        scroll={{ x: 1300 }}
        {...others}
      />
    );
  }
}

export default CustomTable;
