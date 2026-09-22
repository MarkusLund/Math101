import React, { useState, useEffect, useRef } from 'react';
import { SignPuzzleTask } from '../types';
import { evaluateSignExpression } from '../services/signPuzzleGenerator';

interface SignPuzzleSheetProps {
  tasks: SignPuzzleTask[];
  interactiveMode: boolean;
  t: any;
  isBlackAndWhite: boolean;
  onRandomize: () => void;
}

const SignGlyph: React.FC<{ sign: string | null; className?: string }> = ({
  sign,
  className = "w-8 h-8 md:w-9 md:h-9",
}) => {
  if (sign === '+') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="10" y="4" width="4" height="16" rx="2" />
        <rect x="4" y="10" width="16" height="4" rx="2" />
      </svg>
    );
  }
  if (sign === '-' || sign === '−') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="4" y="10" width="16" height="4" rx="2" />
      </svg>
    );
  }
  return null;
};

export const SignPuzzleSheet: React.FC<SignPuzzleSheetProps> = ({
  tasks,
  interactiveMode,
  t,
  isBlackAndWhite,
  onRandomize,
}) => {

  // placements: taskId -> array of ('+' | '-' | null) for each operator slot
  const [placements, setPlacements] = useState<Record<number, (string | null)[]>>({});
  const [selectedSign, setSelectedSign] = useState<'+' | '-' | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  // Pointer drag state for touch / mobile support
  const [pointerDrag, setPointerDrag] = useState<{
    sign: '+' | '-';
    x: number;
    y: number;
  } | null>(null);

  const pointerDragRef = useRef(pointerDrag);
  pointerDragRef.current = pointerDrag;

  // Reset placements when tasks change
  useEffect(() => {
    const initial: Record<number, (string | null)[]> = {};
    tasks.forEach(task => {
      initial[task.id] = new Array(task.numbers.length - 1).fill(null);
    });
    setPlacements(initial);
    setSelectedSign(null);
  }, [tasks]);

  const handlePlaceSign = (taskId: number, slotIndex: number, sign: string | null) => {
    setPlacements(prev => {
      const taskSlots = [...(prev[taskId] || new Array(tasks.find(t => t.id === taskId)?.numbers.length! - 1).fill(null))];
      taskSlots[slotIndex] = sign;
      return { ...prev, [taskId]: taskSlots };
    });
  };

  const handleCircleClick = (taskId: number, slotIndex: number) => {
    if (!interactiveMode) return;
    const current = placements[taskId]?.[slotIndex] || null;

    if (selectedSign) {
      handlePlaceSign(taskId, slotIndex, selectedSign);
      return;
    }

    // Cycle through: null -> '+' -> '-' -> null
    if (current === null) {
      handlePlaceSign(taskId, slotIndex, '+');
    } else if (current === '+') {
      handlePlaceSign(taskId, slotIndex, '-');
    } else {
      handlePlaceSign(taskId, slotIndex, null);
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, sign: '+' | '-') => {
    e.dataTransfer.setData('text/plain', sign);
    e.dataTransfer.setData('text', sign);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent, taskId: number, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    const sign = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text');
    if (sign === '+' || sign === '-') {
      handlePlaceSign(taskId, slotIndex, sign);
    }
  };

  // Pointer / Touch events for iPad and touchscreen devices
  const handlePointerDownSign = (e: React.PointerEvent, sign: '+' | '-') => {
    if (!interactiveMode) return;
    // On desktop with a mouse, let native HTML5 drag & drop handle it.
    // Handling pointermove/pointerup for mouse conflicts with Chrome's native drag session.
    if (e.pointerType === 'mouse') return;

    // Only handle primary touch pointer
    if (e.button !== 0) return;

    // Prevent the browser from scrolling the page while dragging
    e.preventDefault();
    e.stopPropagation();

    // Capture the pointer so all future events route to this element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const pointerId = e.pointerId;

    let hasMoved = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      // Prevent any scroll that might try to fire
      moveEvent.preventDefault();
      const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
      if (dist > 5) {
        hasMoved = true;
        setPointerDrag({
          sign,
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        });
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Release the captured pointer
      try {
        (e.target as HTMLElement).releasePointerCapture(pointerId);
      } catch (_) { /* already released */ }

      if (hasMoved) {
        // Check what element is beneath the pointer
        const elem = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        const slotElem = elem?.closest('[data-sign-slot]');
        if (slotElem) {
          const slotAttr = slotElem.getAttribute('data-sign-slot');
          if (slotAttr) {
            const [tId, sIdx] = slotAttr.split(':').map(Number);
            handlePlaceSign(tId, sIdx, sign);
          }
        }
      } else {
        // Just a tap: toggle selection
        setSelectedSign(prev => (prev === sign ? null : sign));
      }

      setPointerDrag(null);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
  };


  // Check row validation
  const getRowFeedback = (task: SignPuzzleTask): boolean | null => {
    const userSigns = placements[task.id];
    if (!userSigns || userSigns.some(s => s === null)) {
      return null; // incomplete
    }
    const evaluated = evaluateSignExpression(task.numbers, userSigns);
    return evaluated === task.target;
  };

  const allSolved =
    tasks.length > 0 &&
    tasks.every(task => getRowFeedback(task) === true);

  const sheetContent = (
    <div
      className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg flex flex-col transition-all duration-300 ${
        interactiveMode ? 'p-6 md:p-8 max-w-3xl mx-auto w-full' : 'p-8 md:p-12 h-full'
      }`}
    >
      {/* Name and Date on print worksheets */}
      {!interactiveMode && (
        <div className="flex justify-between items-baseline gap-8 pb-4 mb-4 text-slate-500 dark:text-slate-400 font-display">
          <div className="flex items-baseline gap-2 flex-1">
            <span className="text-sm font-bold uppercase tracking-wider whitespace-nowrap">{t.name}:</span>
            <span className="flex-1 border-b-2 border-slate-300 dark:border-slate-600 h-6"></span>
          </div>
          <div className="flex items-baseline gap-2 flex-1">
            <span className="text-sm font-bold uppercase tracking-wider whitespace-nowrap">{t.date}:</span>
            <span className="flex-1 border-b-2 border-slate-300 dark:border-slate-600 h-6"></span>
          </div>
        </div>
      )}

      {/* Safari Yoghurt Style Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white font-display tracking-wide mb-1">
          {t.signPuzzleTitle}
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium font-sans max-w-lg mx-auto">
          {t.signPuzzleSubtitle}
        </p>
      </div>

      {/* Draggable / Reference Signs Header: (+) and (-) */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex items-center justify-center gap-6 md:gap-8">
          {(['+', '-'] as const).map(sign => {
            const isSelected = selectedSign === sign;
            return (
              <div
                key={sign}
                draggable={interactiveMode}
                onDragStart={e => handleDragStart(e, sign)}
                onPointerDown={e => handlePointerDownSign(e, sign)}
                onClick={() => setSelectedSign(prev => (prev === sign ? null : sign))}
                style={interactiveMode ? { touchAction: 'none' } : undefined}
                className={`flex items-center justify-center rounded-full select-none transition-all duration-200 ${
                  interactiveMode
                    ? `cursor-grab active:cursor-grabbing hover:scale-110 shadow-md ${
                        isSelected
                          ? 'ring-4 ring-primary-500 ring-offset-2 dark:ring-offset-slate-800 bg-primary-500 text-white scale-105'
                          : isBlackAndWhite
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-800 dark:border-slate-300'
                          : sign === '+'
                          ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-600 border-2 border-rose-500 dark:bg-rose-950/40 dark:text-rose-400'
                      }`
                    : 'border-2 border-slate-700 dark:border-slate-300 text-slate-800 dark:text-slate-200'
                } w-14 h-14 md:w-16 md:h-16`}
                title={interactiveMode ? (t.signPuzzleInstructions || 'Drag or tap') : undefined}
              >
                <SignGlyph sign={sign} className="w-7 h-7 md:w-8 md:h-8" />
              </div>
            );
          })}
        </div>
        {interactiveMode && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            {t.signPuzzleInstructions}
          </p>
        )}
      </div>

      {/* Main Puzzle Card / Box (Safari yoghurt style border frame) */}
      <div
        className={`border-2 md:border-3 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-colors ${
          isBlackAndWhite
            ? 'border-slate-800 dark:border-slate-400 bg-white dark:bg-slate-900/30'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40 shadow-inner'
        }`}
      >
        <div className="divide-y divide-slate-200 dark:divide-slate-700/60">
          {tasks.map(task => {
            const feedback = getRowFeedback(task);
            const userSigns = placements[task.id] || [];

            return (
              <div
                key={task.id}
                className={`py-3 md:py-4 px-2 flex items-center justify-center flex-wrap gap-2 md:gap-4 transition-all rounded-xl ${
                  feedback === true
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20'
                    : feedback === false
                    ? 'bg-rose-50/60 dark:bg-rose-950/20'
                    : ''
                }`}
              >
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                  {task.numbers.map((num, idx) => (
                    <React.Fragment key={idx}>
                      {/* Number */}
                      <span className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 font-display min-w-[1.5ch] text-center">
                        {num}
                      </span>

                      {/* Operator Circle Slot */}
                      {idx < task.numbers.length - 1 && (() => {
                        const slotKey = `${task.id}:${idx}`;
                        const currentSign = userSigns[idx] || null;
                        const isOver = dragOverSlot === slotKey;

                        return (
                          <div
                            data-sign-slot={slotKey}
                            onClick={() => handleCircleClick(task.id, idx)}
                            onDragOver={e => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'copy';
                            }}
                            onDragEnter={e => {
                              e.preventDefault();
                              setDragOverSlot(slotKey);
                            }}
                            onDragLeave={e => {
                              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setDragOverSlot(null);
                              }
                            }}
                            onDrop={e => handleDrop(e, task.id, idx)}
                            className={`w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center select-none transition-all duration-150 ${
                              interactiveMode
                                ? `cursor-pointer ${
                                    isOver
                                      ? 'scale-110 border-4 border-primary-500 bg-primary-100 dark:bg-primary-900/50'
                                      : currentSign
                                      ? isBlackAndWhite
                                        ? 'border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                        : currentSign === '+'
                                        ? 'border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm'
                                        : 'border-2 border-rose-500 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 shadow-sm'
                                      : 'border-2 border-dashed border-slate-400 dark:border-slate-500 hover:border-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                  }`
                                : 'border-2 border-slate-700 dark:border-slate-300'
                            }`}
                            title={interactiveMode ? 'Click to change or drop + / −' : undefined}
                          >
                            {interactiveMode && currentSign && (
                              <SignGlyph
                                sign={currentSign}
                                className="w-5 h-5 md:w-7 md:h-7 pointer-events-none select-none"
                              />
                            )}
                          </div>
                        );
                      })()}
                    </React.Fragment>
                  ))}



                  {/* Equals sign */}
                  <span className="text-3xl md:text-5xl font-extrabold text-slate-700 dark:text-slate-300 font-display px-1 md:px-2">
                    =
                  </span>

                  {/* Target result */}
                  <span className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 font-display min-w-[2ch] text-center">
                    {task.target}
                  </span>
                </div>

                {/* Interactive Status Indicator */}
                {interactiveMode && (
                  <div className="w-10 flex items-center justify-center">
                    {feedback === true && (
                      <div className="relative w-9 h-9 animate-check-pop">
                        {/* Animated ring fill */}
                        <svg className="absolute inset-0 w-9 h-9" viewBox="0 0 36 36">
                          <circle
                            cx="18" cy="18" r="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-emerald-400 animate-ring-fill"
                            strokeDasharray="100"
                            strokeDashoffset="100"
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Checkmark icon */}
                        <span className="absolute inset-0 flex items-center justify-center text-emerald-500 text-3xl material-symbols-rounded">
                          check_circle
                        </span>
                      </div>
                    )}
                    {feedback === false && (
                      <span className="text-rose-500 text-3xl material-symbols-rounded animate-wrong-shake">
                        cancel
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Celebration in interactive mode */}
      {interactiveMode && allSolved && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-center animate-fade-in">
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 font-display mb-2">
            {t.puzzleAllCorrect}
          </p>
          <button
            onClick={onRandomize}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-rounded">refresh</span>
            {t.randomize}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Floating touch drag ghost */}
      {pointerDrag && (
        <div
          style={{
            position: 'fixed',
            left: pointerDrag.x - 28,
            top: pointerDrag.y - 28,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl font-black font-display shadow-2xl opacity-90 scale-110 ${
            pointerDrag.sign === '+'
              ? 'bg-emerald-500 text-white border-2 border-white'
              : 'bg-rose-500 text-white border-2 border-white'
          }`}
        >
          <SignGlyph sign={pointerDrag.sign} className="w-7 h-7" />
        </div>
      )}

      {interactiveMode ? (
        <div className="w-full max-w-2xl mx-auto">{sheetContent}</div>
      ) : (
        <div className="w-full flex justify-center items-start print-preview-wrapper">
          <div className="print-preview-frame">
            <div className="printable-sheet h-full">{sheetContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
