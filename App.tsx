import React, { useState, useEffect, useCallback } from "react";
import { Controls } from "./components/Controls";
import { PrintableSheet } from "./components/PrintableSheet";
import { SignPuzzleSheet } from "./components/SignPuzzleSheet";
import { NumericKeyboard } from "./components/NumericKeyboard";
import { generateTasks } from "./services/taskGenerator";
import { generateSignPuzzles } from "./services/signPuzzleGenerator";
import {
  AppMode,
  DisplayMode,
  Language,
  Operator,
  SignPuzzleDifficulty,
  SignPuzzleTask,
  Task,
} from "./types";
import { translations } from "./constants";

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "no";
  });
  const [appMode, setAppMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem("appMode");
    return (saved as AppMode) || AppMode.CALCULATE;
  });
  const [signDifficulty, setSignDifficulty] = useState<SignPuzzleDifficulty>(() => {
    const saved = localStorage.getItem("signDifficulty");
    return (saved as SignPuzzleDifficulty) || SignPuzzleDifficulty.MEDIUM;
  });
  const [maxSum, setMaxSum] = useState<number>(() => {
    const saved = localStorage.getItem("maxSum");
    return saved ? parseInt(saved, 10) : 5;
  });
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    const saved = localStorage.getItem("displayMode");
    return (saved as DisplayMode) || DisplayMode.SYMBOLS_ONLY;
  });
  const [showDigits, setShowDigits] = useState<boolean>(() => {
    const saved = localStorage.getItem("showDigits");
    return saved ? JSON.parse(saved) : true;
  });
  const [interactiveMode, setInteractiveMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("appMode");
    if (savedMode === AppMode.SIGN_PUZZLE) return true;
    const saved = localStorage.getItem("interactiveMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [isBlackAndWhite, setIsBlackAndWhite] = useState<boolean>(() => {
    const saved = localStorage.getItem("isBlackAndWhite");
    return saved ? JSON.parse(saved) : false;
  });
  const [operators, setOperators] = useState<Operator[]>(() => {
    const saved = localStorage.getItem("operators");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return [Operator.ADDITION];
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [signTasks, setSignTasks] = useState<SignPuzzleTask[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const t = translations[language];

  // Persistence
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("appMode", appMode);
    localStorage.setItem("signDifficulty", signDifficulty);
    localStorage.setItem("maxSum", maxSum.toString());
    localStorage.setItem("displayMode", displayMode);
    localStorage.setItem("showDigits", JSON.stringify(showDigits));
    localStorage.setItem("interactiveMode", JSON.stringify(interactiveMode));
    localStorage.setItem("isBlackAndWhite", JSON.stringify(isBlackAndWhite));
    localStorage.setItem("operators", JSON.stringify(operators));
  }, [language, appMode, signDifficulty, maxSum, displayMode, showDigits, interactiveMode, isBlackAndWhite, operators]);

  // SEO Updates
  useEffect(() => {
    document.title = t.seoTitle;
    document.documentElement.lang = language;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', t.seoDescription);
  }, [language, t]);

  // Lock background scrolling while the mobile settings sheet is open
  useEffect(() => {
    if (!settingsOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [settingsOpen]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen]);

  const hasSymbolIncompatibleOperator = operators.some(
    (op) => op === Operator.MULTIPLICATION || op === Operator.DIVISION
  );

  // Restrictions
  useEffect(() => {
    if ((maxSum > 15 || hasSymbolIncompatibleOperator) && displayMode !== DisplayMode.NUMBERS_ONLY) {
      setDisplayMode(DisplayMode.NUMBERS_ONLY);
    }
  }, [maxSum, displayMode, hasSymbolIncompatibleOperator]);

  const randomizeTasks = useCallback(() => {
    const noZeros = displayMode === DisplayMode.SYMBOLS_ONLY;
    const newTasks = generateTasks(maxSum, 5, isBlackAndWhite, operators, noZeros);
    setTasks(newTasks);
    setAnswers({});
    setFeedback({});
    setActiveTaskIndex(null);
  }, [maxSum, isBlackAndWhite, operators, displayMode]);

  const randomizeSignTasks = useCallback(() => {
    const newSignTasks = generateSignPuzzles(signDifficulty, 5);
    setSignTasks(newSignTasks);
  }, [signDifficulty]);

  useEffect(() => {
    randomizeTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    randomizeSignTasks();
  }, [randomizeSignTasks]);

  useEffect(() => {
    randomizeTasks();
  }, [maxSum, isBlackAndWhite, randomizeTasks]);

  const handleRandomize = () => {
    if (appMode === AppMode.SIGN_PUZZLE) {
      randomizeSignTasks();
    } else {
      randomizeTasks();
    }
  };

  const handleAnswerChange = (taskId: number, value: string) => {
    const newAnswers = { ...answers, [taskId]: value };
    setAnswers(newAnswers);

    const task = tasks.find((t) => t.id === taskId);
    if (task && value === task.answer.toString()) {
      setFeedback((prev) => ({ ...prev, [taskId]: true }));
    } else if (task && value.length >= task.answer.toString().length) {
      setFeedback((prev) => ({ ...prev, [taskId]: false }));
    } else {
      setFeedback((prev) => ({ ...prev, [taskId]: null }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleInteractive = () => {
    setInteractiveMode((prev) => !prev);
    setAnswers({});
    setFeedback({});
    setActiveTaskIndex(null);
  };

  const handleKeyboardInput = (key: string) => {
    if (activeTaskIndex === null) return;

    const currentAnswer = answers[activeTaskIndex] || "";
    let newAnswer = "";

    if (key === "⌫") {
      newAnswer = currentAnswer.slice(0, -1);
    } else {
      newAnswer = currentAnswer + key;
    }

    handleAnswerChange(activeTaskIndex, newAnswer);
  };

  const handleAppModeChange = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === AppMode.SIGN_PUZZLE) {
      setInteractiveMode(true);
    }
  };

  const controlsProps = {
    language,
    setLanguage,
    t,
    appMode,
    setAppMode: handleAppModeChange,
    signDifficulty,
    setSignDifficulty,
    maxSum,
    setMaxSum,
    displayMode,
    setDisplayMode,
    showDigits,
    setShowDigits,
    interactiveMode,
    onToggleInteractive: handleToggleInteractive,
    isBlackAndWhite,
    setIsBlackAndWhite,
    operators,
    setOperators,
    onRandomize: handleRandomize,
    onPrint: handlePrint,
  };

  // Space reserved at the bottom for the docked keyboard / sign palette.
  // The dock itself is hidden from sm (signs) / md (keyboard) upwards.
  const bottomDockPadding = !interactiveMode
    ? ''
    : appMode === AppMode.SIGN_PUZZLE
    ? 'pb-44 md:pb-4'
    : 'pb-44 md:pb-4';

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Compact mobile top bar */}
      <header className="no-print xl:hidden sticky top-0 z-30 flex items-center gap-1 px-3 py-2 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-md">
        <span className="font-display font-bold text-lg tracking-tight">
          <span className="text-primary-500">Math</span> 101
        </span>
        <div className="ml-auto flex items-center gap-1">
          <IconButton label={t.randomize} icon="refresh" onClick={handleRandomize} />
          <IconButton label={t.print} icon="print" onClick={handlePrint} />
          <IconButton
            label={t.settings}
            icon="tune"
            onClick={() => setSettingsOpen(true)}
            primary
          />
        </div>
      </header>

      <main
        className={`mx-auto flex w-full max-w-[1500px] flex-col items-start gap-4 px-2 pb-4 pt-1 sm:px-4 xl:flex-row xl:gap-6 xl:px-6 xl:pt-6 ${
          bottomDockPadding
        }`}
      >
        {/* Desktop sidebar */}
        <aside className="no-print hidden xl:block xl:w-[22rem] xl:flex-shrink-0 xl:sticky xl:top-6">
          <Controls {...controlsProps} />
        </aside>

        <div className="w-full min-w-0">
          {appMode === AppMode.SIGN_PUZZLE ? (
            <SignPuzzleSheet
              tasks={signTasks}
              interactiveMode={interactiveMode}
              t={t}
              isBlackAndWhite={isBlackAndWhite}
              onRandomize={randomizeSignTasks}
            />
          ) : (
            <PrintableSheet
              tasks={tasks}
              showDigits={showDigits}
              displayMode={displayMode}
              interactiveMode={interactiveMode}
              answers={answers}
              feedback={feedback}
              onAnswerFocus={setActiveTaskIndex}
              activeTaskIndex={activeTaskIndex}
              t={t}
              isBlackAndWhite={isBlackAndWhite}
            />
          )}
        </div>
      </main>

      {interactiveMode && appMode === AppMode.CALCULATE && (
        <NumericKeyboard onKeyPress={handleKeyboardInput} />
      )}

      {/* Mobile settings sheet */}
      {settingsOpen && (
        <div className="no-print fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white dark:bg-slate-900 shadow-2xl animate-sheet-up pb-[env(safe-area-inset-bottom)]">
            <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 pt-3 pb-2">
              <div className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-700" />
              <h2 className="font-display text-lg font-bold mt-2">{t.settings}</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                aria-label={t.close}
                className="ml-auto mt-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 active:scale-95 transition-transform"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <div className="px-4 pb-6">
              <Controls {...controlsProps} embedded />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IconButton: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
}> = ({ icon, label, onClick, primary }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform active:scale-90 ${
      primary
        ? "bg-primary-500 text-white shadow-sm shadow-primary-500/30"
        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
    }`}
  >
    <span className="material-symbols-rounded text-[22px]">{icon}</span>
  </button>
);

export default App;
