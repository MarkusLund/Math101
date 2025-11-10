
import React from 'react';

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
}

const Key: React.FC<{ value: string; onClick: (value: string) => void; className?: string }> = ({ value, onClick, className = '' }) => (
  <button 
    onClick={() => onClick(value)} 
    className={`flex items-center justify-center text-2xl font-bold bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg shadow-md h-14 transition-transform active:scale-95 text-slate-800 dark:text-slate-200 ${className}`}
  >
    {value}
  </button>
);

export const NumericKeyboard: React.FC<NumericKeyboardProps> = ({ onKeyPress }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm no-print md:hidden">
      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
        {keys.map((key, index) => 
            key ? <Key key={index} value={key} onClick={onKeyPress} /> : <div key={index}></div>
        )}
      </div>
    </div>
  );
};
