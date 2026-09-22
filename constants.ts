import { DisplayMode, Operator, SignPuzzleDifficulty } from './types';

export const EMOJIS = ['⚽️', '🚗', '🚜', '🍎', '🍌', '🐶', '🐱', '🚀', '⭐', '❤️', '🍓', '🧸'];
export const SYMBOLS = ['kid_star', 'toys', 'favorite', 'local_shipping', 'agriculture', 'trophy', 'electric_bolt'];

export const OPERATOR_SYMBOLS: Record<Operator, string> = {
  [Operator.ADDITION]: '+',
  [Operator.SUBTRACTION]: '−',
  [Operator.MULTIPLICATION]: '×',
  [Operator.DIVISION]: '÷',
};

export const translations = {
  en: {
    title: "Math Task Generator",
    mode: "Mode",
    modeCalculate: "Calculate",
    modeSignPuzzle: "Fill in Signs (+ / −)",
    difficulty: "Difficulty",
    veryEasy: "Very Easy (Sums to 5)",
    easy: "Easy (Sums to 10)",
    medium: "Medium (Sums to 20)",
    operators: "Operators",
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",
    division: "Division",
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
    name: "Name",
    date: "Date",
    seoTitle: "Math Task Generator - Free Printable Math Worksheets for Kids",
    seoDescription: "Generate and print free math worksheets for kids. Customize difficulty, use symbols or numbers, and practice math with this easy-to-use tool.",
    signPuzzleTitle: "Math Task",
    signPuzzleSubtitle: "Put plus or minus in the circles below so it matches the sum.",
    signPuzzleInstructions: "Drag or tap plus (+) and minus (−) to fill the circles.",
    signDifficultyEasy: "Easy (2 numbers)",
    signDifficultyMedium: "Medium (3 numbers)",
    signDifficultyHard: "Hard (4 numbers)",
    puzzleAllCorrect: "Awesome! Everything is correct! 🎉",
    clear: "Clear",
    settings: "Settings",
    close: "Close",
  },
  no: {
    title: "Matteoppgave-generator",
    mode: "Modus",
    modeCalculate: "Regn ut svar",
    modeSignPuzzle: "Sett inn tegn (+ / −)",
    difficulty: "Vanskelighetsgrad",
    veryEasy: "Veldig Lett (Summer til 5)",
    easy: "Lett (Summer til 10)",
    medium: "Middels (Summer til 20)",
    operators: "Regnearter",
    addition: "Addisjon",
    subtraction: "Subtraksjon",
    multiplication: "Multiplikasjon",
    division: "Divisjon",
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
    name: "Navn",
    date: "Dato",
    seoTitle: "Matteoppgave-generator - Gratis Utskriftsvennlige Matteark for Barn",
    seoDescription: "Lag og skriv ut gratis matteark for barn. Tilpass vanskelighetsgrad, bruk symboler eller tall, og øv på matte med dette enkle verktøyet.",
    signPuzzleTitle: "Matteoppgave",
    signPuzzleSubtitle: "Sett pluss eller minus i sirklene under slik at det stemmer med summen.",
    signPuzzleInstructions: "Dra eller trykk på pluss (+) og minus (−) for å fylle sirklene.",
    signDifficultyEasy: "Lett (2 tall)",
    signDifficultyMedium: "Middels (3 tall)",
    signDifficultyHard: "Vanskelig (4 tall)",
    puzzleAllCorrect: "Kjempebra! Alt er riktig! 🎉",
    clear: "Tøm",
    settings: "Innstillinger",
    close: "Lukk",
  },
};

export const DIFFICULTY_STEPS = [5, 10, 11, 12, 13, 14, 15, 20, 30, 50, 100, 200, 500, 1000];

export const DISPLAY_MODES = [
  { id: DisplayMode.SYMBOLS_ONLY, langKey: 'symbolsOnly' },
  { id: DisplayMode.MIXED, langKey: 'mixed' },
  { id: DisplayMode.NUMBERS_ONLY, langKey: 'numbersOnly' },
];

export const SIGN_PUZZLE_DIFFICULTIES = [
  { id: SignPuzzleDifficulty.EASY, langKey: 'signDifficultyEasy' },
  { id: SignPuzzleDifficulty.MEDIUM, langKey: 'signDifficultyMedium' },
  { id: SignPuzzleDifficulty.HARD, langKey: 'signDifficultyHard' },
];

export const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'no', name: 'Norsk' },
];