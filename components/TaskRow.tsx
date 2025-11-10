import React from 'react';
import { Task } from '../types.ts';

interface TaskRowProps {
  task: Task;
  isInteractive: boolean;
  value: string;
  feedback: boolean | null;
  onFocus: () => void;
  isActive: boolean;
  t: any;
}

const EmojiDisplay: React.FC<{ emoji: string; count: number }> = ({ emoji, count }) => {
    if (count === 0) {
        return <div className="w-full h-full"></div>;
    }
    return (
        <div className="flex items-center justify-center flex-wrap gap-1 w-full h-full">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="text-3xl md:text-4xl">{emoji}</span>
            ))}
        </div>
    );
};

export const TaskRow: React.FC<TaskRowProps> = ({ task, isInteractive, value, feedback, onFocus, isActive, t }) => {
  const feedbackIcon = () => {
    if (feedback === true) return <span className="text-green-500 text-3xl">✓</span>;
    if (feedback === false) return <span className="text-red-500 text-3xl">✗</span>;
    return null;
  };
  
  return (
    <div className="grid grid-cols-5 items-center border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <div className="p-2 h-full"><EmojiDisplay emoji={task.emoji} count={task.operand1} /></div>
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold text-slate-500 dark:text-slate-400">+</div>
      <div className="p-2 h-full"><EmojiDisplay emoji={task.emoji} count={task.operand2} /></div>
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold text-slate-500 dark:text-slate-400">=</div>
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
          <div className="w-full h-full bg-slate-200/50 dark:bg-slate-700/50 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};