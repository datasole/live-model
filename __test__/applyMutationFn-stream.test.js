const applyMutationFn = require("../lib/applyMutationFn");
const { deleteKeys, setKeyPath } = require("../lib/mutations");

describe("mutation stream", () => {
  test("$set", () => {
    const pre = {};
    applyMutationFn(pre, setKeyPath("nested.deep", 123));
    applyMutationFn(pre, setKeyPath("nested.deep", 345));
    applyMutationFn(pre, setKeyPath("nested.avis", { sandwich: 911 }));
    expect(pre).toStrictEqual({
      nested: {
        deep: 345,
        avis: {
          sandwich: 911
        }
      }
    });
  });

  test("$set - $deleteKeys", () => {
    const pre = {};
    applyMutationFn(pre, setKeyPath("nested.deep", 123));
    applyMutationFn(pre, deleteKeys("nested", ["deep"]));
    expect(pre).toStrictEqual({
      nested: {}
    });
  });
});
