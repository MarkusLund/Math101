import { Difficulty } from './types.ts';

export const EMOJIS = ['⚽️', '🚗', '🚜', '🍎', '🍌', '🐶', '🐱', '🚀', '⭐', '❤️', '🍓', '🧸'];
export const SYMBOLS = ['kid_star', 'toys', 'favorite', 'local_shipping', 'agriculture', 'trophy', 'electric_bolt'];


export const translations = {
  en: {
    title: "Math Task Generator",
    difficulty: "Difficulty",
    veryEasy: "Very Easy (Sums to 5)",
    easy: "Easy (Sums to 10)",
    showDigits: "Show Digits 1-9",
    interactiveMode: "Interactive Mode",
    blackAndWhiteMode: "Black & White Mode",
    randomize: "Randomize",
    print: "Print",
    correct: "Correct!",
    tryAgain: "Try Again!",
    language: "Language",
  },
  no: {
    title: "Matteoppgave-generator",
    difficulty: "Vanskelighetsgrad",
    veryEasy: "Veldig Lett (Summer til 5)",
    easy: "Lett (Summer til 10)",
    showDigits: "Vis Tallene 1-9",
    interactiveMode: "Interaktiv Modus",
    blackAndWhiteMode: "Svart-hvitt Modus",
    randomize: "Nye Oppgaver",
    print: "Skriv ut",
    correct: "Riktig!",
    tryAgain: "Prøv Igjen!",
    language: "Språk",
  },
};

export const DIFFICULTY_LEVELS = [
  { id: Difficulty.VERY_EASY, langKey: 'veryEasy' },
  { id: Difficulty.EASY, langKey: 'easy' },
];

export const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'no', name: 'Norsk' },
];