/*!
 * natural-sort.ts
 * ===============
 * Sorting with support for numbers, dates, unicode and more.
 *
 * http://github.com/studio-b12/natural-sort
 * MIT License, © Studio B12 GmbH 2014
 *
 */ /*
 *
 * Idea by Dave Koelle
 * Original implementation by Jim Palmer
 * Modified by Tomek Wiszniewski
 * Converted to Typescript by Lindsay Wardell
 *
 */

interface IOptions {
  caseSensitive?: boolean;
  direction?: "desc" | "asc";
}

const naturalSort = (opts?: IOptions) => {
  const options: IOptions = { ...opts };

  return (a: string, b: string) => {
    const EQUAL = 0;
    const GREATER = options.direction == "desc" ? -1 : 1;
    const SMALLER = -GREATER;

    const re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi;
    const sre = /(^[ ]*|[ ]*$)/g;
    const dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
    const hre = /^0x[0-9a-f]+$/i;
    const ore = /^0/;

    const normalize = function normalize(value: string) {
      const string = "" + value;
      return options.caseSensitive ? string : string.toLowerCase();
    };

    // Normalize values to strings
    const x = normalize(a).replace(sre, "") || "";
    const y = normalize(b).replace(sre, "") || "";

    // chunk/tokenize
    const xN = x
      .replace(re, "\0$1\0")
      .replace(/\0$/, "")
      .replace(/^\0/, "")
      .split("\0");
    const yN = y
      .replace(re, "\0$1\0")
      .replace(/\0$/, "")
      .replace(/^\0/, "")
      .split("\0");

    // Return immediately if at least one of the values is empty.
    if (!x && !y) return EQUAL;
    if (!x && y) return GREATER;
    if (x && !y) return SMALLER;

    // numeric, hex or date detection
    const xD = x.match(hre)
      ? parseInt(x.match(hre).toString())
      : xN.length != 1 && x.match(dre) && Date.parse(x);
    const yD = y.match(hre)
      ? parseInt(y.match(hre).toString())
      : (xD && y.match(dre) && Date.parse(y)) || null;
    let oFxNcL, oFyNcL;

    // first try and sort Hex codes or Dates
    if (yD) {
      if (xD < yD) return SMALLER;
      else if (xD > yD) return GREATER;
    }

    // natural sorting through split numeric strings and default strings
    for (
      let cLoc = 0, numS = Math.max(xN.length, yN.length);
      cLoc < numS;
      cLoc++
    ) {
      // find floats not starting with '0', string or 0 if not defined (Clint Priest)
      oFxNcL =
        (!(xN[cLoc] || "").match(ore) && parseFloat(xN[cLoc])) || xN[cLoc] || 0;
      oFyNcL =
        (!(yN[cLoc] || "").match(ore) && parseFloat(yN[cLoc])) || yN[cLoc] || 0;

      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL as any) !== isNaN(oFyNcL as any))
        return isNaN(oFxNcL as any) ? GREATER : SMALLER;
      // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
      else if (typeof oFxNcL !== typeof oFyNcL) {
        oFxNcL += "";
        oFyNcL += "";
      }

      if (oFxNcL < oFyNcL) return SMALLER;
      if (oFxNcL > oFyNcL) return GREATER;
    }

    return EQUAL;
  };
};

export default naturalSort;
