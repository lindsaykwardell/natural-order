import cloneDeep from "lodash.clonedeep";
import naturalSort from "./natural-sort";

type Options = {
  blankAtTop?: boolean;
  caseSensitive?: boolean;
};

type Order = Array<"desc" | "asc"> | Array<1 | -1> | 1 | -1 | "desc" | "asc";

class NaturalList<A> {
  private initialList: A[];
  private list: A[];
  private options: Options;
  private order: Order;
  private sortKey: string[];

  constructor(
    list: A[],
    sortBy?: string[],
    orderBy?: Order,
    options?: Options
  ) {
    this.initialList = cloneDeep<A[]>(list);
    this.list = cloneDeep<A[]>(list);
    this.options = {
      blankAtTop: false,
      caseSensitive: false,
      ...options
    };
    this.order = orderBy ? orderBy : "asc";
    this.sortKey = sortBy
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
  public sort(sortBy?: string[]): A[] {
    const initialSortBy = (input: string[], key: string[]) => {
      if (!input && key !== null) {
        return key
      } else if (input) {
        return input
      } else {
        return null
      }
    }  

    const key = initialSortBy(sortBy, this.sortKey)

    const getNextKey = (i: number) => key[i + 1];

    const getCurrentOrder = (i: number): "asc" | "desc" => {
      if (!this.order) return "asc";
      if (typeof this.order !== "string" && typeof this.order !== "number") {
        if (!this.order[i])
          return getOrderMethod(this.order[this.order.length - 1]);
        else return getOrderMethod(this.order[i]);
      } else return getOrderMethod(this.order);
    };

    const getOrderMethod = (
      orderBy: 1 | -1 | "desc" | "asc"
    ): "asc" | "desc" => {
      if (typeof orderBy === "string") return orderBy;
      else if (orderBy === 1) return "asc";
      else return "desc";
    };

    const currentKey = (root: any, key: string): string => {
      const nodes: string[] = key.split(".");
      let elem: any = root;
      nodes.forEach(node => (elem = elem[node]));
      if (elem && typeof elem !== "object") return elem.toString();
      else if (elem && typeof elem === "object") {
        const newKey = Object.keys(elem)[0];
        return currentKey(elem, newKey);
      } else return elem;
    };

    const sort = (a: any, b: any, key: string, i: number): number => {
      if (!key) {
        if (typeof a === "string") {
          return naturalSort({
            ...this.options,
            direction: getCurrentOrder(i)
          })(a, b);
        } else if (typeof a === "object") {
          const key = Object.keys(a)[0];
          return sort(a, b, key, i);
        }
      }

      const val = naturalSort({
        ...this.options,
        direction: getCurrentOrder(i)
      })(currentKey(a, key), currentKey(b, key));
      if (val === 0 && getNextKey(i)) {
        return sort(a, b, getNextKey(i), i + 1);
      } else return val;
    }; 

    this.list.sort((a: any, b: any) =>
      sort(a, b, key ? key[0] : null, 0)
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

export = naturalOrder;
