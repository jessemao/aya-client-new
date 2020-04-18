import { pathToRegexp } from 'path-to-regexp';

import { urlToList } from '../../utils';

export const getFlatMenuKeys = (menuData) => {
  let keys = [];
  menuData.forEach((item) => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

export const getMenuMatches = (
  flatMenuKeys,
  path,
) => flatMenuKeys.filter((item) => item && pathToRegexp(item).test(path));

export const getDefaultCollapsedSubMenus = (props) => {
  const { location = { pathname: '/' }, flatMenuKeys } = props;
  return urlToList(location.pathname)
    .map((item) => getMenuMatches(flatMenuKeys, item)[0])
    .filter((item) => item)
    .reduce((acc, curr) => [...acc, curr], ['/']);
};
