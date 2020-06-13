const { isString, isObject } = require("lodash");
const assert = require("assert");

function _validateKeyPath(keyPath) {
  assert(isString(keyPath), `ENOKEYPATH: keyPath must be a string.`);
  assert(keyPath.length, `ENOKEYPATH: keyPath must have length at least 1.`);
}

function _valueIsObject(value) {
  assert(
    isObject(value),
    `EBADVALUE: require an object value for $mergeKeyPath`
  );
}

function clearAll() {
  return {
    type: "$clearAll"
  };
}

function setKeyPath(keyPath, value) {
  _validateKeyPath(keyPath);
  return {
    type: "$set",
    keyPath,
    value
  };
}

function mergeKeyPath(keyPath, value) {
  _validateKeyPath(keyPath);
  _valueIsObject(value);
  return {
    type: "$merge",
    keyPath,
    value
  };
}

function shallowAssignKeyPath(keyPath, value) {
  if (keyPath) _validateKeyPath(keyPath);
  _valueIsObject(value);
  return {
    type: "$shallowAssign",
    keyPath,
    value
  };
}

function circularAppendKeyPath(keyPath, value, maxSize) {
  _validateKeyPath(keyPath);
  return {
    type: "$circularAppend",
    keyPath,
    value,
    maxSize
  };
}

function deleteKeys(keyPath, keyList) {
  if (keyPath) _validateKeyPath(keyPath);
  return {
    type: "$deleteKeys",
    keyPath,
    keyList
  };
}

module.exports = {
  setKeyPath,
  mergeKeyPath,
  clearAll,
  shallowAssignKeyPath,
  circularAppendKeyPath,
  deleteKeys
};
