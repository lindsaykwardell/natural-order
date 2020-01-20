import naturalOrder from "../src/index";

describe("natural-order", () => {
  it("sorts an array of strings", () => {
    const list = ["z", "b", "d", "c"];

    const sorted = naturalOrder(list).sort();

    expect(sorted).toEqual(["b", "c", "d", "z"]);
  });

  it("allows sorting in descending order", () => {
    const list = ["z", "b", "d", "c"];

    const sorted = naturalOrder(list)
      .orderBy("desc")
      .sort();

    expect(sorted).toEqual(["z", "d", "c", "b"]);
  });

  it("sorts an array of objects by key", () => {
    const list = [
      { name: "bob" },
      { name: "steve" },
      { name: "george" },
      { name: "adam" }
    ];

    const sorted = naturalOrder(list).sort(["name"]);

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

    const sorted = naturalOrder(list)
      .orderBy(["desc"])
      .sort(["name"]);

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

    const sorted = naturalOrder(list).sort(["name.last", "name.first"]);

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

    const sorted = naturalOrder(list).sort();

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

    const sorted = naturalOrder(list).sort();

    expect(sorted).toEqual(list);
    expect(sorted === list).toBe(false);
    expect(sorted[0] === list[0]).toBe(false);

    list[0].name.first = "john";

    expect(sorted[0].name.first).toBe("adam");
  });

  it("Defaults to putting blank lines at the bottom", () => {
    const list = ["z", "", "a"];

    const sorted = naturalOrder(list).sort();

    expect(sorted).toEqual(["a", "z", ""]);
  });

  it("Allows putting blank lines at the top", () => {
    const list = ["z", "", "a"];

    const sorted = naturalOrder(list)
      .with({ blankAtTop: true })
      .sort();

    expect(sorted).toEqual(["", "a", "z"]);
  });

  it("Allows sorting capital letters higher", () => {
    const list = ["a", "B"];

    const sorted = naturalOrder(list)
      .with({ caseSensitive: true })
      .sort();

    expect(sorted).toEqual(["B", "a"]);
  });

  it("Allows sorting by number", () => {
    const list = ["a", "b", "c"];

    const sorted = naturalOrder(list)
      .orderBy(-1)
      .sort();

    expect(sorted).toEqual(["c", "b", "a"]);
  });

  it("Allows similar API to 0.3.0", () => {
    const list = ["a", "b", "c"];

    const sorted = naturalOrder(list, null, "desc").sort();

    expect(sorted).toEqual(["c", "b", "a"]);
  });

  it("Matches old syntax results", () => {
    const list = ["a", "b", "c", "A"];

    // Old syntax
    // const sorted1 = naturalOrder(list, null, "desc", { caseSensitive: true });

    // New syntax
    const sorted2 = naturalOrder(list)
      .with({ caseSensitive: true })
      .orderBy("desc")
      .sort();

    // Alternative syntax

    const sorted3 = naturalOrder(list, null, "desc", {
      caseSensitive: true
    }).sort();

    expect(sorted2[0]).toEqual(sorted3[0]);
  });
});
