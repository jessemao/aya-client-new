import { pathToRegexp } from 'path-to-regexp';
import numeral from 'numeral';
import moment from 'moment';

const getSearchQuery = (key) => {
  const searchUrl = window.location.search;
  if (!searchUrl) {
    return '';
  }

  if (searchUrl.indexOf(key) >= 0) {
    const searchSplits = searchUrl.split('&');
    const urlEncoded = searchSplits.filter((s) => s.indexOf(key) >= 0)[0];
    if (urlEncoded) {
      return decodeURIComponent(urlEncoded.split('=')[1]);
    }
  }
  return '';
};

function getFormInitValue(formList, valueMap = {}) {
  const initValues = {};
  formList.forEach((item) => {
    initValues[item.key] = GetValueByKey(valueMap, item.key);
  });
  return initValues;
}

function getColumnsForModal({ ignoreKeyList = ['_id', 'createdAt', 'updatedAt', '__v', 'index'], titleMap = {}, customKeyProps = {} } = {}) {
  if (!titleMap) {
    return [];
  }
  const columnsOfTitleMap = Object.keys(titleMap).filter((key) => !ignoreKeyList.includes(key)).map((key) => {
    if (!titleMap[key]) {
      return null;
    }
    const keyProps = { ...{ compType: 'input' }, ...customKeyProps[key] };
    return {
      key,
      title: titleMap[key],
      ...keyProps,
    };
  }).filter((itemKey) => !!itemKey);
  return columnsOfTitleMap;
}


function getColumnsForTable({
  ignoreKeyList = ['_id', 'createdAt', 'updatedAt', '__v', 'index'], titleMap = {}, sortList = [], fixedColumnKeyList = [], actionColumn,
} = {}) {
  if (!titleMap) {
    return [];
  }
  const columnsOfTitleMap = Object.keys(titleMap).filter((key) => !ignoreKeyList.includes(key)).map((key) => {
    if (!titleMap[key]) {
      return null;
    }
    let sorter = null;
    if (sortList && sortList.includes(key)) {
      sorter = {
        compare: (a, b) => a[key] - b[key],

      };
    }
    return {
      key,
      dataIndex: key,
      title: titleMap[key],
      render(val) {
        if (typeof val === 'number') {
          return numeral(toFixed(val)).format('0,0');
        }
        if (!isNaN(Date.parse(val))) {
          return moment(val).format('YYYY-MM-DD');
        }
        return val;
      },
      sorter,
      fixed: fixedColumnKeyList && fixedColumnKeyList.includes(key),
    };
  }).filter((itemKey) => !!itemKey);
  if (actionColumn) {
    return columnsOfTitleMap.concat([actionColumn]);
  }
  return columnsOfTitleMap;
}

function debounce(callback, idleTime) {
  let last = null;
  return function (...args) {
    clearTimeout(last);
    last = setTimeout(() => {
      callback(...args);
    }, idleTime);
  };
}

const getUserType = (pathname) => {
  let userType = 'user';
  const pathn = pathname || window.location.pathname;
  if (pathn.indexOf('member') > -1) {
    userType = 'user';
  } else {
    userType = 'employee';
  }
  return userType;
};

const isObject = (obj) => obj.toString() === '[object Object]';

const matchParamsPath = (
  pathname,
  breadcrumb,
) => {
  if (breadcrumb) {
    const pathKey = Object.keys(breadcrumb).find((key) => pathToRegexp(key).test(pathname));
    if (pathKey) {
      return breadcrumb[pathKey];
    }
  }
  return {
    path: '',
  };
};

const getPageTitle = (props) => {
  const {
    pathname,
    breadcrumb,
    formatMessage,
    title = 'NCP签到管理',
    menu = {
      locale: false,
    },
  } = props;


  if (!pathname) {
    return title;
  }
  const currRouterData = matchParamsPath(pathname, breadcrumb);
  if (!currRouterData) {
    return title;
  }
  let pageName = currRouterData.name;
  if (menu.locale && currRouterData.locale) {
    pageName = formatMessage({
      id: currRouterData.locale || '',
      defaultMessage: currRouterData.name,
    });
  }

  if (!pageName) {
    return title;
  }
  return `${pageName} - ${title}`;
};

function urlToList(url) {
  if (url === '/') {
    return ['/'];
  }
  const urlList = url.split('/').filter((i) => i);
  return urlList.map(
    (urlItem, index) => `/${urlList.slice(0, index + 1).join('/')}`,
  );
}

// eslint-disable-next-line no-useless-escape
const URL_REG = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

function isUrl(path: string): boolean {
  return URL_REG.test(path);
}

function ConvertListToTree(list) {
  const treeList = [];
  const idToNodeMap = {}; // Keeps track of nodes using id as key, for fast lookup
  let parentNode = {};

  if (!list || !Array.isArray(list)) {
    return list;
  }

  // loop over data
  list.forEach((item) => {
    idToNodeMap[item._id] = item;

    if (!NotUndefinedOrNull(item.parentId)) {
      treeList.push(item);
    } else {
      parentNode = idToNodeMap[item.parentId];
      if (!parentNode) {
        return;
      }
      if (!parentNode.children) {
        parentNode.children = [];
      }
      delete item.parentId;

      parentNode.children.push(item);
    }
  });
  return treeList;
}

function NotUndefinedOrNull(val) {
  return typeof val !== 'undefined' && val !== null;
}

const MoveItemBackward = (list, index) => {
  if (index === 0) {
    return list;
  }

  const preList = list.slice(0, index - 1);
  const preItem = list[index - 1];
  const currentItem = list[index];
  const sufList = list.slice(index + 1);
  const resList = [...preList, currentItem, preItem, ...sufList];
  return resList;
};

const MoveItemForward = (list, index) => {
  if (index === list.length - 1) {
    return list;
  }

  const preList = list.slice(0, index);
  const currentItem = list[index];
  const nextItem = list[index + 1];
  const sufList = list.slice(index + 2);
  return [...preList, nextItem, currentItem, ...sufList];
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0; const
      // eslint-disable-next-line
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateUploadPath(path, file) {
  return `${path}/${file.name.split('.')[0]}-${file.uid}.${file.type.split('/')[1]}`;
}

function toFixed(floatNumber, fixedCount = 2) {
  const exp = 10 ** fixedCount;
  return Math.round(floatNumber * exp) / exp;
}

function getDynamicStackGroupBarSeries(datasetMap, type) {
  return Object.keys(datasetMap).map((key, index) => {
    const item = {
      name: key,
      type: 'bar',
      encode: {
        x: 'startDate',
        y: 'profit',
      },
      datasetIndex: index,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    };
    if (type === 'stack') {
      return {
        ...item,
        stack: true,
      };
    }
    return item;
  });
}

function getDynamicPieSeries({
  itemName, seriesName = '', radius = '65%', value = 'profit', ...rest
} = {}) {
  const series = [{
    ...{
      name: seriesName,
      type: 'pie',
      radius,
      center: ['40%', '50%'],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      encode: {
        itemName,
        name: itemName,
        value,
        seriesName: itemName,
        label: itemName,
        tooltip: value,
      },
      label: {
        position: 'outer',
        alignTo: 'none',
        bleedMargin: 5,
        formatter: (params) => {
          const {
            name, value: formatVal, dimensionNames, encode: encodeFormatter,
          } = params;
          return `${name} - ${numeral(formatVal[dimensionNames[encodeFormatter.value[0]]]).format('0,0')}`;
        },
      },
    },
    ...rest,
  }];
  return series;
}

function getDynamicBarSeries(options) {
  const series = [{
    ...{
      type: 'bar',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        formatter: (params) => {
          const {
            name, value: formatVal, dimensionNames, encode: encodeFormatter,
          } = params;
          return `${name} - ${numeral(formatVal[dimensionNames[encodeFormatter.value[0]]]).format('0,0')}`;
        },
      },
    },
    ...options,
  }];
  return series;
}

function GetValueByKey(data, key, type) {
  const keySplit = key.split('.');
  let value = data;
  if (!value || !Object.keys(value).length || !NotUndefinedOrNull(value[keySplit[0]])) {
    if (type === 'switch') {
      return !!value[keySplit[0]];
    }
    return undefined;
  }


  keySplit.forEach((ks) => {
    if (Array.isArray(value)) {
      value = value.map((val) => val[ks]);
    } else {
      value = value[ks];
    }
  });

  // in case the value is not string for momentjs
  if (!isNaN(Date.parse(value)) && typeof value !== 'number') {
    value = moment(value);
  }

  return value;
}

function downloadFile(res) {
  const disposition = res.headers['content-disposition'];

  const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length));
  const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  link.remove();
}

export {
  getSearchQuery,
  getUserType,
  isObject,
  generateUploadPath,
  uuidv4,
  matchParamsPath,
  getPageTitle,
  urlToList,
  isUrl,
  ConvertListToTree,
  NotUndefinedOrNull,
  MoveItemBackward,
  MoveItemForward,
  debounce,
  toFixed,
  getFormInitValue,
  getDynamicStackGroupBarSeries,
  getDynamicPieSeries,
  getDynamicBarSeries,
  getColumnsForTable,
  getColumnsForModal,
  GetValueByKey,
  downloadFile,
};
