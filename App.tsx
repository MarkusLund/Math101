import React, { useState, useEffect, useCallback } from "react";
import { Controls } from "./components/Controls";
import { PrintableSheet } from "./components/PrintableSheet";
import { NumericKeyboard } from "./components/NumericKeyboard";
import { generateTasks } from "./services/taskGenerator";
import { DisplayMode, Language, Task } from "./types";
import { translations } from "./constants";

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "no";
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
    const saved = localStorage.getItem("interactiveMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [isBlackAndWhite, setIsBlackAndWhite] = useState<boolean>(() => {
    const saved = localStorage.getItem("isBlackAndWhite");
    return saved ? JSON.parse(saved) : false;
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const t = translations[language];

  // Persistence
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("maxSum", maxSum.toString());
    localStorage.setItem("displayMode", displayMode);
    localStorage.setItem("showDigits", JSON.stringify(showDigits));
    localStorage.setItem("interactiveMode", JSON.stringify(interactiveMode));
    localStorage.setItem("isBlackAndWhite", JSON.stringify(isBlackAndWhite));
  }, [language, maxSum, displayMode, showDigits, interactiveMode, isBlackAndWhite]);

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

  // Restrictions
  useEffect(() => {
    if (maxSum > 15 && displayMode !== DisplayMode.NUMBERS_ONLY) {
      setDisplayMode(DisplayMode.NUMBERS_ONLY);
    }
  }, [maxSum, displayMode]);

  const randomizeTasks = useCallback(() => {
    const newTasks = generateTasks(maxSum, 5, isBlackAndWhite);
    setTasks(newTasks);
    setAnswers({});
    setFeedback({});
    setActiveTaskIndex(null);
  }, [maxSum, isBlackAndWhite]);

  useEffect(() => {
    randomizeTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    randomizeTasks();
  }, [maxSum, isBlackAndWhite, randomizeTasks]);

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

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <main
        className={`p-4 md:p-8 flex flex-col xl:flex-row gap-8 items-start justify-center ${
          interactiveMode ? "pb-48 md:pb-8" : ""
        }`}
      >
        <Controls
          language={language}
          setLanguage={setLanguage}
          t={t}
          maxSum={maxSum}
          setMaxSum={setMaxSum}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          showDigits={showDigits}
          setShowDigits={setShowDigits}
          interactiveMode={interactiveMode}
          onToggleInteractive={handleToggleInteractive}
          isBlackAndWhite={isBlackAndWhite}
          setIsBlackAndWhite={setIsBlackAndWhite}
          onRandomize={randomizeTasks}
          onPrint={handlePrint}
        />
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
      </main>
      {interactiveMode && <NumericKeyboard onKeyPress={handleKeyboardInput} />}
    </div>
  );
};

export default App;
