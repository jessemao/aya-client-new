import { isObject, NotUndefinedOrNull } from '.';

function keyToNestedObject(stringKey, value) {
  const stringSplits = stringKey.split('.').reverse();
  const nestedObj = stringSplits.reduce((a, b) => ({
    [b]: a,
  }), value);

  return nestedObj;
}

function FormatRequestData(data) {
  let res = { };
  Object.keys(data).forEach((key) => {
    const keySplits = key.split('.');
    const rootKey = keySplits[0];
    res = { ...res, ...keyToNestedObject(key, data[key]) };
    if (!NotUndefinedOrNull(res[rootKey])) {
      return;
    }
    if (res[rootKey].toHTML) {
      res[rootKey] = res[rootKey].toHTML();
    } else if (Array.isArray(res[rootKey])) {
      res[rootKey] = res[rootKey].map((item) => {
        if (!item) {
          return null;
        }
        // ONLY reset properties with Id suffix.
        if (item._id && key.indexOf('Id') > -1) {
          return item._id;
        }
        return item;
      });
    } else if (isObject(res[rootKey])) {
      if (key.indexOf('Id') > -1) {
        res[rootKey] = res[rootKey]._id;
      }
    }
  });

  if (!Object.keys(res).length) {
    return NotUndefinedOrNull(res) && res ? res : null;
  }

  // if (this.queryKey && this[this.queryKey]) {
  //   res[this.queryKey] = this[this.queryKey];
  // }

  return res;
}

export {
  FormatRequestData,
};
