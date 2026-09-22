import React from 'react';
import { DisplayMode, Task } from '../types';
import { TaskRow } from './TaskRow';

interface PrintableSheetProps {
  tasks: Task[];
  showDigits: boolean;
  displayMode: DisplayMode;
  interactiveMode: boolean;
  answers: Record<number, string>;
  feedback: Record<number, boolean | null>;
  onAnswerFocus: (taskId: number) => void;
  activeTaskIndex: number | null;
  t: any;
  isBlackAndWhite: boolean;
}

export const PrintableSheet: React.FC<PrintableSheetProps> = ({
  tasks,
  showDigits,
  displayMode,
  interactiveMode,
  answers,
  feedback,
  onAnswerFocus,
  activeTaskIndex,
  t,
  isBlackAndWhite,
}) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const sheetContent = (
    <div
      className={`flex flex-col bg-white dark:bg-slate-900 ${
        interactiveMode ? 'rounded-2xl p-3 sm:p-5' : 'h-full p-5 sm:p-8 md:p-12'
      }`}
    >
      {!interactiveMode && (
        <div className="mb-5 flex items-baseline gap-8 font-display text-slate-500">
          <div className="flex flex-1 items-baseline gap-2">
            <span className="whitespace-nowrap text-sm font-bold uppercase tracking-wider">{t.name}:</span>
            <span className="h-6 flex-1 border-b-2 border-slate-300"></span>
          </div>
          <div className="flex flex-1 items-baseline gap-2">
            <span className="whitespace-nowrap text-sm font-bold uppercase tracking-wider">{t.date}:</span>
            <span className="h-6 flex-1 border-b-2 border-slate-300"></span>
          </div>
        </div>
      )}

      {showDigits && (
        <div
          className={`flex items-center justify-around ${
            interactiveMode ? 'mb-2 pb-2' : 'mb-6 pb-4'
          }`}
        >
          {digits.map(digit => (
            <span
              key={digit}
              className={`font-handwritten text-slate-300 dark:text-slate-600 ${
                interactiveMode ? 'text-2xl sm:text-5xl' : 'text-5xl md:text-7xl'
              }`}
            >
              {digit}
            </span>
          ))}
        </div>
      )}

      <div
        className={`flex-grow grid grid-rows-5 divide-y divide-slate-100 dark:divide-slate-800 ${
          interactiveMode ? '' : 'gap-2'
        }`}
      >
        {tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            displayMode={displayMode}
            isInteractive={interactiveMode}
            value={answers[task.id] || ''}
            feedback={feedback[task.id]}
            onFocus={() => onAnswerFocus(task.id)}
            isActive={activeTaskIndex === task.id}
            t={t}
            isBlackAndWhite={isBlackAndWhite}
          />
        ))}
      </div>
    </div>
  );

  // Interactive mode: full screen friendly layout
  if (interactiveMode) {
    return <div className="mx-auto w-full max-w-2xl">{sheetContent}</div>;
  }

  // Non-interactive mode: print preview frame
  return (
    <div className="print-preview-wrapper flex w-full items-start justify-center">
      <div className="print-preview-frame">
        <div className="printable-sheet h-full">{sheetContent}</div>
      </div>
    </div>
  );
};
