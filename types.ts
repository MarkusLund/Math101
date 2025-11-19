export type Language = 'en' | 'no';

export enum Difficulty {
  VERY_EASY = 'VERY_EASY', // Sums up to 5
  EASY = 'EASY',         // Sums up to 10
  MEDIUM = 'MEDIUM',     // Sums up to 20
}

export enum DisplayMode {
  SYMBOLS_ONLY = 'SYMBOLS_ONLY',     // Only emojis/symbols
  MIXED = 'MIXED',                   // Mix of symbols and numbers
  NUMBERS_ONLY = 'NUMBERS_ONLY',     // Only numbers
}

export interface Task {
  id: number;
  operand1: number;
  operand2: number;
  item: string;
  answer: number;
}