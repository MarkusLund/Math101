export type Language = 'en' | 'no';

export enum Operator {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
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
  operator: Operator;
  item: string;
  answer: number;
}

export enum AppMode {
  CALCULATE = 'CALCULATE',
  SIGN_PUZZLE = 'SIGN_PUZZLE',
}

export enum SignPuzzleDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface SignPuzzleTask {
  id: number;
  numbers: number[];
  target: number;
  solution: ('+' | '-')[];
}