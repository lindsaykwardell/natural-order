import naturalOrder from "../src/index";

describe("natural-order", () => {
  it("sorts an array of strings", () => {
    const list = ["z", "b", "d", "c"];

    list.sort(naturalOrder());

    expect(list).toEqual(["b", "c", "d", "z"]);
  });

  it("allows sorting in descending order", () => {
    const list = ["z", "b", "d", "c"];

    list.sort(naturalOrder({ orderBy: "desc" }));

    expect(list).toEqual(["z", "d", "c", "b"]);
  });

  it("sorts an array of objects by key", () => {
    const list = [
      { name: "bob" },
      { name: "steve" },
      { name: "george" },
      { name: "adam" },
    ];

    list.sort(naturalOrder({ sortBy: ["name"] }));

    expect(list).toEqual([
      { name: "adam" },
      { name: "bob" },
      { name: "george" },
      { name: "steve" },
    ]);
  });

  it("sorts an array of objects by key in descending order", () => {
    const list = [
      { name: "bob" },
      { name: "steve" },
      { name: "george" },
      { name: "adam" },
    ];

    list.sort(
      naturalOrder({ orderBy: "desc", sortBy: ["name"] }),
    );

    expect(list).toEqual([
      { name: "steve" },
      { name: "george" },
      { name: "bob" },
      { name: "adam" },
    ]);
  });

  it("sorts an array of objects with child objects by key", () => {
    const list = [
      { name: { first: "bob", last: "temple" } },
      { name: { first: "steve", last: "martin" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "adam", last: "temple" } },
    ];

    list.sort(
      naturalOrder({ sortBy: ["name.last", "name.first"] }),
    );

    expect(list).toEqual([
      { name: { first: "george", last: "martin" } },
      { name: { first: "steve", last: "martin" } },
      { name: { first: "adam", last: "temple" } },
      { name: { first: "bob", last: "temple" } },
    ]);
  });

  it("sorts an array of objects with child objects without provided key", () => {
    const list = [
      { name: { first: "bob", last: "temple" } },
      { name: { first: "steve", last: "martin" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "adam", last: "temple" } },
    ];

    list.sort(naturalOrder());

    expect(list).toEqual([
      { name: { first: "adam", last: "temple" } },
      { name: { first: "bob", last: "temple" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "steve", last: "martin" } },
    ]);
  });

  it("Deep clones list", () => {
    const list = [
      { name: { first: "adam", last: "temple" } },
      { name: { first: "bob", last: "temple" } },
      { name: { first: "george", last: "martin" } },
      { name: { first: "steve", last: "martin" } },
    ];

    const sorted = naturalOrder.immutableSort(list);

    expect(sorted).toEqual(list);
    expect(sorted === list).toBe(false);
    expect(sorted[0] === list[0]).toBe(false);

    list[0].name.first = "john";

    expect(sorted[0].name.first).toBe("adam");
  });

  it("Defaults to putting blank lines at the bottom", () => {
    const list = ["z", "", "a"];

    list.sort(naturalOrder());

    expect(list).toEqual(["a", "z", ""]);
  });

  it("Allows putting blank lines at the top", () => {
    const list = ["z", "", "a"];

    list.sort(naturalOrder({
      options: {
        blankAtTop: true,
      },
    }));

    expect(list).toEqual(["", "a", "z"]);
  });

  it("Allows sorting capital letters higher", () => {
    const list = ["a", "B"];

    list.sort(naturalOrder({
      options: {
        caseSensitive: true,
      },
    }));

    expect(list).toEqual(["B", "a"]);
  });

  it("Allows sorting by number", () => {
    const list = ["a", "b", "c"];

    list.sort(naturalOrder({ orderBy: -1 }));

    expect(list).toEqual(["c", "b", "a"]);
  });
});
