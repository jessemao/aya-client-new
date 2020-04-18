import { isObject, NotUndefinedOrNull } from '.';

function FormatRequestData(data) {
  const res = { ...data };
  Object.keys(res).forEach((key) => {
    if (!NotUndefinedOrNull(res[key])) {
      return;
    }
    if (res[key].toHTML) {
      res[key] = res[key].toHTML();
    } else if (Array.isArray(res[key])) {
      res[key] = res[key].map((item) => {
        if (!item) {
          return null;
        }
        // ONLY reset properties with Id suffix.
        if (item._id && key.indexOf('Id') > -1) {
          return item._id;
        }
        return item;
      });
    } else if (isObject(res[key])) {
      if (key.indexOf('Id') > -1) {
        res[key] = res[key]._id;
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
