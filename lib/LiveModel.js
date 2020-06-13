const { get } = require("lodash");
const applyMutationFn = require("./applyMutationFn");
const { setKeyPath } = require("./mutations");

class LiveModel {
  #baseObject = {};

  #applyMutation = mutation => {
    return applyMutationFn(this.#baseObject, mutation);
  };

  constructor(baseObject) {
    if (baseObject) {
      this.#baseObject = baseObject;
    }
  }

  getBaseObject() {
    return this.#baseObject;
  }

  set(keyPath, value) {
    return this.#applyMutation(setKeyPath(keyPath, value));
  }

  get(keyPath) {
    return get(this.#baseObject, keyPath);
  }
}

module.exports = LiveModel;
