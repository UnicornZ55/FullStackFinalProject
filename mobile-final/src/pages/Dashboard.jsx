import TaskRunner from "../components/TaskRunner";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Monitor task progress and run background jobs from here.
        </p>
      </header>

      <section className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <TaskRunner />
        </div>
      </section>
    </div>
  );
}