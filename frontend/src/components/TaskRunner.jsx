import { useState } from "react";

export default function TaskRunner() {

  const [tasks, setTasks] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      progress: 0
    }))
  );

  const runTasks = () => {

    let running = 0;
    let index = 0;

    const startTask = (i) => {

      running++;

      const interval = setInterval(() => {

        setTasks(prev => {

          const copy = [...prev];

          copy[i] = {
            ...copy[i],
            progress: copy[i].progress + 10
          };

          if (copy[i].progress >= 100) {

            clearInterval(interval);
            running--;

            if (index < 10) {
              startTask(index++);
            }

          }

          return copy;

        });

      }, 300);

    };

    while (running < 2 && index < 10) {
      startTask(index++);
    }

  };

  return (

    <div className="p-4">

      <button
        onClick={runTasks}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Start Tasks
      </button>

      {tasks.map(t => (

        <div key={t.id} className="mb-3">

          <p>Task {t.id}</p>

          <div className="w-64 bg-gray-200 h-3 rounded">

            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${t.progress}%` }}
            />

          </div>

        </div>

      ))}

    </div>

  );

}