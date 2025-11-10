import { Difficulty, Task } from '../types.ts';
import { EMOJIS } from '../constants.ts';

const getRandomInt = (max: number) => Math.floor(Math.random() * (max + 1));
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateTasks = (difficulty: Difficulty, count: number): Task[] => {
  const tasks: Task[] = [];
  const maxSum = difficulty === Difficulty.VERY_EASY ? 5 : 10;
  
  for (let i = 0; i < count; i++) {
    let operand1 = 0;
    let operand2 = 0;
    let answer = 0;

    // Ensure we don't get 0+0
    while (answer === 0) {
        answer = getRandomInt(maxSum);
        operand1 = getRandomInt(answer);
        operand2 = answer - operand1;
    }
    
    // Simple shuffle for visual variety in operands
    const [finalOperand1, finalOperand2] = Math.random() > 0.5 ? [operand1, operand2] : [operand2, operand1];

    tasks.push({
      id: i,
      operand1: finalOperand1,
      operand2: finalOperand2,
      emoji: getRandomElement(EMOJIS),
      answer: answer,
    });
  }
  return tasks;
};