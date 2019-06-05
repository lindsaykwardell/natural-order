import naturalOrder from "../src/index";

describe("natural-order", () => {
  it("sorts an array of strings", () => {
    const list = ["z", "b", "d", "c"];

    const sorted = naturalOrder(list);

    expect(sorted).toEqual(["b", "c", "d", "z"]);
  });

  it("allows sorting in descending order", () => {
    const list = ["z", "b", "d", "c"];

    const sorted = naturalOrder(list, null, "desc");

    expect(sorted).toEqual(["z", "d", "c", "b"]);
  });

  it("sorts an array of objects by key", () => {
    const list = [
      { name: "bob" },
      { name: "steve" },
      { name: "george" },
      { name: "adam" }
    ];

    const sorted = naturalOrder(list, ["name"]);

    expect(sorted).toEqual([
      { name: "adam" },
      { name: "bob" },
      { name: "george" },
      { name: "steve" }
    ]);
  });

  it("sorts an array of objects by key in descending order", () => {
    const list = [
      { name: "bob" },
      { name: "steve" },
      { name: "george" },
      { name: "adam" }
    ];

    const sorted = naturalOrder(list, ["name"], ["desc"]);

    expect(sorted).toEqual([
      { name: "steve" },
      { name: "george" },
      { name: "bob" },
      { name: "adam" }
    ]);
  });

  it("sorts an array of objects with child objects by key", () => {
    const list = [
      { name: { first: "bob", last: "temple" } },
      { name: { first: "steve", last: "martin" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "adam", last: "temple" } }
    ];

    const sorted = naturalOrder(list, ["name.last", "name.first"]);

    expect(sorted).toEqual([
      { name: { first: "george", last: "martin" } },
      { name: { first: "steve", last: "martin" } },
      { name: { first: "adam", last: "temple" } },
      { name: { first: "bob", last: "temple" } }
    ]);
  });

  it("sorts an array of objects with child objects without provided key", () => {
    const list = [
      { name: { first: "bob", last: "temple" } },
      { name: { first: "steve", last: "martin" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "adam", last: "temple" } }
    ];

    const sorted = naturalOrder(list);

    expect(sorted).toEqual([
      { name: { first: "adam", last: "temple" } },
      { name: { first: "bob", last: "temple" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "steve", last: "martin" } }
    ]);
  });

  it("Deep clones objects in list", () => {
    const list = [
      { name: { first: "adam", last: "temple" } },
      { name: { first: "bob", last: "temple" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "steve", last: "martin" } }
    ];

    const sorted = naturalOrder(list);

    expect(sorted).toEqual(list);
    expect(sorted === list).toBe(false);
    expect(sorted[0] === list[0]).toBe(false);

    list[0].name.first = "john";

    expect(sorted[0].name.first).toBe("adam");
  });

  it("Defaults to putting blank lines at the bottom", () => {
    const list = ["z", "", "a"];

    const sorted = naturalOrder(list);

    expect(sorted).toEqual(["a", "z", ""]);
  });

  it("Allows putting blank lines at the top", () => {
    const list = ["z", "", "a"];

    const sorted = naturalOrder(list, null, "asc", { blankAtTop: true });

    expect(sorted).toEqual(["", "a", "z"]);
  });

  it("Allows sorting capital letters higher", () => {
    const list = ["a", "B"];

    const sorted = naturalOrder(list, null, "asc", { caseSensitive: true });

    expect(sorted).toEqual(["B", "a"]);
  });
});
