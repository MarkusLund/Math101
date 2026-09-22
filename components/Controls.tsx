import React from 'react';
import { AppMode, DisplayMode, Language, Operator, SignPuzzleDifficulty } from '../types';
import {
  DIFFICULTY_STEPS,
  DISPLAY_MODES,
  LANGUAGES,
  OPERATOR_SYMBOLS,
  SIGN_PUZZLE_DIFFICULTIES,
} from '../constants';

interface ControlsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  signDifficulty: SignPuzzleDifficulty;
  setSignDifficulty: (diff: SignPuzzleDifficulty) => void;
  maxSum: number;
  setMaxSum: (sum: number) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  showDigits: boolean;
  setShowDigits: (show: boolean) => void;
  interactiveMode: boolean;
  onToggleInteractive: () => void;
  isBlackAndWhite: boolean;
  setIsBlackAndWhite: (isBw: boolean) => void;
  operators: Operator[];
  setOperators: (ops: Operator[]) => void;
  onRandomize: () => void;
  onPrint: () => void;
  /** Rendered inside the mobile settings sheet: no card chrome, no app title. */
  embedded?: boolean;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </span>
    {children}
  </div>
);

/** Segmented control — a single tinted track, no per-item borders. */
const Segmented: React.FC<{ children: React.ReactNode; cols?: string }> = ({ children, cols = 'flex' }) => (
  <div className={`${cols} gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1`}>{children}</div>
);

const segItem = (active: boolean) =>
  `min-w-0 flex-1 rounded-lg px-2 py-2 text-center text-sm font-bold leading-tight transition-colors active:scale-[0.98] ${
    active
      ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm'
      : 'text-slate-500 dark:text-slate-400'
  }`;

const ToggleRow: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
    <span className="relative flex-shrink-0">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        className={`block h-7 w-12 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      />
      <span
        className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </span>
  </label>
);

const optionButton = (active: boolean, disabled = false) =>
  `w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors active:scale-[0.99] ${
    active
      ? 'bg-primary-500 text-white'
      : disabled
      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
  }`;

export const Controls: React.FC<ControlsProps> = ({
  language,
  setLanguage,
  t,
  appMode,
  setAppMode,
  signDifficulty,
  setSignDifficulty,
  maxSum,
  setMaxSum,
  displayMode,
  setDisplayMode,
  showDigits,
  setShowDigits,
  interactiveMode,
  onToggleInteractive,
  isBlackAndWhite,
  setIsBlackAndWhite,
  operators,
  setOperators,
  onRandomize,
  onPrint,
  embedded = false,
}) => {
  const toggleOperator = (op: Operator) => {
    if (operators.includes(op)) {
      if (operators.length <= 1) return; // Keep at least one
      setOperators(operators.filter(o => o !== op));
    } else {
      setOperators([...operators, op]);
    }
  };

  const operatorOptions: { id: Operator; langKey: string }[] = [
    { id: Operator.ADDITION, langKey: 'addition' },
    { id: Operator.SUBTRACTION, langKey: 'subtraction' },
    { id: Operator.MULTIPLICATION, langKey: 'multiplication' },
    { id: Operator.DIVISION, langKey: 'division' },
  ];

  const hasSymbolIncompatibleOperator = operators.some(
    op => op === Operator.MULTIPLICATION || op === Operator.DIVISION
  );

  return (
    <div
      className={
        embedded
          ? 'no-print'
          : 'no-print w-full rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm'
      }
    >
      {!embedded && (
        <h1 className="mb-5 font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          <span className="text-primary-500">Math</span> 101
        </h1>
      )}

      <div className="space-y-5">
        <Field label={t.mode}>
          <Segmented cols="grid grid-cols-2">
            <button
              onClick={() => setAppMode(AppMode.CALCULATE)}
              className={segItem(appMode === AppMode.CALCULATE)}
            >
              {t.modeCalculate}
            </button>
            <button
              onClick={() => setAppMode(AppMode.SIGN_PUZZLE)}
              className={segItem(appMode === AppMode.SIGN_PUZZLE)}
            >
              {t.modeSignPuzzle}
            </button>
          </Segmented>
        </Field>

        <Field label={t.language}>
          <Segmented>
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={segItem(language === lang.id)}
              >
                {lang.name}
              </button>
            ))}
          </Segmented>
        </Field>

        {/* SIGN PUZZLE CONTROLS */}
        {appMode === AppMode.SIGN_PUZZLE && (
          <>
            <Field label={t.difficulty}>
              <div className="space-y-1.5">
                {SIGN_PUZZLE_DIFFICULTIES.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => setSignDifficulty(diff.id)}
                    className={optionButton(signDifficulty === diff.id)}
                  >
                    {t[diff.langKey]}
                  </button>
                ))}
              </div>
            </Field>

            <div>
              <ToggleRow
                checked={interactiveMode}
                onChange={onToggleInteractive}
                label={t.interactiveMode}
              />
              <ToggleRow
                checked={isBlackAndWhite}
                onChange={() => setIsBlackAndWhite(!isBlackAndWhite)}
                label={t.blackAndWhiteMode}
              />
            </div>
          </>
        )}

        {/* STANDARD CALCULATE CONTROLS */}
        {appMode === AppMode.CALCULATE && (
          <>
            <Field label={`${t.difficulty} · ${maxSum}`}>
              <input
                type="range"
                min="0"
                max={DIFFICULTY_STEPS.length - 1}
                value={DIFFICULTY_STEPS.indexOf(maxSum)}
                onChange={e => setMaxSum(DIFFICULTY_STEPS[parseInt(e.target.value)])}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 dark:bg-slate-700 accent-primary-500"
              />
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>{DIFFICULTY_STEPS[0]}</span>
                <span>{DIFFICULTY_STEPS[DIFFICULTY_STEPS.length - 1]}</span>
              </div>
            </Field>

            <Field label={t.operators}>
              <div className="grid grid-cols-2 gap-1.5">
                {operatorOptions.map(op => {
                  const isActive = operators.includes(op.id);
                  return (
                    <button
                      key={op.id}
                      onClick={() => toggleOperator(op.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors active:scale-[0.98] ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-base leading-none">{OPERATOR_SYMBOLS[op.id]}</span>
                      <span className="truncate">{t[op.langKey]}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={t.displayMode}>
              <div className="space-y-1.5">
                {DISPLAY_MODES.map(mode => {
                  const isDisabled =
                    (maxSum > 15 || hasSymbolIncompatibleOperator) &&
                    mode.id !== DisplayMode.NUMBERS_ONLY;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => !isDisabled && setDisplayMode(mode.id)}
                      disabled={isDisabled}
                      className={optionButton(displayMode === mode.id, isDisabled)}
                    >
                      {t[mode.langKey]}
                      {isDisabled && <span className="ml-2 text-xs opacity-70">(max 15)</span>}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div>
              <ToggleRow checked={showDigits} onChange={() => setShowDigits(!showDigits)} label={t.showDigits} />
              <ToggleRow checked={interactiveMode} onChange={onToggleInteractive} label={t.interactiveMode} />
              <ToggleRow
                checked={isBlackAndWhite}
                onChange={() => setIsBlackAndWhite(!isBlackAndWhite)}
                label={t.blackAndWhiteMode}
              />
            </div>
          </>
        )}

        {/* Action Buttons — the mobile top bar already exposes these */}
        <div className={`grid grid-cols-[1fr_auto] gap-2 ${embedded ? 'hidden' : ''}`}>
          <button
            onClick={onRandomize}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 font-bold text-white transition-colors hover:bg-primary-600 active:scale-[0.98]"
          >
            <span className="material-symbols-rounded text-[20px]">refresh</span>
            {t.randomize}
          </button>
          <button
            onClick={onPrint}
            aria-label={t.print}
            title={t.print}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 dark:bg-slate-700 text-white transition-colors hover:bg-slate-900 active:scale-[0.98]"
          >
            <span className="material-symbols-rounded text-[22px]">print</span>
          </button>
        </div>

      </div>
    </div>
  );
};
