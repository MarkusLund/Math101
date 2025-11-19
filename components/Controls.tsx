import React from 'react';
import { DisplayMode, Language } from '../types';
import { DIFFICULTY_STEPS, DISPLAY_MODES, LANGUAGES } from '../constants';

interface ControlsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
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
  onRandomize: () => void;
  onPrint: () => void;
}

const ToggleButton: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer group">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${checked ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${checked ? 'translate-x-6' : ''}`}></div>
    </div>
    <div className="ml-3 text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{label}</div>
  </label>
);

export const Controls: React.FC<ControlsProps> = ({
  language,
  setLanguage,
  t,
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
  onRandomize,
  onPrint,
}) => {
  return (
    <div className="w-full xl:w-96 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none no-print flex-shrink-0 border border-slate-100 dark:border-slate-700">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 font-display tracking-tight text-center xl:text-left">
        <span className="text-primary-500">Math</span> 101
      </h1>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.language}</label>
          <div className="flex bg-slate-100 dark:bg-slate-900/50 rounded-xl p-1.5 gap-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  language === lang.id 
                    ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {t.difficulty}: <span className="text-primary-600 dark:text-primary-400 text-lg">{maxSum}</span>
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max={DIFFICULTY_STEPS.length - 1}
              value={DIFFICULTY_STEPS.indexOf(maxSum)}
              onChange={(e) => setMaxSum(DIFFICULTY_STEPS[parseInt(e.target.value)])}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>{DIFFICULTY_STEPS[0]}</span>
              <span>{DIFFICULTY_STEPS[DIFFICULTY_STEPS.length - 1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.displayMode}</label>
          <div className="flex flex-col space-y-2">
            {DISPLAY_MODES.map(mode => {
              const isDisabled = maxSum > 15 && mode.id !== DisplayMode.NUMBERS_ONLY;
              return (
                <button
                  key={mode.id}
                  onClick={() => !isDisabled && setDisplayMode(mode.id)}
                  disabled={isDisabled}
                  className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    displayMode === mode.id 
                      ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30 transform scale-[1.02]' 
                      : isDisabled
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:pl-5'
                  }`}
                >
                  {t[mode.langKey]}
                  {isDisabled && <span className="ml-2 text-xs opacity-70">(Max 15)</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <ToggleButton checked={showDigits} onChange={() => setShowDigits(!showDigits)} label={t.showDigits} />
          <ToggleButton checked={interactiveMode} onChange={onToggleInteractive} label={t.interactiveMode} />
          <ToggleButton checked={isBlackAndWhite} onChange={() => setIsBlackAndWhite(!isBlackAndWhite)} label={t.blackAndWhiteMode} />
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-8 space-y-4">
          <button onClick={onRandomize} className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-primary-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-slate-800">
            <span className="material-symbols-rounded">refresh</span>
            {t.randomize}
          </button>
          <button onClick={onPrint} className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-900 dark:hover:bg-slate-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-slate-800/20 dark:shadow-slate-700/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-800">
            <span className="material-symbols-rounded">print</span>
            {t.print}
          </button>
        </div>
      </div>
    </div>
  );
};