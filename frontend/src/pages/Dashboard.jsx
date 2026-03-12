import { useContext } from "react";
import TaskRunner from "../components/TaskRunner";
import { ThemeContext } from "../context/ThemeContext";

export default function Dashboard() {
  const { config } = useContext(ThemeContext);
  const isDark = config.theme === "dark";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-gray-950"}`}>
          Admin Dashboard
        </h1>
        <p className={`mt-2 text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          Monitor task progress and run background jobs from here.
        </p>
      </header>

      <section className={`rounded-xl border shadow-sm ${isDark ? "border-gray-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
        <div className="p-6">
          <TaskRunner />
        </div>
      </section>
    </div>
  );
}