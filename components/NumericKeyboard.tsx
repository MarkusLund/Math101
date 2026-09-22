import React from 'react';

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
}

const Key: React.FC<{ value: string; onClick: (value: string) => void }> = ({ value, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className="flex h-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xl font-bold text-slate-800 dark:text-slate-200 transition-transform active:scale-95"
  >
    {value}
  </button>
);

export const NumericKeyboard: React.FC<NumericKeyboardProps> = ({ onKeyPress }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-1.5 p-2">
        {keys.map((key, index) =>
          key ? <Key key={index} value={key} onClick={onKeyPress} /> : <div key={index}></div>
        )}
      </div>
    </div>
  );
};
