import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/crm", label: "CRM" },
  { to: "/tasks", label: "Tasks" },
  { to: "/messages", label: "Messages" },
  { to: "/content", label: "Content Planner" },
  { to: "/calendar", label: "Calendar" },
];

const Sidebar = () => (
  <aside className="w-full bg-slate-900 p-4 text-white md:w-64">
    <h1 className="mb-6 text-xl font-semibold">Smart Business</h1>
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
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
