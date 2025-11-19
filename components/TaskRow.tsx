import React from 'react';
import { DisplayMode, Task } from '../types';

interface TaskRowProps {
  task: Task;
  displayMode: DisplayMode;
  isInteractive: boolean;
  value: string;
  feedback: boolean | null;
  onFocus: () => void;
  isActive: boolean;
  t: any;
  isBlackAndWhite: boolean;
}

const ItemDisplay: React.FC<{ item: string; count: number; displayMode: DisplayMode; isBlackAndWhite: boolean }> = ({ item, count, displayMode, isBlackAndWhite }) => {
    // Numbers only mode - just show the number (including 0)
    if (displayMode === DisplayMode.NUMBERS_ONLY) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <span className="text-4xl md:text-5xl font-bold text-slate-700 dark:text-slate-200 font-display">{count}</span>
            </div>
        );
    }

    // Mixed mode - show both symbols AND number together
    if (displayMode === DisplayMode.MIXED) {
        return (
            <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                <div className="flex items-center justify-center flex-wrap gap-1">
                    {count === 0 ? (
                        <div className="h-8"></div>
                    ) : (
                        Array.from({ length: count }).map((_, i) => {
                            if (isBlackAndWhite) {
                                return <span key={i} className="material-symbols-rounded text-2xl md:text-3xl text-slate-800 dark:text-slate-200">{item}</span>;
                            }
                            return <span key={i} className="text-2xl md:text-3xl">{item}</span>;
                        })
                    )}
                </div>
                <span className="text-2xl md:text-3xl font-bold text-slate-500 dark:text-slate-400 font-display">{count}</span>
            </div>
        );
    }

    // Symbols only mode (default) - don't show anything if count is 0
    if (count === 0) {
        return <div className="w-full h-full"></div>;
    }
    return (
        <div className="flex items-center justify-center flex-wrap gap-1 w-full h-full">
            {Array.from({ length: count }).map((_, i) => {
                if (isBlackAndWhite) {
                    return <span key={i} className="material-symbols-rounded text-3xl md:text-4xl text-slate-800 dark:text-slate-200">{item}</span>;
                }
                return <span key={i} className="text-3xl md:text-4xl">{item}</span>;
            })}
        </div>
    );
};

export const TaskRow: React.FC<TaskRowProps> = ({ task, displayMode, isInteractive, value, feedback, onFocus, isActive, t, isBlackAndWhite }) => {
  const feedbackIcon = () => {
    if (feedback === true) return <span className="text-green-500 text-3xl material-symbols-rounded">check_circle</span>;
    if (feedback === false) return <span className="text-red-500 text-3xl material-symbols-rounded">cancel</span>;
    return null;
  };

  return (
    <div className="grid grid-cols-[2fr_auto_2fr_auto_1fr] items-center border-b-2 border-slate-100 dark:border-slate-700 last:border-b-0 py-2">
      <div className="p-2 h-full"><ItemDisplay item={task.item} count={task.operand1} displayMode={displayMode} isBlackAndWhite={isBlackAndWhite} /></div>
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold text-primary-400 dark:text-primary-500 px-2 font-display">+</div>
      <div className="p-2 h-full"><ItemDisplay item={task.item} count={task.operand2} displayMode={displayMode} isBlackAndWhite={isBlackAndWhite} /></div>
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold text-primary-400 dark:text-primary-500 px-2 font-display">=</div>
      <div className="p-2 h-full relative flex items-center justify-center">
        {isInteractive ? (
          <div
            onClick={onFocus}
            className={`w-24 h-16 md:w-32 md:h-20 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-bold cursor-pointer transition-all duration-200 border-2 ${isActive ? 'border-primary-500 ring-4 ring-primary-500/20' : 'border-slate-200 dark:border-slate-600 hover:border-primary-300'}`}
          >
            <span className="text-slate-800 dark:text-white font-display">{value}</span>
            <div className="absolute -right-2 -top-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">{feedbackIcon()}</div>
          </div>
        ) : (
          <div className="w-24 h-16 md:w-32 md:h-20 border-b-4 border-slate-300 dark:border-slate-600 print:border-slate-800"></div>
        )}
      </div>
    </div>
  );
};