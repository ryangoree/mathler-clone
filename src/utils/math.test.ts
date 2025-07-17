import { evaluate } from "src/utils/math";
import { assert, describe, expect, it, onTestFinished, vi } from "vitest";

describe("evaluate", () => {
  it("evaluates single numbers", () => {
    expect(evaluate("1")).toBe(1);
    expect(evaluate("12")).toBe(12);
    expect(evaluate("12.34")).toBe(12.34);
    expect(evaluate(".12")).toBe(0.12);
    expect(evaluate("12.")).toBe(12);
    expect(evaluate("1_2")).toBe(1_2);
  });

  it("evaluates basic expressions", { timeout: 2000 }, () => {
    expect(evaluate("1 + 2")).toBe(1 + 2);
    expect(evaluate("2 - 3")).toBe(2 - 3);
    expect(evaluate("4 * 5")).toBe(4 * 5);
    expect(evaluate("8 / 4")).toBe(8 / 4);
    expect(evaluate("2 ** 2")).toBe(2 ** 2);
    expect(evaluate("10 % 6")).toBe(10 % 6);
  });

  it("evaluates multi-step expressions", { timeout: 2000 }, () => {
    expect(evaluate("1 + 2 - 3")).toBe(1 + 2 - 3);
    expect(evaluate("2 - 3 + 4")).toBe(2 - 3 + 4);
    expect(evaluate("4 * 5 / 10")).toBe((4 * 5) / 10);
    expect(evaluate("8 / 4 * 6")).toBe((8 / 4) * 6);
    expect(evaluate("2 ** 3 ** 2")).toBe(2 ** (3 ** 2));
  });

  it("respects order of operations", { timeout: 2000 }, () => {
    expect(evaluate("1 + 2 * 3 - 4")).toBe(1 + 2 * 3 - 4);
    expect(evaluate("2 - 3 / 4 + 5")).toBe(2 - 3 / 4 + 5);
  });

  it("handles division by zero", { timeout: 2000 }, () => {
    expect(evaluate("1 / 0")).toBe(1 / 0);
    expect(evaluate("1 / 0 / 2")).toBe(1 / 0 / 2);
  });

  it("evaluates unary operators", () => {
    expect(evaluate("+12")).toBe(+12);
    expect(evaluate("+12")).toBe(+12);
    expect(evaluate("-12")).toBe(-12);
    expect(evaluate("+-12")).toBe(+-12);
    expect(evaluate("-+12")).toBe(-+12);
    expect(evaluate("+-+-+12")).toBe(+-+-+12);
    expect(evaluate("-+-+-12")).toBe(-+-+-12);
  });

  it("evaluates parentheses", () => {
    expect(evaluate("10 - (5 + 2)")).toBe(10 - (5 + 2));
    expect(evaluate("(1 + 2) * 3")).toBe((1 + 2) * 3);
    expect(evaluate("4 / (2 - 1)")).toBe(4 / (2 - 1));
    expect(evaluate("4 / ((2 - 1))")).toBe(4 / (2 - 1));
  });

  it("evaluates scientific expression", () => {
    expect(evaluate("1e2")).toBe(1e2);
    expect(evaluate("1E2")).toBe(1e2);
    expect(evaluate("12e3")).toBe(12e3);
    expect(evaluate("12.34e5")).toBe(12.34e5);
    expect(evaluate("12.34e-2")).toBe(12.34e-2);
  });

  it("evaluates complex expressions", () => {
    expect(evaluate("2e2 * -+3 / 6 + 3 ** (3 - 1) - 1")).toBe(
      (2e2 * -+3) / 6 + 3 ** (3 - 1) - 1,
    );
  });

  it("evaluates bitwise operators", () => {
    expect(evaluate("9 | 26")).toBe(9 | 26);
    expect(evaluate("9 ^ 26")).toBe(9 ^ 26);
    expect(evaluate("9 & 26")).toBe(9 & 26);
    expect(evaluate("26 >> 2")).toBe(26 >> 2);
    expect(evaluate("26 << 2")).toBe(26 << 2);
  });

  it("Returns NaN for invalid expressions", () => {
    const invalidExpressions = [
      "++12",
      "--12",
      "*12",
      "/12",
      "12+",
      "12-",
      "12*",
      "12/",
      "12++34",
      "12--34",
      "12***34",
      "12x",
      "12e1.2",
      "12||34",
      "12^^34",
      "12&&34",
      "12>>>34",
      "12<<<34",
      "1+(2*3",
    ];

    const consoleMock = vi.spyOn(console, "error").mockImplementation(() => {});
    onTestFinished(() => consoleMock.mockRestore());

    for (const expression of invalidExpressions) {
      const result = evaluate(expression);
      assert(
        Number.isNaN(result),
        `Expected NaN for "${expression}", got: ${result}`,
      );
    }
  });
});
