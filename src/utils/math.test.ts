import { evalExpression } from "src/utils/math";
import { assert, describe, expect, test } from "vitest";

describe("evalCalcString", () => {
  test("should evaluate valid calculations", { timeout: 2000 }, () => {
    expect(evalExpression("1+2")).toBe(String(1 + 2));
    expect(evalExpression("2-3")).toBe(String(2 - 3));
    expect(evalExpression("4*5")).toBe(String(4 * 5));
    expect(evalExpression("8/4")).toBe(String(8 / 4));
    expect(evalExpression("10+5-2")).toBe(String(10 + 5 - 2));
    expect(evalExpression("100-50/2")).toBe(String(100 - 50 / 2));
    expect(evalExpression("3*2+1")).toBe(String(3 * 2 + 1));
    expect(evalExpression("-1*2*3*4-5")).toBe(String(-1 * 2 * 3 * 4 - 5));
    expect(evalExpression("10*5/2*10")).toBe(String(((10 * 5) / 2) * 10));
    expect(evalExpression("10+-5")).toBe(String(10 + -5));
    expect(evalExpression("10*-5")).toBe(String(10 * -5));
  });

  test("should throw error for invalid calculations", () => {
    const invalidCalcs = [
      "1+",
      "1+x",
      "1++1",
      "2**3",
      "4--2",
      "8//4",
      "10+5**2",
      "100-50//2",
    ];
    for (const calc of invalidCalcs) {
      let error: unknown;
      try {
        evalExpression(calc);
      } catch (e) {
        error = e;
      }
      assert(error instanceof Error, `Expected error for "${calc}"`);
    }
  });
});
