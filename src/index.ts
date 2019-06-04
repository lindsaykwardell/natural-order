import cloneDeep from "lodash.clonedeep";
import naturalSort from "./natural-sort";

interface IOptions {
  blankAtTop?: boolean;
  caseSensitive?: boolean;
}

const naturalOrder = (
  list: any[],
  sortBy?: string[],
  orderBy?: Array<"desc" | "asc"> | "desc" | "asc",
  options?: IOptions
) => {
  const opts = { blankAtTop: false, caseSensitive: false, ...options };

  const copyObj = (obj: any) => {
    if (typeof obj !== obj) return obj;

    const newObj = { ...obj };
    const keys = Object.keys(newObj);
    keys.forEach(key => {
      if (typeof newObj[key] === "object") newObj[key] = copyObj(newObj[key]);
    });
    return newObj;
  };

  const getNextKey = (i: number) => sortBy[i + 1];

  const getCurrentOrder = (i: number): "asc" | "desc" => {
    if (!orderBy) return "asc";
    if (typeof orderBy !== "string") {
      if (!orderBy[i]) return orderBy[orderBy.length - 1];
      else return orderBy[i];
    } else return orderBy;
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
          blankAtTop: opts.blankAtTop,
          caseSensitive: opts.caseSensitive,
          direction: getCurrentOrder(i)
        })(a, b);
      } else if (typeof a === "object") {
        const key = Object.keys(a)[0];
        return sort(a, b, key, i);
      }
    }

    const val = naturalSort({
      blankAtTop: opts.blankAtTop,
      caseSensitive: opts.caseSensitive,
      direction: getCurrentOrder(i)
    })(currentKey(a, key), currentKey(b, key));
    if (val === 0 && getNextKey(i)) {
      return sort(a, b, getNextKey(i), i + 1);
    } else return val;
  };

  const newList = cloneDeep(list);

  return newList.sort((a: any, b: any) =>
    sort(a, b, sortBy ? sortBy[0] : null, 0)
  );
};

export = naturalOrder;
// export default naturalOrder;
