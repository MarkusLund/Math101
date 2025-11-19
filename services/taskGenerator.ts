import { Task } from '../types';
import { EMOJIS, SYMBOLS } from '../constants';

const getRandomInt = (max: number) => Math.floor(Math.random() * (max + 1));
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateTasks = (maxSum: number, count: number, isBlackAndWhite: boolean): Task[] => {
  const tasks: Task[] = [];
  const usedProblems = new Set<string>();

  // Select unique items (emojis or symbols) for each task
  const itemPool = isBlackAndWhite ? [...SYMBOLS] : [...EMOJIS];
  const selectedItems: string[] = [];
  for (let i = 0; i < count && itemPool.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * itemPool.length);
    selectedItems.push(itemPool[randomIndex]);
    itemPool.splice(randomIndex, 1); // Remove to ensure uniqueness
  }

  // Helper to get a random integer with reduced probability for 0
  const getWeightedRandomInt = (max: number): number => {
    // 20% chance to allow 0, otherwise generate from 1 to max
    // If max is 0, we must return 0
    if (max === 0) return 0;
    
    if (Math.random() > 0.2) {
        // Generate number between 1 and max
        return Math.floor(Math.random() * max) + 1;
    }
    // Generate number between 0 and max (standard)
    return Math.floor(Math.random() * (max + 1));
  };

  for (let i = 0; i < count; i++) {
    let operand1 = 0;
    let operand2 = 0;
    let answer = 0;
    let attempts = 0;
    let problemKey = "";

    // Try to generate a unique problem
    do {
        // Generate answer first to respect difficulty (maxSum)
        // For answer, we generally want it to be > 0 if possible, but 0 is valid
        answer = getWeightedRandomInt(maxSum);
        
        // Generate operand1 based on answer
        // We also want to reduce 0 frequency for operands
        if (answer === 0) {
            operand1 = 0;
        } else {
            // Try to avoid 0 for operand1 if possible
            if (Math.random() > 0.2) {
                 operand1 = Math.floor(Math.random() * answer) + 1;
                 // If we accidentally got > answer (shouldn't happen with logic above but safe guard)
                 if (operand1 > answer) operand1 = answer; 
            } else {
                 operand1 = getRandomInt(answer);
            }
        }
        
        operand2 = answer - operand1;

        // Randomize order of operands for display
        const [finalOp1, finalOp2] = Math.random() > 0.5 ? [operand1, operand2] : [operand2, operand1];
        
        // Store as "op1+op2" to check uniqueness. 
        // Note: "2+7" and "7+2" are distinct strings here, so both are allowed as per requirements.
        // The user said: "It is ok that both 2 +7 and 7 + 2 is present."
        // But "Make sure a math problem is never dupicated." implies exact duplicates like "2+7" and "2+7" are bad.
        problemKey = `${finalOp1}+${finalOp2}`;
        
        if (!usedProblems.has(problemKey)) {
            operand1 = finalOp1;
            operand2 = finalOp2;
            break;
        }

        attempts++;
        // If we can't find unique problem after many attempts, just use what we have (unlikely with small count)
        if (attempts > 100) break;
    } while (true);

    usedProblems.add(problemKey);

    const item = selectedItems[i] || (isBlackAndWhite ? getRandomElement(SYMBOLS) : getRandomElement(EMOJIS));

    tasks.push({
      id: i,
      operand1: operand1,
      operand2: operand2,
      item: item,
      answer: operand1 + operand2,
    });
  }
  return tasks;
};