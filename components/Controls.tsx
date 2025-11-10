import React from 'react';
import { Difficulty, Language } from '../types.ts';
import { DIFFICULTY_LEVELS, LANGUAGES } from '../constants.ts';

interface ControlsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
  difficulty: Difficulty;
  setDifficulty: (level: Difficulty) => void;
  showDigits: boolean;
  setShowDigits: (show: boolean) => void;
  interactiveMode: boolean;
  onToggleInteractive: () => void;
  onRandomize: () => void;
  onPrint: () => void;
}

const ToggleButton: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
    </div>
    <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">{label}</div>
  </label>
);

export const Controls: React.FC<ControlsProps> = ({
  language,
  setLanguage,
  t,
  difficulty,
  setDifficulty,
  showDigits,
  setShowDigits,
  interactiveMode,
  onToggleInteractive,
  onRandomize,
  onPrint,
}) => {
  return (
    <div className="w-full xl:w-80 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg no-print flex-shrink-0">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.title}</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.language}</label>
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-200 dark:focus-visible:ring-offset-slate-700 ${
                  language === lang.id ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.difficulty}</label>
          <div className="flex flex-col space-y-2">
            {DIFFICULTY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setDifficulty(level.id)}
                className={`w-full text-left p-3 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800 ${
                  difficulty === level.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-200 dark:hover:bg-slate-600'
                }`}
              >
                {t[level.langKey]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ToggleButton checked={showDigits} onChange={() => setShowDigits(!showDigits)} label={t.showDigits} />
          <ToggleButton checked={interactiveMode} onChange={onToggleInteractive} label={t.interactiveMode} />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-3">
          <button onClick={onRandomize} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10.899 9.899a7.002 7.002 0 01-11.601-2.566 1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101z" clipRule="evenodd" /></svg>
            {t.randomize}
          </button>
          <button onClick={onPrint} className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v3h6v-3zm2-4h-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1H5V9h10v3z" clipRule="evenodd" /></svg>
            {t.print}
          </button>
        </div>
      </div>
    </div>
  );
};