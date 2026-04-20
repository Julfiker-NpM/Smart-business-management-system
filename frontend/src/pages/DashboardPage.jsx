import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { listRecords, toJsDate } from "../services/firestoreService";

const DashboardPage = () => {
  const { user } = useAuth();
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

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Dashboard Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={stats.totalClients} />
        <StatCard title="Total Leads" value={stats.totalLeads} />
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks} />
      </div>
    </section>
  );
};

export default DashboardPage;
