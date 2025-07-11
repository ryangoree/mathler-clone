export const operators = ["+", "-", "*", "/"];

/**
 * Evaluate a simple mathematical expression string made up of integers and the
 * four basic arithmetic {@linkcode operators}.
 */
export function evalExpression(calc: string) {
  calc = calc.replaceAll(" ", "");

  // Validate format
  // https://regex101.com/r/O3Gxgo/6
  if (!/^-?\d+((-|[+*/]-?)\d+)+$/.test(calc)) {
    throw new Error(`Invalid calculation string: "${calc}"`);
  }

  // Multiply and divide
  while (calc.includes("*") || calc.includes("/")) {
    // https://regex101.com/r/yQeJ20/1
    calc = calc.replace(/((?:^-)?\d+)([*/])(-?\d+)/, (_, a, op, b) => {
      const result = op === "*" ? +a * +b : +a / +b;
      return String(result);
    });
  }

  // Add and subtract
  // Slice the first char to avoid matching negative signs
  while (calc.includes("+") || calc.slice(1).includes("-")) {
    // https://regex101.com/r/rLQsGA/1
    calc = calc.replace(/((?:^-)?\d+)([+-])(-?\d+)/, (_, a, op, b) => {
      const result = op === "+" ? +a + +b : +a - +b;
      return String(result);
    });
  }

  return calc;
}
