import { useEffect, useState } from "react";
import api from "../services/api";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "todo",
  });

  const loadTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post("/tasks", form);
    setForm({ title: "", description: "", due_date: "", status: "todo" });
    loadTasks();
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Tasks & Reminders</h2>
      <form onSubmit={onSubmit} className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-2 md:grid-cols-2">
          <input className="rounded border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="rounded border p-2" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
          <input className="rounded border p-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="rounded bg-indigo-600 px-3 py-2 text-white md:col-span-2">Create Task</button>
        </div>
      </form>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task._id} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="font-semibold">{task.title}</p>
            <p className="text-sm text-slate-600">{task.description}</p>
            <p className="text-xs text-slate-500">
              Due: {new Date(task.due_date).toLocaleDateString()} | Status: {task.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TasksPage;
