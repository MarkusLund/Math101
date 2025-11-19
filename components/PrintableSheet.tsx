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
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col ${
      interactiveMode ? 'p-4 md:p-6' : 'p-6 md:p-10 h-full'
    }`}>
      {showDigits && (
        <div className={`flex justify-between items-center pb-4 border-b-4 border-slate-300 dark:border-slate-600 ${
          interactiveMode ? 'mb-4' : 'mb-8'
        }`}>
          {digits.map(digit => (
            <span key={digit} className={`font-handwritten text-slate-700 dark:text-slate-300 ${
              interactiveMode ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl'
            }`}>
              {digit}
            </span>
          ))}
        </div>
      )}
      <div className={`flex-grow grid grid-rows-5 ${interactiveMode ? 'gap-3 md:gap-4' : 'gap-2'}`}>
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
    return (
      <div className="w-full max-w-2xl mx-auto">
        {sheetContent}
      </div>
    );
  }

  // Non-interactive mode: print preview frame
  return (
    <div className="w-full flex justify-center items-center">
      <div className="print-preview-frame">
        <div className="printable-sheet">
          {sheetContent}
        </div>
      </div>
    </div>
  );
};