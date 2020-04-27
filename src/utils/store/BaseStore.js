import {
  observable, action, configure, runInAction,
} from 'mobx';
import fetch from 'axios';
import { FormatRequestData } from '../format';
import asyncFeedback from '../../components/basic/async-feedback';
import { ConvertListToTree, downloadFile } from '..';
import History from '../../components/History';

configure({ enforceActions: 'always' });

class BaseStore {
  @observable selectedItem = {
    _id: null,
  };

  @observable hasAccess = false;

  @observable itemList = [];

  @observable itemListFlat = [];

  @observable currentPage = 1;

  @observable pageSize = 10;

  @observable totalCount = 0;

  @observable searchQuery = {};

  @action SetAttributeByName(name, value) {
    this[name] = value;
  }

  @action SetSelectedItemByFilter = async (query) => {
    this.selectedItem = this.itemListFlat.find((item) => {
      let isFind = true;
      Object.keys(query).forEach((key) => {
        if (item[key] !== query[key]) {
          isFind = false;
        }
      });
      return isFind;
    });
    if (!(this.selectedItem && this.selectedItem._id)) {
      await this.FetchItemByQuery(query);
    }
  }

  @action SetSelectedItemById = async (id) => {
    const pickValue = this.itemListFlat.find((item) => item._id === id);
    if (!(pickValue && pickValue._id)) {
      await this.FetchItem(id);
    } else {
      this.selectedItem = pickValue;
    }
  }

  @action SetSelectedItem = (selectedItem, shouldReplace) => {
    if (shouldReplace || (selectedItem && !Object.keys(selectedItem).length)) {
      this.selectedItem = { ...selectedItem };
    } else {
      this.selectedItem = { ...this.selectedItem, ...selectedItem };
    }
  }

  @action handleErrors = (res, { shouldRedirect = false } = {}) => {
    console.log('res', res.response);

    const errMsg = (res.response ? (res.response.data.message || res.response.data) : res.message) || res.data.errorMsg;
    this.hasAccess = res.status === 401;
    if (!this.hasAccess && shouldRedirect) {
      History.push('/no-access');
    }
    asyncFeedback.error(errMsg);
  }

  @action updateTableList = (tempData) => {
    if (tempData.pageSize) {
      this.itemListFlat = tempData.data;

      this.itemList = ConvertListToTree(this.itemListFlat);
      this.itemList = this.itemList.map((item, idx) => {
        const temp = { ...item };
        temp.index = ((tempData.currentPage - 1) * tempData.pageSize) + idx + 1;
        return temp;
      });
      this.currentPage = tempData.currentPage;
      this.pageSize = tempData.pageSize;
      this.totalCount = tempData.total;
    } else {
      this.itemListFlat = tempData;
      this.itemList = ConvertListToTree(tempData);
    }
    return {
      itemListFlat: this.itemListFlat,
      itemList: this.itemList,
    };
  }

  @action FetchItemByQuery = async (query, { withPagination = false } = {}) => {
    const res = await this.fetchList(query, { withPagination });
    if (!res) {
      return null;
    }
    runInAction(() => {
      if (this.onFetchItem) {
        this.onFetchItem(res.data.data);
      } else {
        this.selectedItem = res.data.data[0] || {};
      }
    });
    return res;
  }

  @action FetchItem = async (id, { urlPrefix } = {}) => {
    let res = {};
    const apiUrlPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;
    try {
      res = await fetch({
        method: 'GET',
        url: `/api/admin/${apiUrlPrefix}/${id}`,
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res);
      } else {
        this.selectedItem = res.data.data;
      }
    });
  }

  fetchList = async (query, { withPagination = true, options, urlPrefix } = {}) => {
    let res = {};
    const { currentPage = 1, pageSize = 20 } = this;
    let params = { ...query };
    if (withPagination) {
      params = {
        ...params,
        options,
        pagination: {
          currentPage,
          pageSize,
        },
      };
    }

    const apiPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;

    try {
      res = await fetch({
        method: 'GET',
        url: `/api/admin/${apiPrefix}`,
        params,
      });
    } catch (e) {
      res = e;
    }

    if (res.status !== 200 || !res.data.success) {
      this.handleErrors(res);
      return null;
    }

    return res;
  }

  @action FetchItemList = async (query, {
    withPagination = true,
    options,
    urlPrefix,
  } = {}) => {
    const res = await this.fetchList(query, {
      withPagination,
      options,
      urlPrefix,
    });
    if (!res) {
      return null;
    }
    runInAction(() => {
      const tempData = res.data.data;
      this.updateTableList(tempData);
      if (this.onFetchItemList) {
        this.onFetchItemList(tempData);
      }
    });
    return res;
  }

  @action AsyncReviewMultipleItems = async (selectedIds, { urlPrefix } = {}) => {
    let res = {};
    const apiPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;

    try {
      res = await fetch({
        method: 'PUT',
        url: `/api/admin/${apiPrefix}/review`,
        data: {
          idList: selectedIds,
          status: 1,
          pagination: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          },
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res, { shouldRedirect: false });
      } else {
        asyncFeedback.success('Succeed!');
        this.updateTableList(res.data.data);

        if (this.onPutItem) {
          this.onPutItem();
        }
      }
    });
  }

  @action DeleteMultipleItems = async (selectedIds, { urlPrefix } = {}) => {
    let res = {};
    const apiPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;

    try {
      res = await fetch({
        method: 'DELETE',
        url: `/api/admin/${apiPrefix}`,
        data: {
          idList: selectedIds,
          pagination: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          },
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res, { shouldRedirect: false });
      } else {
        asyncFeedback.success('Succeed!');
        this.itemList = this.itemList.filter((item) => !selectedIds.includes(item._id));
      }
    });
  }

  @action DownloadTemplate = async () => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/admin/${this.urlPrefix}/download/template`,
        method: 'GET',
        responseType: 'arraybuffer',
      });
    } catch (error) {
      res = error;
    }

    if (res.status !== 200 || !res.data) {
      this.handleErrors(res);
      return null;
    }
    downloadFile(res);
  }

  @action DownloadData = async (query, options) => {
    let res = {};
    try {
      res = await fetch({
        url: `/api/admin/${this.urlPrefix}/download`,
        method: 'GET',
        responseType: 'arraybuffer',
        params: {
          ...query,
          options,
        },
      });
    } catch (error) {
      res = error;
    }

    if (res.status !== 200 || !res.data) {
      this.handleErrors(res);
      return null;
    }
    downloadFile(res);
  }


  @action PutItemByQuery = async (query, putData, { urlPrefix } = {}) => {
    const data = putData || this.selectedItem;
    const formatData = FormatRequestData(data);
    const apiPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;

    let res = {};
    try {
      res = await fetch({
        method: 'PUT',
        url: `/api/admin/${apiPrefix}`,
        data: {
          query,
          data: formatData,
        },
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res, { shouldRedirect: false });
      } else if (this.onPutItem) {
        this.onPutItem(res.data.data);
      } else {
        asyncFeedback.success('Succeed!');
        this.selectedItem = res.data.data;
      }
    });
  }

  @action PutItemRequest = async (id, putData, { withPagination = false, urlPrefix } = {}) => {
    const data = putData || this.selectedItem;
    const formatData = FormatRequestData(data);
    const apiPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;

    const itemId = id || data._id;

    delete data._id;
    const requestData = withPagination ? ({
      ...formatData,
      pagination: {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      },
    }) : formatData;

    let res = {};
    try {
      res = await fetch({
        method: 'PUT',
        url: `/api/admin/${apiPrefix}/${itemId}`,
        data: requestData,
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res, { shouldRedirect: false });
      } else if (this.onPutItem) {
        this.onPutItem(res.data.data);
      } else {
        asyncFeedback.success('Succeed!');
        if (withPagination) {
          this.updateTableList(res.data.data);
        } else {
          this.selectedItem = res.data.data;
        }
      }
    });
  }

  @action PostItemRequest = async (postData, { withPagination = false, urlPrefix } = {}) => {
    const data = postData || this.selectedItem;
    const formatData = FormatRequestData(data);

    const apiPrefix = urlPrefix ? `${urlPrefix}` : `${this.urlPrefix}`;


    const requestData = withPagination ? ({
      ...formatData,
      pagination: {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      },
    }) : formatData;

    let res = {};
    try {
      res = await fetch({
        method: 'POST',
        url: `/api/admin/${apiPrefix}`,
        data: requestData,
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (e) {
      res = e;
    }

    runInAction(() => {
      if (res.status !== 200 || !res.data.success) {
        this.handleErrors(res, { shouldRedirect: false });
      } else {
        asyncFeedback.success('Succeed!');

        // if (withPagination) {
        //   this.updateTableList(res.data.data);
        // } else {
        //   this.itemList = [...this.itemList, res.data.data];
        //   this.itemListFlat = [...this.itemList, res.data.data];
        // }
        this.selectedItem = res.data.data;

        if (this.onPostItem) {
          this.onPostItem(res.data.data);
        }
      }
    });
    this.Search();
  }

  @action Search = async (query = this.searchQuery, { urlPrefix = '' } = {}) => {
    this.searchQuery = this.getValidValue(query);
    const urlPrefixFinal = urlPrefix || this.urlPrefix;
    this.FetchItemList(this.searchQuery, { urlPrefix: `${urlPrefixFinal}/search` });
  }

  getValidValue(query) {
    const newQuery = {};

    Object.keys(query).forEach((key) => {
      if (query[key]) {
        if (typeof query[key] === 'string') {
          newQuery[key] = query[key].replace(' ', '').trim();
        } else {
          newQuery[key] = query[key];
        }
      }
    });
    return newQuery;
  }
}

export default BaseStore;
