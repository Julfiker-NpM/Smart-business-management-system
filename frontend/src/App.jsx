import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import CalendarPage from "./pages/CalendarPage";
import ContentPlannerPage from "./pages/ContentPlannerPage";
import CRMPage from "./pages/CRMPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import TasksPage from "./pages/TasksPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/crm" element={<CRMPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/content" element={<ContentPlannerPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
