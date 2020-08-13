# natural-order

### **Sort arrays of strings or objects naturally**

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
- _(New)_ Hook to use sorting algorithm from standard `.sort()` array method.

<a id="/usage"></a>&nbsp;

## Usage

```javascript
// ES6
import naturalOrder, { naturalSort } from "natural-order";

// CommonJS
const naturalOrder = require("natural-order");

naturalOrder: <A>(list: A[]) => NaturalList<A>

class NaturalList<A> {
  with: (options: { blankAtTop?: boolean, caseSensitive?: boolean}) => NaturalList<A>
  orderBy: (order: Array<"desc" | "asc"> | Array<1 | -1> | 1 | -1 | "desc" | "asc") => NaturalList<A>
  sort: (sortBy?: string[]) => A[]
}

(method) naturalOrder.naturalSort(
  sortBy?: string[], 
  orderBy?: Order, 
  options?: Options)
: (a: any, b: any) => number


```

`list: A[]`

Any list (strings, numbers, or objects)

`options: { blankAtTop?: boolean, caseSensitive?: boolean}`

Optional parameters:
- blankAtTop: If true, places null or blank parameters opposite the order option
  - If ascending, null or blank are at the top.
  - If descending, null or blank are at the bottom.
- caseSensitive: If true, capital letters are ranked higher than lowercase.

`order: 1 | -1 | "asc" | "desc" | ("asc" | "desc")[] | (1 | -1)[]`

Order by which to sort. Defaults to ascending. Enter a value for each key you are using for sorting.
If not enough values are passed, the last provided will be used when they run out.
(example: You may just pass "desc", and all keys will be sorted in descending order.)

The number values 1 and -1 can be used instead of "asc" and "desc", respectively.

`sortBy?: string[]`

The keys by which to sort. May be null. If sorting objects, defaults to the first key it finds.

`naturalOrder.naturalSort()`

This is a method that can be used from a standard `.sort()` array method. This method accepts the same options as above.

<a id="/examples"></a>&nbsp;

## Examples

```javascript
const list = ["b", "z", "a"];

naturalOrder(list).sort();

// ["a", "b", "z"]

list.sort(naturalOrder.naturalSort());

// ["a", "b", "z"]

list.sort(naturalSort())

// ["a", "b", "z"]

naturalOrder(list).orderBy("desc").sort();
list.sort(naturalSort().orderBy("desc").sort())

// ["z", "b", "a"]

naturalOrder(list).orderBy(-1).sort();
list.sort(naturalSort().orderBy(-1).sort());

// ["z", "b", "a"]

const list2 = [{ name: "George" }, { name: "Fred" }, { name: "Alice" }];

naturalOrder(list2).sort(["name"]);
list2.sort(naturalSort().sort(["name"]));

// [{name: "Alice"}, {name: "Fred""}, {name: "George"}]

const list3 = [
  { name: { first: "bob", last: "temple" } },
  { name: { first: "steve", last: "martin" } },
  { name: { first: "george", last: "martin" } },
  { name: { first: "adam", last: "temple" } }
];

naturalOrder(list3).sort(["name.last", "name.first"]);
list3.sort(naturalSort().sort(["name.last", "name.first"]));

// [ { name: { first: 'george', last: 'martin' } },
//   { name: { first: 'steve', last: 'martin' } },
//   { name: { first: 'adam', last: 'temple' } },
//   { name: { first: 'bob', last: 'temple' } } ]

naturalOrder(list3).sort();
list3.sort(naturalSort().sort());

// [ { name: { first: 'adam', last: 'temple' } },
//   { name: { first: 'bob', last: 'temple' } },
//   { name: { first: 'george', last: 'martin' } },
//   { name: { first: 'steve', last: 'martin' } } ]

const list4 = ["a", "B"];

naturalOrder(list4).with({ caseSensitive: true }).sort();
list4.sort(naturalSort().with({ caseSensitive: true }).sort());

// ["B", "a"]

const list5 = ["z", "", "a"];

naturalOrder(list5).sort();
list5.sort(naturalSort().sort());

// ["a", "z", ""]

naturalOrder(list5).with({ blankAtTop: true }).sort();
list5.sort(naturalSort().with({ blankAtTop: true }).sort());

// ["", "a", "z"]



```

<a id="/migration"></a>&nbsp;

## Migration

All options from verion 0.3.0 are still available with the new API. Alternatively, if you prefer the old syntax, it is still available, but you will need to call `.sort()` still. 

```javascript
const list = ["a", "b", "c", "A"]

// Old syntax
const sorted1 = naturalOrder(list, null, "desc", { caseSensitive: true })

// New syntax
const sorted2 = naturalOrder(list).with({ caseSensitive: true }).orderBy("desc").sort()

sorted1[0] === sorted2[0] // true

// Alternative syntax

const sorted3 = naturalOrder(list, null, "desc", { caseSensitive: true }).sort()

sorted1[0] === sorted3[0] // true

```

_Version 1.1.0_: The old syntax also works in the new `naturalSort()` method:


```javascript

list.sort(naturalSort(null, "desc", { caseSensitive: true })).sort();

```


<a id="/credits"></a>&nbsp;

## Credits

This project uses code from _[natural-sort](https://github.com/studio-b12/natural-sort)_ for its natural sorting method.

<a id="/license"></a>&nbsp;

## License

This project is MIT Licensed.
