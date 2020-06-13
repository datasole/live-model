const { assign, get, set, merge } = require("lodash");

function applyMutationFn(baseObject, mutationOp) {
  switch (mutationOp.type) {
    case "$clearAll": {
      for (let key in baseObject) {
        delete baseObject[key];
      }
      break;
    }

    case "$set": {
      const { keyPath, value } = mutationOp;
      set(baseObject, keyPath, value);
      break;
    }

    case "$merge": {
      const { keyPath, value } = mutationOp;
      set(baseObject, keyPath, merge(get(baseObject, keyPath, {}), value));
      break;
    }

    case "$shallowAssign": {
      const { keyPath, value } = mutationOp;
      if (!keyPath) {
        Object.assign(baseObject, value);
      } else {
        set(baseObject, keyPath, assign(get(baseObject, keyPath, {}), value));
      }
      break;
    }

    case "$circularAppend": {
      const { keyPath, value, maxSize } = mutationOp;
      const arr = get(baseObject, keyPath, []);
      if (typeof value === "object" && value.length) {
        arr.push(...value);
      } else {
        arr.push(value);
      }
      if (arr.length > maxSize) {
        arr.splice(0, arr.length - maxSize);
      }
      set(baseObject, keyPath, arr);
      break;
    }

    case "$deleteKeys": {
      const { keyPath, keyList } = mutationOp;
      const container = keyPath ? get(baseObject, keyPath) : baseObject;
      if (container && typeof container === "object") {
        keyList.forEach(key => delete container[key]);
      }
      break;
    }

    default: {
      throw new Error(
        `EBADMUTATION: unsupported mutation type: "${mutationOp.type}"`
      );
    }
  }

  return baseObject;
}

module.exports = applyMutationFn;
