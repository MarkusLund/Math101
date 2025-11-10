import { Difficulty, Task } from '../types';
import { EMOJIS, SYMBOLS } from '../constants';

const getRandomInt = (max: number) => Math.floor(Math.random() * (max + 1));
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateTasks = (difficulty: Difficulty, count: number, isBlackAndWhite: boolean): Task[] => {
  const tasks: Task[] = [];
  const maxSum = difficulty === Difficulty.VERY_EASY ? 5 : 10;
  const usedAnswers = new Set<number>();

  // Select unique items (emojis or symbols) for each task
  const itemPool = isBlackAndWhite ? [...SYMBOLS] : [...EMOJIS];
  const selectedItems: string[] = [];
  for (let i = 0; i < count && itemPool.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * itemPool.length);
    selectedItems.push(itemPool[randomIndex]);
    itemPool.splice(randomIndex, 1); // Remove to ensure uniqueness
  }

  for (let i = 0; i < count; i++) {
    let operand1 = 0;
    let operand2 = 0;
    let answer = 0;

    // Ensure we don't get 0+0 and answer is unique
    let attempts = 0;
    while (answer === 0 || usedAnswers.has(answer)) {
        answer = getRandomInt(maxSum);
        operand1 = getRandomInt(answer);
        operand2 = answer - operand1;
        attempts++;

        // If we can't find unique answer after many attempts, reset
        if (attempts > 100) {
          usedAnswers.clear();
          attempts = 0;
        }
    }

    usedAnswers.add(answer);

    // Simple shuffle for visual variety in operands
    const [finalOperand1, finalOperand2] = Math.random() > 0.5 ? [operand1, operand2] : [operand2, operand1];

    const item = selectedItems[i] || (isBlackAndWhite ? getRandomElement(SYMBOLS) : getRandomElement(EMOJIS));

    tasks.push({
      id: i,
      operand1: finalOperand1,
      operand2: finalOperand2,
      item: item,
      answer: answer,
    });
  }
  return tasks;
};