import { useRef, useState } from "react";

export default function TaskRunner() {
  const taskCount = 10;
  const [tasks, setTasks] = useState(
    Array.from({ length: taskCount }, (_, i) => ({
      id: i,
      progress: 0
    }))
  );
  const [isRunning, setIsRunning] = useState(false);

  const runningRef = useRef(0);
  const indexRef = useRef(0);

  const runTasks = () => {
    if (isRunning) return;

    setTasks(Array.from({ length: 10 }, (_, i) => ({ id: i, progress: 0 })));
    setIsRunning(true);

    runningRef.current = 0;
    indexRef.current = 0;

    const startTask = (i) => {
      runningRef.current += 1;

      const interval = setInterval(() => {
        setTasks((prev) => {
          const copy = [...prev];
          const nextProgress = Math.min(copy[i].progress + 10, 100);

          copy[i] = {
            ...copy[i],
            progress: nextProgress
          };

          if (nextProgress >= 100) {
            clearInterval(interval);
            runningRef.current -= 1;

            if (indexRef.current < copy.length) {
              startTask(indexRef.current++);
            } else if (runningRef.current === 0) {
              setIsRunning(false);
            }
          }

          return copy;
        });
      }, 250);
    };

    while (runningRef.current < 2 && indexRef.current < taskCount) {
      startTask(indexRef.current++);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Task Runner</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Run background tasks and watch their progress.
          </p>
        </div>

        <button
          onClick={runTasks}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isRunning ? "Running…" : "Start Tasks"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Task {t.id + 1}</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {t.progress}%
              </span>
            </div>

            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-200"
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
