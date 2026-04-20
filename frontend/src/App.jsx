import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import CalendarPage from "./pages/CalendarPage";
import ContentPlannerPage from "./pages/ContentPlannerPage";
import CRMPage from "./pages/CRMPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import TasksPage from "./pages/TasksPage";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuth();
  if (!authReady) {
    return <div className="p-6 text-sm text-slate-600">Checking authentication...</div>;
  }
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="crm" element={<CRMPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="content" element={<ContentPlannerPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
