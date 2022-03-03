/*!
 * natural-order
 * ===============
 * Sort an array of strings, numbers, or objects naturally.
 *
 * http://github.com/lindsaykwardell/natural-order
 * MIT License, © Lindsay Wardell 2019-2020
 *
 */

import cloneDeep from "lodash.clonedeep";
import naturalSort from "./natural-sort";

type Options = {
  blankAtTop?: boolean;
  caseSensitive?: boolean;
};

type Order = Array<"desc" | "asc"> | Array<1 | -1> | 1 | -1 | "desc" | "asc";

class NaturalList<A> {
  private list: A[];
  private options: Options;
  private order: Order;
  private sortKey: string[];

  public key: string[] | null = null;

  constructor(
    list: A[],
    sortBy?: string[],
    orderBy?: Order,
    options?: Options
  ) {
    this.list = cloneDeep<A[]>(list);
    this.options = {
      blankAtTop: false,
      caseSensitive: false,
      ...options,
    };
    this.order = orderBy ? orderBy : "asc";
    this.sortKey = sortBy || [];
  }

  public with(options: {
    blankAtTop?: boolean;
    caseSensitive?: boolean;
  }): NaturalList<A> {
    this.options = { blankAtTop: false, caseSensitive: false, ...options };
    return this;
  }
  public orderBy(
    orderBy: Array<"desc" | "asc"> | Array<1 | -1> | 1 | -1 | "desc" | "asc"
  ): NaturalList<A> {
    this.order = orderBy;
    return this;
  }

  public initialSortBy = (input: string[] | undefined) => {
    if (!input && this.sortKey !== null) {
      this.key = this.sortKey;
    } else if (input) {
      this.key = input;
    } else {
      this.key = null;
    }
  };

  public getCurrentOrder = (i: number): "asc" | "desc" => {
    if (!this.order) return "asc";
    if (typeof this.order !== "string" && typeof this.order !== "number") {
      if (!this.order[i]) {
        return this.getOrderMethod(this.order[this.order.length - 1]);
      } else return this.getOrderMethod(this.order[i]);
    } else return this.getOrderMethod(this.order);
  };

  public getOrderMethod = (
    orderBy: 1 | -1 | "desc" | "asc"
  ): "asc" | "desc" => {
    if (typeof orderBy === "string") return orderBy;
    else if (orderBy === 1) return "asc";
    else return "desc";
  };

  public getNextKey = (i: number) => this.key![i + 1];

  public currentKey = (root: any, key: string): string => {
    const nodes: string[] = key.split(".");
    let elem: any = root;
    nodes.forEach((node) => (elem = elem[node]));
    if (elem && typeof elem !== "object") return elem.toString();
    else if (elem && typeof elem === "object") {
      const newKey = Object.keys(elem)[0];
      return this.currentKey(elem, newKey);
    } else return elem;
  };

  public sortElements = (
    a: any,
    b: any,
    key: string | null,
    i: number
  ): number => {
    if (!key) {
      if (typeof a === "object") {
        const key = Object.keys(a)[0];
        return this.sortElements(a, b, key, i);
      } else {
        return naturalSort({
          ...this.options,
          direction: this.getCurrentOrder(i),
        })(a.toString(), b.toString());
      }
    }

    const val = naturalSort({
      ...this.options,
      direction: this.getCurrentOrder(i),
    })(this.currentKey(a, key), this.currentKey(b, key));
    if (val === 0 && this.getNextKey(i)) {
      return this.sortElements(a, b, this.getNextKey(i), i + 1);
    } else return val;
  };

  public sort(sortBy?: string[]): A[] {
    this.initialSortBy(sortBy);

    this.list.sort((a: any, b: any) =>
      this.sortElements(a, b, this.key ? this.key[0] : null, 0)
    );

    return this.list;
  }
}

const naturalOrder = <A>(
  list: A[],
  sortBy?: string[],
  orderBy?: Order,
  options?: Options
): NaturalList<A> => {
  const naturalList = new NaturalList<A>(list, sortBy, orderBy, options);

  return naturalList;
};

export default naturalOrder;
