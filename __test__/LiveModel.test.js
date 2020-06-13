const { LiveModel } = require("../lib");

describe("construction", () => {
  test("no parameters", () => {
    const model = new LiveModel();
    expect(model.getBaseObject()).toStrictEqual({});
  });

  test("with provided base object", () => {
    const baseObject = {
      foo: { bar: 123 }
    };
    const model = new LiveModel(baseObject);
    expect(model.getBaseObject()).toBe(baseObject);
  });
});

describe("getters and setters", () => {
  let model;

  beforeEach(() => {
    model = new LiveModel();
  });

  test("nested get and set: key path as string", () => {
    model.set("foo.bar", 123);
    expect(model.get("foo.bar")).toBe(123);
    expect(model.getBaseObject()).toStrictEqual({
      foo: {
        bar: 123
      }
    });
  });
});
