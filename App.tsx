import React, { useState, useEffect, useCallback } from "react";
import { Controls } from "./components/Controls";
import { PrintableSheet } from "./components/PrintableSheet";
import { NumericKeyboard } from "./components/NumericKeyboard";
import { generateTasks } from "./services/taskGenerator";
import { Difficulty, DisplayMode, Language, Task } from "./types";
import { translations } from "./constants";

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    Difficulty.VERY_EASY
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.SYMBOLS_ONLY
  );
  const [showDigits, setShowDigits] = useState<boolean>(true);
  const [interactiveMode, setInteractiveMode] = useState<boolean>(false);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const t = translations[language];

  const randomizeTasks = useCallback(() => {
    const newTasks = generateTasks(difficulty, 5, isBlackAndWhite);
    setTasks(newTasks);
    setAnswers({});
    setFeedback({});
    setActiveTaskIndex(null);
  }, [difficulty, isBlackAndWhite]);

  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "no") {
      setLanguage("no");
    } else {
      setLanguage("en");
    }
    randomizeTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    randomizeTasks();
  }, [difficulty, isBlackAndWhite, randomizeTasks]);

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
          difficulty={difficulty}
          setDifficulty={setDifficulty}
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
