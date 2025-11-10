import React from 'react';
import { Task } from '../types.ts';
import { TaskRow } from './TaskRow.tsx';

interface PrintableSheetProps {
  tasks: Task[];
  showDigits: boolean;
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
  interactiveMode,
  answers,
  feedback,
  onAnswerFocus,
  activeTaskIndex,
  t,
  isBlackAndWhite,
}) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-2xl mx-auto printable-sheet">
        <div className="bg-white dark:bg-slate-800 h-full rounded-2xl shadow-lg p-6 md:p-10 flex flex-col">
          {showDigits && (
            <div className="flex justify-between items-center mb-8 pb-4 border-b-4 border-slate-300 dark:border-slate-600">
              {digits.map(digit => (
                <span key={digit} className="font-handwritten text-5xl md:text-7xl text-slate-700 dark:text-slate-300">
                  {digit}
                </span>
              ))}
            </div>
          )}
          <div className="flex-grow grid grid-rows-5 gap-2">
            {tasks.map(task => (
              <TaskRow 
                key={task.id} 
                task={task} 
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
    </div>
  );
};