import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalLeads: 0,
    totalTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data));
  }, []);

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
