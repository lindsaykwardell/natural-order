# natural-order

## **Sort arrays of strings or objects naturally**

**_Sorting with support for numbers, dates, unicode and more._**

<a id="/features"></a>&nbsp;

- Returns a new list
- Sort an array of string _or_ objects in a natural way
- Allows for sorting by nested objects
- Numbers are handled properly – “2” is before “10”
- Strings are after numbers
- Empty strings are after “z”
- “a” is before “B”
- Semver-compatible sorting of version numbers

<a id="/usage"></a>&nbsp;

## Usage

```javascript
naturalOrder: (list: any[], sortBy?: string[], orderBy?: "desc" | "asc" | ("desc" | "asc")[]) => any[]

```

`list: any[]`

any list (strings, numbers, or objects)

`sortBy?: string[]`

The keys by which to sort. May be null. If sorting objects, defaults to the first key it finds.

`orderBy?: "desc" | "asc" | ("desc" | "asc")[]`

Order by which to sort. Defaults to ascending. Enter a value for each key you are using for sorting.
If not enough values are passed, the last provided will be used when they run out.
(example: You may just pass "desc", and all keys will be sorted in descending order.)

<a id="/examples"></a>&nbsp;

## Examples

```javascript
const list = ["b", "z", "a"];

naturalOrder(list);

// ["a", "b", "z"]

naturalOrder(list, null, "desc");

// ["z", "b", "a"]

const list2 = [{ name: "George" }, { name: "Fred" }, { name: "Alice" }];

naturalOrder(list2, ["name"]);

// [{name: "Alice"}, {name: "Fred""}, {name: "George"}]

const list3 = [
  { name: { first: "bob", last: "temple" } },
  { name: { first: "steve", last: "martin" } },
  { name: { first: "george", last: "martin" } },
  { name: { first: "adam", last: "temple" } }
];

naturalOrder(list3, ["name.last", "name.first"]);

// [ { name: { first: 'george', last: 'martin' } },
//   { name: { first: 'steve', last: 'martin' } },
//   { name: { first: 'adam', last: 'temple' } },
//   { name: { first: 'bob', last: 'temple' } } ]

naturalOrder(list3);

// [ { name: { first: 'adam', last: 'temple' } },
//   { name: { first: 'bob', last: 'temple' } },
//   { name: { first: 'george', last: 'martin' } },
//   { name: { first: 'steve', last: 'martin' } } ]
```

<a id="/credits"></a>&nbsp;

## Credits

This project uses code from _[natural-sort](https://github.com/studio-b12/natural-sort)_ for its natural sorting method.

<a id="/license"></a>&nbsp;

## License

This project is MIT Licensed.
