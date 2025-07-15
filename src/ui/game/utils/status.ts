import { evaluate } from "src/utils/math";

export type InputStatus = "correct" | "present" | "absent";

export interface AnswerStatus {
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
}

export function getAnswerStatus({
  answer,
  targetEquation,
}: {
  answer: string;
  targetEquation: string;
}): AnswerStatus {
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
      ? // Overwrite "present" statuses in cumulative solutions
        Array.from({ length: answer.length }, () => "correct")
      : exactStatuses,
  };
}
