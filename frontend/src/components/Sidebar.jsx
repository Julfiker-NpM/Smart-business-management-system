import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/app", label: "Dashboard" },
  { to: "/app/crm", label: "CRM" },
  { to: "/app/tasks", label: "Tasks" },
  { to: "/app/messages", label: "Messages" },
  { to: "/app/content", label: "Content Planner" },
  { to: "/app/calendar", label: "Calendar" },
];

const Sidebar = () => (
  <aside className="w-full bg-slate-900 p-4 text-white md:w-64">
    <h1 className="mb-6 text-xl font-semibold">Smart Business</h1>
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/app"}
          className={({ isActive }) =>
            `block rounded px-3 py-2 text-sm transition ${
              isActive ? "bg-indigo-500" : "bg-slate-800 hover:bg-slate-700"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
