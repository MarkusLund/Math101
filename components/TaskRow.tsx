import React from 'react';
import { DisplayMode, Task } from '../types';
import { OPERATOR_SYMBOLS } from '../constants';

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

const ItemDisplay: React.FC<{
  item: string;
  count: number;
  displayMode: DisplayMode;
  isBlackAndWhite: boolean;
}> = ({ item, count, displayMode, isBlackAndWhite }) => {
  // Numbers only mode - just show the number (including 0)
  if (displayMode === DisplayMode.NUMBERS_ONLY) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="font-display text-3xl font-bold text-slate-700 dark:text-slate-200 sm:text-5xl">
          {count}
        </span>
      </div>
    );
  }

  // Mixed mode - show both symbols AND number together
  if (displayMode === DisplayMode.MIXED) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
        <div className="flex flex-wrap items-center justify-center gap-0.5">
          {count === 0 ? (
            <div className="h-6"></div>
          ) : (
            Array.from({ length: count }).map((_, i) =>
              isBlackAndWhite ? (
                <span key={i} className="material-symbols-rounded text-xl text-slate-800 dark:text-slate-200 sm:text-3xl">
                  {item}
                </span>
              ) : (
                <span key={i} className="text-xl sm:text-3xl">{item}</span>
              )
            )
          )}
        </div>
        <span className="font-display text-xl font-bold text-slate-400 sm:text-3xl">{count}</span>
      </div>
    );
  }

  // Symbols only mode (default) - don't show anything if count is 0
  if (count === 0) {
    return <div className="h-full w-full"></div>;
  }
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-0.5">
      {Array.from({ length: count }).map((_, i) =>
        isBlackAndWhite ? (
          <span key={i} className="material-symbols-rounded text-2xl text-slate-800 dark:text-slate-200 sm:text-4xl">
            {item}
          </span>
        ) : (
          <span key={i} className="text-2xl sm:text-4xl">{item}</span>
        )
      )}
    </div>
  );
};

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  displayMode,
  isInteractive,
  value,
  feedback,
  onFocus,
  isActive,
  t,
  isBlackAndWhite,
}) => {
  const operatorClass = `flex items-center justify-center font-display text-2xl font-bold sm:text-4xl ${
    isBlackAndWhite ? 'text-slate-800 dark:text-slate-200' : 'text-primary-400'
  }`;

  return (
    <div className="grid grid-cols-[2fr_auto_2fr_auto_minmax(4.5rem,1fr)] items-center gap-1 py-1.5 sm:gap-2 sm:py-2">
      <ItemDisplay item={task.item} count={task.operand1} displayMode={displayMode} isBlackAndWhite={isBlackAndWhite} />
      <div className={operatorClass}>{OPERATOR_SYMBOLS[task.operator]}</div>
      <ItemDisplay item={task.item} count={task.operand2} displayMode={displayMode} isBlackAndWhite={isBlackAndWhite} />
      <div className={operatorClass}>=</div>
      <div className="relative flex items-center justify-center">
        {isInteractive ? (
          <div
            onClick={onFocus}
            className={`flex h-14 w-full max-w-[7rem] cursor-pointer items-center justify-center rounded-xl font-display text-3xl font-bold transition-all sm:h-20 sm:text-4xl ${
              isActive
                ? 'bg-primary-50 dark:bg-primary-500/15 ring-2 ring-primary-500'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <span className="text-slate-800 dark:text-white">{value}</span>
            {(feedback === true || feedback === false) && (
              <span
                className={`material-symbols-rounded absolute -right-1 -top-1 text-[26px] ${
                  feedback ? 'text-emerald-500' : 'text-rose-400'
                }`}
              >
                {feedback ? 'check_circle' : 'cancel'}
              </span>
            )}
          </div>
        ) : (
          <div className="h-14 w-full max-w-[8rem] border-b-4 border-slate-300 print:border-slate-800 sm:h-20"></div>
        )}
      </div>
    </div>
  );
};
