import { DisplayMode } from './types';

export const EMOJIS = ['⚽️', '🚗', '🚜', '🍎', '🍌', '🐶', '🐱', '🚀', '⭐', '❤️', '🍓', '🧸'];
export const SYMBOLS = ['kid_star', 'toys', 'favorite', 'local_shipping', 'agriculture', 'trophy', 'electric_bolt'];


export const translations = {
  en: {
    title: "Math Task Generator",
    difficulty: "Difficulty",
    veryEasy: "Very Easy (Sums to 5)",
    easy: "Easy (Sums to 10)",
    medium: "Medium (Sums to 20)",
    displayMode: "Display Mode",
    symbolsOnly: "Symbols Only",
    mixed: "Mixed (Symbols & Numbers)",
    numbersOnly: "Numbers Only",
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
    medium: "Middels (Summer til 20)",
    displayMode: "Visningsmodus",
    symbolsOnly: "Bare Symboler",
    mixed: "Blandet (Symboler & Tall)",
    numbersOnly: "Bare Tall",
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

export const DIFFICULTY_STEPS = [5, 10, 11, 12, 13, 14, 15, 20, 30, 50, 100, 200, 500, 1000];

export const DISPLAY_MODES = [
  { id: DisplayMode.SYMBOLS_ONLY, langKey: 'symbolsOnly' },
  { id: DisplayMode.MIXED, langKey: 'mixed' },
  { id: DisplayMode.NUMBERS_ONLY, langKey: 'numbersOnly' },
];

export const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'no', name: 'Norsk' },
];