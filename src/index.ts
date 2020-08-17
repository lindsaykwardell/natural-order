/*!
 * natural-order
 * ===============
 * Sort an array of strings, numbers, or objects naturally.
 *
 * http://github.com/lindsaykwardell/natural-order
 * MIT License, © Lindsay Wardell 2019-2020
 *
 */

import naturalSort from "./natural-sort";
import cloneDeep from "lodash.clonedeep";

type Options = {
  blankAtTop?: boolean;
  caseSensitive?: boolean;
};

type Order = Array<"desc" | "asc" | 1 | -1> | "desc" | "asc" | 1 | -1;

type NaturalOrderParameters = {
  options?: Options;
  orderBy?: Order;
  sortBy?: string[];
};

const naturalOrder = <T>(
  { options, orderBy = "asc", sortBy = null }: NaturalOrderParameters = {
    options: {},
    orderBy: "asc",
    sortBy: null,
  }
) => {
  let opts: Options = {
    blankAtTop: false,
    caseSensitive: false,
    ...options,
  };

  let order: Order = orderBy;

  let key: string[] = sortBy;

  const getCurrentOrder = (i: number): "asc" | "desc" => {
    if (!order) return "asc";
    if (typeof order !== "string" && typeof order !== "number") {
      if (!order[i]) {
        return getOrderMethod(order[order.length - 1]);
      } else return getOrderMethod(order[i]);
    } else return getOrderMethod(order);
  };

  const getOrderMethod = (orderBy: 1 | -1 | "desc" | "asc"): "asc" | "desc" => {
    if (typeof orderBy === "string") return orderBy;
    else if (orderBy === 1) return "asc";
    else return "desc";
  };

  const getNextKey = (i: number) => key[i + 1];

  const currentKey = (root: any, key: string): string => {
    if (!key) return root;
    const nodes: string[] = key.split(".");
    let elem: any = root;
    nodes.forEach((node) => (elem = elem[node]));
    if (elem && typeof elem !== "object") return elem.toString();
    else if (elem && typeof elem === "object") {
      const newKey = Object.keys(elem)[0];
      return currentKey(elem, newKey);
    } else return elem;
  };

  const sortElements = (a: any, b: any, key: string, i: number): number => {
    if (!key) {
      if (typeof a === "string") {
        return naturalSort({
          ...opts,
          direction: getCurrentOrder(i),
        })(a, b);
      } else if (typeof a === "object") {
        const key = Object.keys(a)[0];
        return sortElements(a, b, key, i);
      }
    }

    const val = naturalSort({
      ...opts,
      direction: getCurrentOrder(i),
    })(currentKey(a, key), currentKey(b, key));
    if (val === 0 && getNextKey(i)) {
      return sortElements(a, b, getNextKey(i), i + 1);
    } else return val;
  };

  return (a: any, b: any) => {
    return sortElements(a, b, key ? key[0] : null, 0);
  };
};

naturalOrder.immutableSort = <T>(
  list: Array<T>,
  params: NaturalOrderParameters = {
    options: {},
    orderBy: "asc",
    sortBy: null,
  }
) => {
  return cloneDeep<Array<T>>(list).sort(naturalOrder(params));
};

export = naturalOrder;
