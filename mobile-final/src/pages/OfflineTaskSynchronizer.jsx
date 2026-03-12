import { useCallback, useEffect, useRef, useState } from "react";
import externalClient from "../api/externalClient";

const TASK_CACHE_KEY = "offline_task_sync_v1";

function loadCachedTasks() {
  try {
    const raw = localStorage.getItem(TASK_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCachedTasks(tasks) {
  try {
    localStorage.setItem(TASK_CACHE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore storage write errors
  }
}

function makeClientTask(title) {
  return {
    id: `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    title,
    status: "pending",
    createdAt: Date.now(),
    syncedAt: null,
  };
}

export default function OfflineTaskSynchronizer() {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncingRef = useRef(false);

  const updateTasks = useCallback((updater) => {
    setTasks((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveCachedTasks(next);
      return next;
    });
  }, []);

  const syncQueue = useCallback(async () => {
    if (!isOnline || syncingRef.current) return;

    const pendingTasks = tasks
      .filter((task) => task.status === "pending")
      .sort((a, b) => a.createdAt - b.createdAt);

    if (pendingTasks.length === 0) return;

    syncingRef.current = true;
    setIsSyncing(true);

    let nextTasks = [...tasks];

    for (const pending of pendingTasks) {
      try {
        await externalClient.post("https://jsonplaceholder.typicode.com/todos", {
          title: pending.title,
          completed: false,
          userId: 1,
          clientTaskId: pending.id,
        });

        const syncedAt = new Date().toISOString();
        nextTasks = nextTasks.map((task) =>
          task.id === pending.id
            ? {
                ...task,
                status: "synced",
                syncedAt,
              }
            : task
        );
      } catch {
        // Keep remaining tasks as pending for next retry.
        break;
      }
    }

    updateTasks(nextTasks);
    syncingRef.current = false;
    setIsSyncing(false);
  }, [isOnline, tasks, updateTasks]);

  useEffect(() => {
    updateTasks(loadCachedTasks());
  }, [updateTasks]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline, syncQueue]);

  const handleAddTask = () => {
    const title = taskTitle.trim();
    if (!title) return;

    const newTask = makeClientTask(title);
    setTaskTitle("");

    updateTasks((prev) => [newTask, ...prev]);
  };

  const pendingCount = tasks.filter((task) => task.status === "pending").length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Offline-First Task Synchronizer</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add tasks anytime. Pending tasks auto-sync in FIFO order when online.
          </p>
        </div>

        <button
          type="button"
          onClick={syncQueue}
          disabled={!isOnline || isSyncing || pendingCount === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSyncing ? "Syncing..." : "Sync Now"}
        </button>
      </header>

      <div
        className={`mb-4 rounded-lg px-4 py-2 text-sm font-semibold ${
          isOnline
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {isOnline ? "Online" : "Offline"} · Pending queue: {pendingCount}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Add a task"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />

          <button
            type="button"
            onClick={handleAddTask}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {tasks.length === 0 && (
            <p className="text-sm text-gray-500">No tasks yet.</p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-200 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{task.title}</p>
                <span
                  className={`text-xs font-semibold ${
                    task.status === "synced" ? "text-green-700" : "text-orange-700"
                  }`}
                >
                  {task.status === "synced" ? "Synced" : "Pending"}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                ID: {task.id}
                {task.syncedAt ? ` · Synced at: ${new Date(task.syncedAt).toLocaleString()}` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}