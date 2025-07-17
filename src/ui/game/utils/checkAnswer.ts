import type { InputStatus } from "src/ui/game/types";
import { evaluate } from "src/utils/math";

export function checkAnswer({
  answer,
  targetEquation,
}: {
  answer: string;
  targetEquation: string;
}): {
  /**
   * Whether the answer and expected equation evaluate to the same number.
   */
  isEqual: boolean;
  /**
   * Whether the answer is correct.
   */
  isCorrect: boolean;
  /**
   * The status of each character in the answer compared to the expected
   * equation.
   */
  statuses: InputStatus[];
} {
  // Short-circuit if the answer is exactly the target equation
  if (answer === targetEquation) {
    return {
      isEqual: true,
      isCorrect: true,
      statuses: Array(answer.length).fill("correct"),
    };
  }

  // Check if the answer and target equation evaluate to the same number
  const isEqual = evaluate(answer) === evaluate(targetEquation);

  // Determine the status of each character in the answer
  let isCorrect = isEqual;
  const exactStatuses = answer.split("").map((character, i) => {
    if (targetEquation[i] === character) {
      return "correct";
    }
    if (targetEquation.includes(character)) {
      return "present";
    }
    isCorrect = false;
    return "absent";
  });

  return {
    isEqual,
    isCorrect,
    statuses: isCorrect
      ? // Mark all as "correct" in cumulative solutions
        Array(answer.length).fill("correct")
      : exactStatuses,
  };
}
