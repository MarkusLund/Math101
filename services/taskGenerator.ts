import { Operator, Task } from '../types';
import { EMOJIS, SYMBOLS } from '../constants';

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface GenResult { op1: number; op2: number; answer: number }

const generateAddition = (maxSum: number, noZeros: boolean): GenResult => {
  const minVal = noZeros ? 1 : 0;
  const answer = getRandomInt(noZeros ? 2 : 1, maxSum);
  const op1 = getRandomInt(minVal, answer - minVal);
  return { op1, op2: answer - op1, answer };
};

const generateSubtraction = (maxSum: number, noZeros: boolean): GenResult => {
  const minVal = noZeros ? 1 : 0;
  const op1 = getRandomInt(noZeros ? 2 : 1, maxSum);
  const op2 = getRandomInt(minVal, op1 - minVal);
  return { op1, op2, answer: op1 - op2 };
};

const generateMultiplication = (maxSum: number): GenResult => {
  const maxFactor = Math.max(1, Math.floor(Math.sqrt(maxSum)));
  const op1 = getRandomInt(1, maxFactor);
  const op2Max = Math.floor(maxSum / op1);
  const op2 = getRandomInt(1, Math.max(1, op2Max));
  return { op1, op2, answer: op1 * op2 };
};

const generateDivision = (maxSum: number): GenResult => {
  const maxFactor = Math.max(1, Math.floor(Math.sqrt(maxSum)));
  const divisor = getRandomInt(1, maxFactor);
  const quotient = getRandomInt(1, Math.max(1, Math.floor(maxSum / divisor)));
  const dividend = divisor * quotient;
  return { op1: dividend, op2: divisor, answer: quotient };
};

const generate = (operator: Operator, maxSum: number, noZeros: boolean): GenResult => {
  switch (operator) {
    case Operator.ADDITION: return generateAddition(maxSum, noZeros);
    case Operator.SUBTRACTION: return generateSubtraction(maxSum, noZeros);
    case Operator.MULTIPLICATION: return generateMultiplication(maxSum);
    case Operator.DIVISION: return generateDivision(maxSum);
  }
};

export const generateTasks = (
  maxSum: number,
  count: number,
  isBlackAndWhite: boolean,
  operators: Operator[],
  noZeros: boolean = false,
): Task[] => {
  const tasks: Task[] = [];
  const usedProblems = new Set<string>();

  // Select unique items for each task
  const itemPool = isBlackAndWhite ? [...SYMBOLS] : [...EMOJIS];
  const selectedItems: string[] = [];
  for (let i = 0; i < count && itemPool.length > 0; i++) {
    const idx = Math.floor(Math.random() * itemPool.length);
    selectedItems.push(itemPool[idx]);
    itemPool.splice(idx, 1);
  }

  for (let i = 0; i < count; i++) {
    let operand1 = 0;
    let operand2 = 0;
    let answer = 0;
    let operator = getRandomElement(operators);
    let attempts = 0;
    let problemKey = '';

    do {
      operator = getRandomElement(operators);
      const result = generate(operator, maxSum, noZeros);
      operand1 = result.op1;
      operand2 = result.op2;
      answer = result.answer;

      problemKey = `${operand1}${operator}${operand2}`;

      if (!usedProblems.has(problemKey)) break;
      attempts++;
      if (attempts > 100) break;
    } while (true);

    usedProblems.add(problemKey);

    const item = selectedItems[i] || (isBlackAndWhite ? getRandomElement(SYMBOLS) : getRandomElement(EMOJIS));

    tasks.push({ id: i, operand1, operand2, operator, item, answer });
  }
  return tasks;
};
