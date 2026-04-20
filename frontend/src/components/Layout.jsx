import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
