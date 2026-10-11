import { Navigate, Route, Routes } from 'react-router-dom';
import RequireRole from './RequireRole.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MyTransactionsPage from './pages/MyTransactionsPage.jsx';
import SubmitPage from './pages/SubmitPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route
        path="/submit"
        element={
          <RequireRole role="USER">
            <SubmitPage />
          </RequireRole>
        }
      />

      <Route
        path="/my-transactions"
        element={
          <RequireRole role="USER">
            <MyTransactionsPage />
          </RequireRole>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireRole role="ANALYST">
            <DashboardPage />
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
