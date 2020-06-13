const {
  circularAppendKeyPath,
  setKeyPath,
  shallowAssignKeyPath
} = require("../lib/mutations");

describe("mutation generators", () => {
  test("$set", () => {
    expect(() => setKeyPath("", 1)).toThrow(/ENOKEYPATH/i);
  });

  test("$shallowAssign", () => {
    expect(() => shallowAssignKeyPath("foo", 123)).toThrow(/EBADVALUE/i);
    expect(() => shallowAssignKeyPath("foo", "abc")).toThrow(/EBADVALUE/i);
    expect(() => shallowAssignKeyPath("foo")).toThrow(/EBADVALUE/i);
    shallowAssignKeyPath("foo", { abc: 1 });
    shallowAssignKeyPath("", { abc: 1 });
  });

  test("$circularAppendKeyPath", () => {
    expect(() => circularAppendKeyPath("", [1])).toThrow(/ENOKEYPATH/i);
  });
});
