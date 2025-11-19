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
                <span className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200">{count}</span>
            </div>
        );
    }

    // Mixed mode - show both symbols AND number together
    if (displayMode === DisplayMode.MIXED) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
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
                <span className="text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400">{count}</span>
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
    if (feedback === true) return <span className="text-green-500 text-3xl">✓</span>;
    if (feedback === false) return <span className="text-red-500 text-3xl">✗</span>;
    return null;
  };

  return (
    <div className="grid grid-cols-[2fr_auto_2fr_auto_1fr] items-center border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <div className="p-2 h-full"><ItemDisplay item={task.item} count={task.operand1} displayMode={displayMode} isBlackAndWhite={isBlackAndWhite} /></div>
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold text-slate-500 dark:text-slate-400 px-2">+</div>
      <div className="p-2 h-full"><ItemDisplay item={task.item} count={task.operand2} displayMode={displayMode} isBlackAndWhite={isBlackAndWhite} /></div>
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold text-slate-500 dark:text-slate-400 px-2">=</div>
      <div className="p-2 h-full relative">
        {isInteractive ? (
          <div
            onClick={onFocus}
            className={`w-full h-full bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-3xl md:text-4xl font-bold cursor-pointer transition-all ${isActive ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent'}`}
          >
            <span className="text-slate-900 dark:text-white">{value}</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">{feedbackIcon()}</div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-200/50 dark:bg-slate-700/50 rounded-lg print:bg-white print:border print:border-slate-300"></div>
        )}
      </div>
    </div>
  );
};