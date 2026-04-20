import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { listRecords, toJsDate } from "../services/firestoreService";
import { exportFullWorkbook, exportWorksheet } from "../services/exportService";

const DashboardPage = () => {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalLeads: 0,
    totalTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      const [clients, leads, tasks] = await Promise.all([
        listRecords("clients", user.id),
        listRecords("leads", user.id),
        listRecords("tasks", user.id),
      ]);
      const overdueTasks = tasks.filter((task) => {
        const isDone = task.status === "done";
        return !isDone && toJsDate(task.due_date) < new Date();
      }).length;
      setStats({
        totalClients: clients.length,
        totalLeads: leads.length,
        totalTasks: tasks.length,
        overdueTasks,
      });
    };
    loadStats();
  }, [user?.id]);

  const getAllModuleData = async () => {
    const [clients, leads, tasks, messages, contentPosts, meetings] = await Promise.all([
      listRecords("clients", user.id),
      listRecords("leads", user.id),
      listRecords("tasks", user.id),
      listRecords("messages", user.id),
      listRecords("contentPosts", user.id),
      listRecords("meetings", user.id),
    ]);
    return { clients, leads, tasks, messages, contentPosts, meetings };
  };

  const exportModule = async (moduleName) => {
    if (!user?.id) return;
    setExporting(true);
    try {
      const records = await listRecords(moduleName, user.id);
      exportWorksheet(records, `${moduleName}-${new Date().toISOString().slice(0, 10)}`, moduleName);
    } finally {
      setExporting(false);
    }
  };

  const exportAll = async () => {
    if (!user?.id) return;
    setExporting(true);
    try {
      const data = await getAllModuleData();
      exportFullWorkbook(data);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="mb-4 text-2xl font-semibold">Dashboard Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={stats.totalClients} />
        <StatCard title="Total Leads" value={stats.totalLeads} />
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks} />
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Owner Report Export</h3>
        <p className="mt-1 text-sm text-slate-500">
          Download Excel reports of clients, leads, tasks, messages, content, and meetings.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportAll}
            disabled={exporting}
            className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export Full Report (.xlsx)"}
          </button>
          <button type="button" onClick={() => exportModule("clients")} disabled={exporting} className="rounded border px-3 py-2 text-sm hover:bg-slate-50">
            Clients
          </button>
          <button type="button" onClick={() => exportModule("leads")} disabled={exporting} className="rounded border px-3 py-2 text-sm hover:bg-slate-50">
            Leads
          </button>
          <button type="button" onClick={() => exportModule("tasks")} disabled={exporting} className="rounded border px-3 py-2 text-sm hover:bg-slate-50">
            Tasks
          </button>
          <button type="button" onClick={() => exportModule("messages")} disabled={exporting} className="rounded border px-3 py-2 text-sm hover:bg-slate-50">
            Messages
          </button>
          <button type="button" onClick={() => exportModule("contentPosts")} disabled={exporting} className="rounded border px-3 py-2 text-sm hover:bg-slate-50">
            Content
          </button>
          <button type="button" onClick={() => exportModule("meetings")} disabled={exporting} className="rounded border px-3 py-2 text-sm hover:bg-slate-50">
            Meetings
          </button>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
