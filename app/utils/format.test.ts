import { describe, expect, it } from "vitest";
import { humanizeNumber } from "~/utils/format";

describe("formatNumber", () => {
  it("returns an error message when the password is empty", () => {
    expect(humanizeNumber(1)).toBe("1");
    expect(humanizeNumber(12)).toBe("12");
    expect(humanizeNumber(123)).toBe("123");
    expect(humanizeNumber(1234)).toBe("1.2K");
    expect(humanizeNumber(12345)).toBe("12K");
    expect(humanizeNumber(123456)).toBe("123K");
    expect(humanizeNumber(1234567)).toBe("1.2M");
    expect(humanizeNumber(12345678)).toBe("12M");
    expect(humanizeNumber(123456789)).toBe("123M");
  });
});
