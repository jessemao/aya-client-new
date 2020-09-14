import {
  Button,
  Card,
  Dropdown,
  Switch,
  Icon,
  Form,
  Row,
  Col,
} from 'antd';
import { ArrowUpOutlined, PlusOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import StandardTable from '../../../components/StandardTable';

import { getComponent } from '../../../utils/component-map';
import styles from './index.module.less';

// const FormItem = Form.Item;

// const getValue = (obj = { }) => Object.keys(obj)
//   .map((key) => obj[key])
//   .join(',');

@observer
class CommonListPage extends Component {
  static defaultProps = {
    loading: false,
    multiActionMenu: [],
    searchItemList: [],
    store: {},
    onCreate: () => {},
    onUpload: () => {},
    onSwitchChange: () => {},
    inReview: false,
    showCreateBtn: false,
    showUploadBtn: false,
    showSwitch: false,
    showOutsideControl: true,
    onShowSizeChange: null,
    onChangePage: null,
    type: 'radio',
  }

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
    };
  }

  handleStandardTableChange = (
    pagination,
    filtersArg,
    sorter,
  ) => {
    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   console.log('filtersArg[key]', filtersArg[key]);
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };

  handleFormReset = () => {
    this.formRef.current.resetFields();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = (rows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(rows);
    }
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = () => {
    const { onSearch, store } = this.props;
    const value = this.formRef.current.getFieldsValue();
    store.SetAttributeByName('currentPage', 1);
    store.SetAttributeByName('searchQuery', value);
    store.Search(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  handleSearchChange = (value, allValue) => {
    this.formRef.current.setFieldsValue(allValue);
  }

  handlePageSizeChange = (page, pageSize) => {
    const { store, onShowSizeChange } = this.props;
    store.SetAttributeByName('pageSize', pageSize);
    if (onShowSizeChange) {
      onShowSizeChange(page, pageSize);
    }
  }

  handleChangePage = (page, pageSize) => {
    const { store, onChangePage } = this.props;
    store.SetAttributeByName('currentPage', page);
    if (onChangePage) {
      onChangePage(page, pageSize);
    }
  }

  renderSearchForm() {
    const { searchItemList } = this.props;
    const { expandForm } = this.state;
    const formList = expandForm ? searchItemList : searchItemList.slice(0, 2);
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handleSearch}
        onValuesChange={this.handleSearchChange}
        layout="horizontal"
      >
        <Row gutter={{ md: 24, lg: 24, xl: 24 }} type="flex">

          {
            formList.map((formItem) => {
              const { title, key, ...rest } = formItem;

              return (
                <Col md={8} sm={12}>
                  {
                    getComponent(rest, { label: title, name: key })
                  }
                </Col>
              );
            })
          }
          <Col md={8} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {expandForm ? '收起' : '展开'}
                <Icon type="down" />
              </a>
            </span>
          </Col>

        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      multiActionMenu,
      store,
      columns,
      title,
      onCreate,
      onUpload,
      inReview,
      onSwitchChange,
      showSwitch,
      showCreateBtn,
      showUploadBtn,
      children,
      searchItemList,
      type,
      showOutsideControl,
      ...rest
    } = this.props;

    const {
      selectedRows,
    } = this.state;

    const {
      currentPage, pageSize, totalCount, itemList,
    } = store;

    return (
      <Card
        bordered={false}
        className={styles.cardWrap}
        bodyStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <div className={styles.tableList}>
          {
            !!searchItemList.length && (
              <div className={styles.tableListForm}>
                {this.renderSearchForm()}
              </div>
            )
          }
          {
            showOutsideControl && (
              <div className={styles.tableListOperator}>
                {
                  showCreateBtn && (
                    <Button
                      type="primary"
                      onClick={onCreate}
                    >
                      <PlusOutlined />
                      新建
                    </Button>
                  )
                }
                {
                  showUploadBtn && (
                    <Button
                      type="primary"
                      onClick={onUpload}
                    >
                      <ArrowUpOutlined />
                      上传
                    </Button>
                  )
                }
                <span>
                  {
                    !!(multiActionMenu && multiActionMenu.length) && (
                    <Dropdown overlay={multiActionMenu}>
                      <Button>
                        更多操作
                        {' '}
                        <Icon type="down" />
                      </Button>
                    </Dropdown>
                    )
                  }
                </span>
                {
                  showSwitch && (
                    <Switch
                      className={styles.switch}
                      checked={inReview}
                      checkedChildren="修改状态"
                      unCheckedChildren="查看"
                      onChange={onSwitchChange}
                    />
                  )
                }
              </div>
            )
          }

          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            rowKey="_id"
            data={itemList}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize,
              total: totalCount,
              onShowSizeChange: this.handlePageSizeChange,
              onChange: this.handleChangePage,
            }}
            type={type}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            {...rest}
          />
        </div>
        {
          children
        }
      </Card>
    );
  }
}

export default CommonListPage;
