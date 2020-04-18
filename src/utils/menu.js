import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

// Conversion router to menu.
function formatter(props) {
  const {
    data, menu, formatMessage, authority, parentName,
  } = props;
  return data
    .filter((item) => item && item.name && item.path)
    .map((item = { path: '' }) => {
      if (!item.name) {
        return item;
      }
      const { name } = item;
      const locale = `${parentName || 'menu'}.${name}`;
      // if enableMenuLocale use item.name,
      // close menu international
      const localeName = menu.locale || !formatMessage
        ? name
        : formatMessage({ id: locale, defaultMessage: name });
      const result = {
        ...item,
        name: localeName,
        locale,
        routes: null,
      };
      if (item.routes) {
        const children = formatter({
          ...props,
          authority: item.authority || authority,
          data: item.routes,
          parentName: locale,
        });
        // Reduce memory usage
        result.children = children;
      }
      return result;
    });
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * filter menuData
 */
const defaultFilterMenuData = (
  menuData = [],
) => menuData
  .filter((item) => item && item.name && !item.hideInMenu)
  .map((item) => {
    if (
      item.children
        && Array.isArray(item.children)
        && !item.hideChildrenInMenu
        && item.children.some((child) => !!child.name)
    ) {
      const children = defaultFilterMenuData(item.children);
      if (children.length) return { ...item, children };
    }
    return { ...item, children: undefined };
  })
  .filter((item) => item);

/**
 * 获取面包屑映射
 * @param MenuDataItem[] menuData 菜单配置
 */
const getBreadcrumbNameMap = (
  menuData,
) => {
  const routerMap = {};
  const flattenMenuData = (data) => {
    data.forEach((menuItem) => {
      if (!menuItem) {
        return;
      }
      if (menuItem && menuItem.children) {
        // menuItem.routes = menuItem.children;
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(
  getBreadcrumbNameMap,
  isEqual,
);

const getMenuData = (
  routes = [],
  menu = {},
  formatMessage,
  menuDataRender,
) => {
  let originalMenuData = memoizeOneFormatter({
    data: routes,
    formatMessage,
    menu: menu || {
      locale: false,
    },
  });
  if (menuDataRender) {
    originalMenuData = menuDataRender(originalMenuData);
  }
  const menuData = defaultFilterMenuData(originalMenuData);
  const breadcrumb = memoizeOneGetBreadcrumbNameMap(originalMenuData);

  return { breadcrumb, menuData };
};

export {
  getMenuData,
  getBreadcrumbNameMap,
};
