const applyMutationFn = require("../lib/applyMutationFn");
const {
  circularAppendKeyPath,
  clearAll,
  deleteKeys,
  mergeKeyPath,
  setKeyPath,
  shallowAssignKeyPath
} = require("../lib/mutations");

describe("apply mutation function", () => {
  //
  // $clearAll
  //

  test("$clearAll", () => {
    const pre = {
      test: 123
    };
    applyMutationFn(pre, clearAll());
    expect(pre).toStrictEqual({});
  });

  //
  // $set
  //

  test("$set: top-level", () => {
    const pre = {
      test: 123
    };
    const rv = applyMutationFn(pre, setKeyPath("topLevel", 123));
    expect(rv).toBe(pre);
    expect(pre).toStrictEqual({ topLevel: 123, test: 123 });
  });

  test("$set: nested", () => {
    const pre = {};
    applyMutationFn(pre, setKeyPath("topLevel.inner.nested", { test: 123 }));
    expect(pre).toStrictEqual({
      topLevel: { inner: { nested: { test: 123 } } }
    });
  });

  //
  // $merge
  //

  test("$merge: top-level", () => {
    const pre = { topLevel: { nested: 456 } };
    applyMutationFn(pre, mergeKeyPath("topLevel", { nested: 123 }));
    expect(pre).toStrictEqual({
      topLevel: { nested: 123 }
    });
  });

  test("$merge: nested", () => {
    const pre = {
      topLevel: {
        inner: {
          nested: 123,
          other: 456
        }
      }
    };
    applyMutationFn(pre, mergeKeyPath("topLevel.inner", { nested: 789 }));
    expect(pre).toStrictEqual({
      topLevel: { inner: { nested: 789, other: 456 } }
    });
  });

  //
  // $shallowAssign
  //

  test("$shallowAssign: top-level", () => {
    const pre = {
      topLevel: {
        value: 123
      },
      other: {
        value: 456
      }
    };
    applyMutationFn(
      pre,
      shallowAssignKeyPath("", { topLevel: { value: 789 } })
    );
    expect(pre).toStrictEqual({
      topLevel: { value: 789 },
      other: { value: 456 }
    });
  });

  test("$shallowAssign: nested", () => {
    const pre = {
      topLevel: {
        value: {
          initial: 123
        }
      }
    };
    applyMutationFn(
      pre,
      shallowAssignKeyPath("topLevel", { value: { current: 456 } })
    );
    expect(pre).toStrictEqual({
      topLevel: { value: { current: 456 } }
    });
  });

  //
  // $circularAppend
  //

  test("$circularAppend: nested", () => {
    const pre = {
      circle: []
    };
    for (let i = 0; i < 10; i++) {
      applyMutationFn(pre, circularAppendKeyPath("circle", `line:${i}`, 5));
    }
    expect(pre).toStrictEqual({
      circle: ["line:5", "line:6", "line:7", "line:8", "line:9"]
    });
  });

  test("$circularAppend: truncate oversized array", () => {
    const pre = {
      circle: [
        "line:1",
        "line:2",
        "line:3",
        "line:4",
        "line:5",
        "line:6",
        "line:7"
      ]
    };

    applyMutationFn(pre, circularAppendKeyPath("circle", `line:8`, 3));

    expect(pre).toStrictEqual({
      circle: ["line:6", "line:7", "line:8"]
    });
  });

  test("$circularAppend: appends to existing arrays", () => {
    const pre = {
      circle: ["line:1", "line:2", "line:3"]
    };

    applyMutationFn(
      pre,
      circularAppendKeyPath("circle", ["line:4", "line:5"], 3)
    );

    expect(pre).toStrictEqual({
      circle: ["line:3", "line:4", "line:5"]
    });
  });

  //
  // $deleteKeys
  //
  test("$deleteKeys: top-level", () => {
    const pre = {
      a: 1,
      b: 2,
      c: 3
    };
    applyMutationFn(pre, deleteKeys(null, ["b", "c"]));
    expect(pre).toStrictEqual({ a: 1 });
  });

  test("$deleteKeys: nested", () => {
    const pre = {
      nested: {
        a: 1,
        b: 2
      },
      other: 123
    };
    applyMutationFn(pre, deleteKeys("nested", ["a"]));
    expect(pre).toStrictEqual({ nested: { b: 2 }, other: 123 });
  });

  test("$deleteKeys: no-op on non-object nested paths", () => {
    const pre = {
      nested: 3,
      other: 123
    };
    applyMutationFn(pre, deleteKeys("nested", ["a"]));
    expect(pre).toStrictEqual({ nested: 3, other: 123 });
  });

  test("unknown operation throws", () => {
    expect(() => applyMutationFn({}, { type: "$junk" })).toThrow(
      /EBADMUTATION/
    );
  });
});
