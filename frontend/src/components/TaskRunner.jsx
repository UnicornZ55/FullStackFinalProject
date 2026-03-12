import { useRef, useState } from "react";

function createTasks(taskCount) {
  return Array.from({ length: taskCount }, (_, i) => ({
    id: i,
    progress: 0,
    status: "pending"
  }));
}

function createTaskProfiles(taskCount) {
  return Array.from({ length: taskCount }, () => ({
    step: Math.floor(Math.random() * 9) + 4,
    delay: Math.floor(Math.random() * 180) + 140,
  }));
}

export default function TaskRunner() {
  const taskCount = 10;
  const [tasks, setTasks] = useState(createTasks(taskCount));
  const [isRunning, setIsRunning] = useState(false);

  const runningRef = useRef(0);
  const indexRef = useRef(0);
  const taskProfilesRef = useRef(createTaskProfiles(taskCount));

  const runTasks = () => {
    if (isRunning) return;

    taskProfilesRef.current = createTaskProfiles(taskCount);
    setTasks(createTasks(taskCount));
    setIsRunning(true);

    runningRef.current = 0;
    indexRef.current = 0;

    const startTask = (i) => {
      runningRef.current += 1;
      const profile = taskProfilesRef.current[i];

      setTasks((prev) => {
        const copy = [...prev];
        copy[i] = {
          ...copy[i],
          status: "running"
        };
        return copy;
      });

      const interval = setInterval(() => {
        setTasks((prev) => {
          const copy = [...prev];
          const nextProgress = Math.min(copy[i].progress + profile.step, 100);

          copy[i] = {
            ...copy[i],
            progress: nextProgress,
            status: nextProgress >= 100 ? "completed" : "running"
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
      }, profile.delay);
    };

    while (runningRef.current < 2 && indexRef.current < taskCount) {
      startTask(indexRef.current++);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold ">Task Runner</h2>
          
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
            className="rounded-lg border border-slate-700 bg-slate-950 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-white">Task {t.id + 1}</span>
                <p className={`mt-1 text-[11px] font-semibold uppercase tracking-wider ${
                  t.status === "completed"
                    ? "text-emerald-400"
                    : t.status === "running"
                    ? "text-blue-300"
                    : "text-slate-400"
                }`}>
                  {t.status}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {t.progress}%
              </span>
            </div>

            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  t.status === "completed" ? "bg-emerald-400" : "bg-blue-500"
                }`}
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
