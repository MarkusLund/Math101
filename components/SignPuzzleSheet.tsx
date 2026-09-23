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
  className = 'w-8 h-8',
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
  // Slot ("taskId:slotIndex") whose +/− chooser popup is open
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  // Every time a row becomes fully filled with a new combination counts as one attempt
  const [attempts, setAttempts] = useState(0);

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
    setOpenSlot(null);
    setAttempts(0);
  }, [tasks]);

  // Close the chooser popup on outside tap or Escape
  useEffect(() => {
    if (!openSlot) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(`[data-sign-slot="${openSlot}"]`)) setOpenSlot(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSlot(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openSlot]);

  const handlePlaceSign = (taskId: number, slotIndex: number, sign: string | null) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    // Solved rows are locked so they can't be used to probe other answers
    if (getRowFeedback(task) === true) return;

    const taskSlots = [...(placements[taskId] || new Array(task.numbers.length - 1).fill(null))];
    if (taskSlots[slotIndex] === sign) return;
    taskSlots[slotIndex] = sign;

    if (taskSlots.every(s => s !== null)) setAttempts(a => a + 1);
    setPlacements(prev => ({ ...prev, [taskId]: taskSlots }));
  };

  const handleCircleClick = (taskId: number, slotIndex: number) => {
    if (!interactiveMode) return;

    if (selectedSign) {
      handlePlaceSign(taskId, slotIndex, selectedSign);
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task && getRowFeedback(task) === true) return;

    const slotKey = `${taskId}:${slotIndex}`;
    setOpenSlot(prev => (prev === slotKey ? null : slotKey));
  };

  const handleChooseSign = (taskId: number, slotIndex: number, sign: '+' | '-' | null) => {
    handlePlaceSign(taskId, slotIndex, sign);
    setOpenSlot(null);
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

  const allSolved = tasks.length > 0 && tasks.every(task => getRowFeedback(task) === true);

  /** The +/− pieces. Rendered inline on the sheet and in the mobile bottom dock. */
  const renderSign = (sign: '+' | '-', size: string) => {
    const isSelected = selectedSign === sign;
    return (
      <button
        key={sign}
        type="button"
        draggable={interactiveMode}
        onDragStart={e => handleDragStart(e, sign)}
        onPointerDown={e => handlePointerDownSign(e, sign)}
        onClick={() => interactiveMode && setSelectedSign(prev => (prev === sign ? null : sign))}
        style={interactiveMode ? { touchAction: 'none' } : undefined}
        aria-pressed={isSelected}
        title={interactiveMode ? t.signPuzzleInstructions : undefined}
        className={`${size} flex select-none items-center justify-center rounded-full transition-all duration-150 ${
          interactiveMode
            ? `cursor-grab active:cursor-grabbing active:scale-95 ${
                isBlackAndWhite
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : sign === '+'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
              } ${
                // Selection keeps the sign's own colour and adds a ring, so the
                // green/red identity stays readable for young kids.
                isSelected
                  ? 'scale-105 ring-4 ring-primary-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                  : ''
              }`
            : 'border-2 border-slate-700 text-slate-800'
        }`}
      >
        <SignGlyph sign={sign} className="w-1/2 h-1/2" />
      </button>
    );
  };

  const sheetContent = (
    <div
      className={`flex flex-col bg-white dark:bg-slate-900 ${
        interactiveMode ? 'rounded-2xl p-3 sm:p-5' : 'h-full p-5 sm:p-8 md:p-12'
      }`}
    >
      {/* Name and Date on print worksheets */}
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

      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
          {t.signPuzzleTitle}
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">
          {t.signPuzzleSubtitle}
        </p>
      </div>

      {/* Reference signs — on mobile these live in the always-visible bottom dock instead */}
      <div className={`mt-4 flex items-center justify-center gap-4 ${interactiveMode ? 'hidden md:flex' : 'flex'}`}>
        {(['+', '-'] as const).map(sign => renderSign(sign, 'w-14 h-14'))}
      </div>

      {/* Task rows */}
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.map(task => {
          const feedback = getRowFeedback(task);
          const userSigns = placements[task.id] || [];

          return (
            <div
              key={task.id}
              data-sign-row={task.id}
              className={`relative flex items-center justify-center rounded-xl px-1 py-2.5 transition-colors sm:py-3 ${
                interactiveMode ? 'pr-10' : ''
              } ${
                feedback === true
                  ? 'bg-emerald-50 dark:bg-emerald-500/10'
                  : feedback === false
                  ? 'bg-rose-50 dark:bg-rose-500/10'
                  : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
                {task.numbers.map((num, idx) => (
                  <React.Fragment key={idx}>
                    <span className="min-w-[1.2ch] text-center font-display text-3xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-5xl">
                      {num}
                    </span>

                    {idx < task.numbers.length - 1 && (() => {
                      const slotKey = `${task.id}:${idx}`;
                      const currentSign = userSigns[idx] || null;
                      const isOver = dragOverSlot === slotKey;
                      const isOpen = openSlot === slotKey;
                      const isLocked = feedback === true;

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
                          className={`relative flex h-10 w-10 select-none items-center justify-center rounded-full transition-all duration-150 sm:h-14 sm:w-14 ${
                            interactiveMode
                              ? `${isLocked ? 'cursor-default' : 'cursor-pointer'} ${isOpen ? 'ring-4 ring-primary-400' : ''} ${
                                  isOver
                                    ? 'scale-110 bg-primary-500 text-white'
                                    : currentSign
                                    ? isBlackAndWhite
                                      ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                                      : currentSign === '+'
                                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                                      : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300'
                                    : 'border-2 border-dashed border-slate-300 dark:border-slate-600'
                                }`
                              : 'border-2 border-slate-700'
                          }`}
                          title={interactiveMode ? t.signPuzzleInstructions : undefined}
                        >
                          {interactiveMode && currentSign && (
                            <SignGlyph
                              sign={currentSign}
                              className="pointer-events-none h-5 w-5 select-none sm:h-7 sm:w-7"
                            />
                          )}

                          {/* +/− chooser popup */}
                          {interactiveMode && isOpen && (
                            <div
                              role="dialog"
                              aria-label={t.signPuzzleChooseSign}
                              onClick={e => e.stopPropagation()}
                              className="absolute bottom-full left-1/2 z-30 mb-2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-fade-in dark:border-slate-700 dark:bg-slate-800"
                            >
                              {(['+', '-'] as const).map(sign => (
                                <button
                                  key={sign}
                                  type="button"
                                  data-choose-sign={sign}
                                  aria-label={sign === '+' ? '+' : '−'}
                                  onClick={() => handleChooseSign(task.id, idx, sign)}
                                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform active:scale-95 sm:h-14 sm:w-14 ${
                                    isBlackAndWhite
                                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white'
                                      : sign === '+'
                                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                                      : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
                                  } ${currentSign === sign ? 'ring-4 ring-primary-400' : ''}`}
                                >
                                  <SignGlyph sign={sign} className="h-1/2 w-1/2" />
                                </button>
                              ))}
                              {currentSign && (
                                <button
                                  type="button"
                                  aria-label={t.signPuzzleClearSign}
                                  title={t.signPuzzleClearSign}
                                  onClick={() => handleChooseSign(task.id, idx, null)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-transform hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                                >
                                  <span className="material-symbols-rounded text-[20px]">close</span>
                                </button>
                              )}
                              {/* Arrow */}
                              <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </React.Fragment>
                ))}

                <span className="px-0.5 font-display text-3xl font-extrabold text-slate-400 dark:text-slate-500 sm:px-2 sm:text-5xl">
                  =
                </span>

                <span className="min-w-[1.5ch] text-center font-display text-3xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-5xl">
                  {task.target}
                </span>
              </div>

              {/* Status indicator — absolute so it never wraps onto its own line */}
              {interactiveMode && feedback !== null && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  {feedback ? (
                    <span className="material-symbols-rounded animate-check-pop text-[28px] text-emerald-500">
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-rounded animate-wrong-shake text-[28px] text-rose-400">
                      cancel
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {interactiveMode && allSolved && (
        <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-4 text-center animate-fade-in">
          <p className="mb-2 font-display text-xl font-black text-emerald-700 dark:text-emerald-300">
            {t.puzzleAllCorrect}
          </p>
          <p data-testid="sign-puzzle-attempts" className="mb-3 font-display text-lg font-bold text-emerald-700/80 dark:text-emerald-300/80">
            {t.signPuzzleAttempts
              .replace('{attempts}', String(attempts))
              .replace('{tasks}', String(tasks.length))}
            {attempts <= tasks.length && <span className="block">{t.signPuzzleAttemptsPerfect}</span>}
          </p>
          <button
            onClick={onRandomize}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white transition-transform active:scale-95"
          >
            <span className="material-symbols-rounded text-[20px]">refresh</span>
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
          className={`flex h-14 w-14 items-center justify-center rounded-full opacity-95 shadow-2xl ${
            pointerDrag.sign === '+' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}
        >
          <SignGlyph sign={pointerDrag.sign} className="h-7 w-7" />
        </div>
      )}

      {interactiveMode ? (
        <>
          <div className="mx-auto w-full max-w-2xl">{sheetContent}</div>

          {/* Always-available sign dock on small screens */}
          <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="flex items-center justify-center gap-5 px-4 py-3">
              {(['+', '-'] as const).map(sign => renderSign(sign, 'w-16 h-16 shadow-md'))}
            </div>
            <p className="pb-2 text-center text-[11px] font-medium text-slate-400">
              {t.signPuzzleInstructions}
            </p>
          </div>
        </>
      ) : (
        <div className="print-preview-wrapper flex w-full items-start justify-center">
          <div className="print-preview-frame">
            <div className="printable-sheet h-full">{sheetContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
