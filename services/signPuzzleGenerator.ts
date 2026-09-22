import { SignPuzzleDifficulty, SignPuzzleTask } from '../types';

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

type Sign = '+' | '-';

/**
 * Evaluates an array of numbers and signs from left to right.
 * Returns null if any sign is missing or not '+' / '-'.
 */
export const evaluateSignExpression = (
  numbers: number[],
  signs: (string | null)[]
): number | null => {
  if (signs.length !== numbers.length - 1) return null;
  let val = numbers[0];
  for (let i = 0; i < signs.length; i++) {
    const sign = signs[i];
    if (sign !== '+' && sign !== '-') return null;
    if (sign === '+') {
      val += numbers[i + 1];
    } else {
      val -= numbers[i + 1];
    }
  }
  return val;
};

/**
 * Checks if the combination has non-negative intermediate steps and final answer >= 0.
 */
const isValidElementaryEvaluation = (numbers: number[], signs: Sign[]): { valid: boolean; result: number } => {
  let val = numbers[0];
  for (let i = 0; i < signs.length; i++) {
    const sign = signs[i];
    if (sign === '+') {
      val += numbers[i + 1];
    } else {
      val -= numbers[i + 1];
      if (val < 0) return { valid: false, result: val };
    }
  }
  return { valid: val >= 0, result: val };
};

/**
 * Generate all 2^k sign combinations for k slots.
 */
const getAllCombinations = (count: number): Sign[][] => {
  if (count <= 0) return [[]];
  const prev = getAllCombinations(count - 1);
  const result: Sign[][] = [];
  for (const combo of prev) {
    result.push([...combo, '+']);
    result.push([...combo, '-']);
  }
  return result;
};

/**
 * Counts how many sign combinations produce the given target
 * while strictly maintaining non-negative intermediate results.
 */
const countValidSolutions = (numbers: number[], target: number): number => {
  const allCombos = getAllCombinations(numbers.length - 1);
  let count = 0;
  for (const combo of allCombos) {
    const evalResult = isValidElementaryEvaluation(numbers, combo);
    if (evalResult.valid && evalResult.result === target) {
      count++;
    }
  }
  return count;
};

const generateEasyTask = (): { numbers: number[]; target: number; solution: Sign[] } => {
  // 2 numbers: n1 [?] n2 = target (n1, n2 between 1 and 10)
  const sign: Sign = Math.random() < 0.5 ? '+' : '-';
  if (sign === '+') {
    const n1 = getRandomInt(1, 9);
    const n2 = getRandomInt(1, 10);
    return { numbers: [n1, n2], target: n1 + n2, solution: ['+'] };
  } else {
    const n1 = getRandomInt(2, 12);
    const n2 = getRandomInt(1, n1 - 1);
    return { numbers: [n1, n2], target: n1 - n2, solution: ['-'] };
  }
};

const generateMediumTask = (): { numbers: number[]; target: number; solution: Sign[] } | null => {
  // 3 numbers: n1 [?] n2 [?] n3 = target (numbers 1-9 or 10, like Safari yoghurt)
  // We desire a unique solution among all 4 combinations
  const allCombos: Sign[][] = [
    ['+', '+'],
    ['+', '-'],
    ['-', '+'],
    ['-', '-'],
  ];
  const chosenSolution = getRandomElement(allCombos);

  for (let attempt = 0; attempt < 50; attempt++) {
    const n1 = getRandomInt(2, 9);
    const n2 = getRandomInt(1, 8);
    const n3 = getRandomInt(1, 8);

    // Skip if n2 == n3 (prevents trivial +- vs -+ duplicate)
    if (n2 === n3) continue;

    const evalResult = isValidElementaryEvaluation([n1, n2, n3], chosenSolution);
    if (!evalResult.valid || evalResult.result <= 0 || evalResult.result > 20) continue;

    // Check if the solution is unique
    if (countValidSolutions([n1, n2, n3], evalResult.result) === 1) {
      return {
        numbers: [n1, n2, n3],
        target: evalResult.result,
        solution: chosenSolution,
      };
    }
  }
  return null;
};

const generateHardTask = (): { numbers: number[]; target: number; solution: Sign[] } | null => {
  // 4 numbers: n1 [?] n2 [?] n3 [?] n4 = target
  const allCombos = getAllCombinations(3);
  const chosenSolution = getRandomElement(allCombos);

  for (let attempt = 0; attempt < 60; attempt++) {
    const n1 = getRandomInt(3, 12);
    const n2 = getRandomInt(1, 9);
    const n3 = getRandomInt(1, 9);
    const n4 = getRandomInt(1, 9);

    const evalResult = isValidElementaryEvaluation([n1, n2, n3, n4], chosenSolution);
    if (!evalResult.valid || evalResult.result <= 0 || evalResult.result > 30) continue;

    // Check uniqueness
    if (countValidSolutions([n1, n2, n3, n4], evalResult.result) === 1) {
      return {
        numbers: [n1, n2, n3, n4],
        target: evalResult.result,
        solution: chosenSolution,
      };
    }
  }
  return null;
};

export const generateSignPuzzles = (
  difficulty: SignPuzzleDifficulty,
  count = 5
): SignPuzzleTask[] => {
  const tasks: SignPuzzleTask[] = [];
  const usedKeys = new Set<string>();

  for (let i = 0; i < count; i++) {
    let taskData: { numbers: number[]; target: number; solution: Sign[] } | null = null;
    let attempts = 0;

    while (attempts < 100) {
      attempts++;
      if (difficulty === SignPuzzleDifficulty.EASY) {
        taskData = generateEasyTask();
      } else if (difficulty === SignPuzzleDifficulty.MEDIUM) {
        taskData = generateMediumTask();
      } else {
        taskData = generateHardTask();
      }

      if (taskData) {
        const key = `${taskData.numbers.join(',')}=${taskData.target}`;
        if (!usedKeys.has(key)) {
          usedKeys.add(key);
          break;
        }
      }
    }

    // Fallback if random search failed for uniqueness
    if (!taskData) {
      if (difficulty === SignPuzzleDifficulty.EASY) {
        taskData = { numbers: [6, 2], target: 8, solution: ['+'] };
      } else if (difficulty === SignPuzzleDifficulty.MEDIUM) {
        // One of the classics from the photo
        const presets = [
          { numbers: [8, 2, 4], target: 6, solution: ['+', '-'] as Sign[] },
          { numbers: [7, 1, 3], target: 9, solution: ['-', '+'] as Sign[] },
          { numbers: [3, 4, 5], target: 12, solution: ['+', '+'] as Sign[] },
          { numbers: [8, 5, 4], target: 7, solution: ['-', '+'] as Sign[] },
          { numbers: [6, 6, 4], target: 8, solution: ['+', '-'] as Sign[] },
        ];
        taskData = presets[i % presets.length];
      } else {
        taskData = { numbers: [9, 3, 4, 2], target: 8, solution: ['-', '+', '-'] };
      }
    }

    tasks.push({
      id: i,
      numbers: taskData.numbers,
      target: taskData.target,
      solution: taskData.solution,
    });
  }

  return tasks;
};
