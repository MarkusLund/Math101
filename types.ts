export type Language = 'en' | 'no';



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