import { format } from "d3-format";

export function humanizeNumber(n: number): string {
  let rest = n;
  while (rest > 1000) {
    rest /= 1000;
  }

  // d3-format does not have a format to display: "123456" as "123K", instead it
  // will display "120K) when using `format(".2~s")`, so instead we format it separately
  // when there are 3 numbers left.
  if (rest >= 100) {
    return format(".3~s")(n).toUpperCase();
  }

  return format(".2~s")(n).toUpperCase();
}
