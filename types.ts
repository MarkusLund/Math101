
export type Language = 'en' | 'no';

export enum Difficulty {
  VERY_EASY = 'VERY_EASY', // Sums up to 5
  EASY = 'EASY',         // Sums up to 10
}

export interface Task {
  id: number;
  operand1: number;
  operand2: number;
  emoji: string;
  answer: number;
}
