// A quick and dirty math expression evaluator. I tried a few libraries, but
// they were either too heavy or didn't support syntax supported by Mathler. I
// suspect Mathler is using `eval` or `new Function` under the hood, but I
// wanted to see if I could support the same syntax without arbitrary code
// execution. A multi-step lexer + parser would be more robust, but this was a
// fun exercise to see how far I could get with regex and string manipulation.

/**
 * Concatenates a sequence of strings and regular expressions into a single
 * regular expression.
 */
function concatPatterns(patterns: (string | RegExp)[], flags?: string): RegExp {
  return new RegExp(
    patterns.map((p) => (p instanceof RegExp ? p.source : p)).join(""),
    flags,
  );
}

// https://regex101.com/r/VV3B0V/1
const unaryRegex = /(?<!\d)(?:(?<!\+)\+|(?<!-)-)/;
// https://regex101.com/r/CBRWl6/1
const unsignedNumRegex = /\d*\.?\d*(?:e[+-]?\d+)?/i;
// https://regex101.com/r/PhjIPJ/1
const terminalRegex = concatPatterns(
  ["^(", unaryRegex, ")*?", unsignedNumRegex, "$"],
  "i",
);

/**
 * Evaluates a terminal expression (a single number preceded by optional
 * unary operators).
 */
function evaluateTerminal(expression: string) {
  if (!expression) return 0;
  if (!expression.match(terminalRegex)) {
    throw new Error(`Invalid expression: ${expression}`);
  }
  const mantissa = expression.split("e")[0];
  const negativeSigns = mantissa?.match(/-/g) || [];
  const sign = negativeSigns.length % 2 ? "-" : "";
  const abs = expression.replace(/^[+-]+/g, "");
  const num = Number(`${sign}${abs}`);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid number: ${expression}`);
  }
  return num;
}

/**
 * A list of operators with their evaluation functions, ordered by precedence.
 */
const operatorPrecedence: {
  operator: string;
  evaluate: (left: number, right: number) => number;
  associativity?: "left" | "right";
}[] = [
  {
    operator: "**",
    evaluate: (left, right) => left ** right,
    associativity: "right",
  },
  {
    operator: "/",
    evaluate: (left, right) => left / right,
  },
  {
    operator: "*",
    evaluate: (left, right) => left * right,
  },
  {
    operator: "%",
    evaluate: (left, right) => left % right,
  },
  {
    operator: "-",
    evaluate: (left, right) => left - right,
  },
  {
    operator: "+",
    evaluate: (left, right) => left + right,
  },
  {
    operator: "<<",
    evaluate: (left, right) => left << right,
  },
  {
    operator: ">>",
    evaluate: (left, right) => left >> right,
  },
  {
    operator: "&",
    evaluate: (left, right) => left & right,
  },
  {
    operator: "^",
    evaluate: (left, right) => left ^ right,
  },
  {
    operator: "|",
    evaluate: (left, right) => left | right,
  },
];

/**
 * Creates an operator evaluator function that can evaluate expressions with
 * the given operator.
 */
function createOperatorEvaluator({
  operator,
  evaluateOperand,
  evaluate,
  associativity = "left",
}: {
  operator: string;
  evaluateOperand: (expression: string) => number;
  evaluate: (left: number, right: number) => number;
  associativity?: "left" | "right";
}) {
  // https://regex101.com/r/WrhG2f/1
  const operatorRegex = concatPatterns([
    "(?<=\\d)",
    operator.replace(/([+*|^&])/g, "\\$1"),
    "(?=",
    unaryRegex,
    "*[\\d.])",
  ]);
  return (expression: string): number => {
    if (!expression.includes(operator)) {
      return evaluateOperand(expression);
    }
    const operands = expression.split(operatorRegex);
    const isLeftAssociative = associativity === "left";
    const initial = isLeftAssociative ? operands.shift() : operands.pop();
    if (!initial) return 0;
    const initialValue = evaluateOperand(initial);
    if (!operands.length) return initialValue;
    return isLeftAssociative
      ? operands.reduce(
          (result, operand) => evaluate(result, evaluateOperand(operand)),
          initialValue,
        )
      : operands.reduceRight(
          (result, operand) => evaluate(evaluateOperand(operand), result),
          initialValue,
        );
  };
}

let evaluateOperand = evaluateTerminal;
for (const { operator, evaluate, associativity } of operatorPrecedence) {
  evaluateOperand = createOperatorEvaluator({
    operator,
    evaluateOperand,
    evaluate,
    associativity,
  });
}

const removableCharsRegex = /_|\s+|\/\/.*$/g;
const parenthesesRegex = /\(([^()]+)\)/g;

/**
 * Evaluates a mathematical expression string and returns the result. Supports
 * basic arithmetic, unary operators, parentheses, scientific notation, and
 * operator precedence.
 */
export function evaluate(expression: string): number {
  try {
    expression = expression.replace(removableCharsRegex, "");
    while (parenthesesRegex.test(expression)) {
      expression = expression.replace(parenthesesRegex, (_, inner) =>
        String(evaluateOperand(inner)),
      );
    }
    return evaluateOperand(expression);
  } catch (error) {
    // Wrap in a new error to prevent deep stack traces that include all
    // evaluation steps.
    const message = error instanceof Error ? error.message : String(error);
    console.error(new Error(message));

    return NaN;
  }
}
