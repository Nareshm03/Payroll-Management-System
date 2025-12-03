import React, { useContext, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { lightTheme, darkTheme } from './theme/muiTheme';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import SalarySlipsPage from './pages/SalarySlipsPage';
import ExpensesPage from './pages/ExpensesPage';
import EmployeesPage from './pages/EmployeesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard darkMode={darkMode} setDarkMode={setDarkMode} /></MainLayout></PrivateRoute>} />
            <Route path="/salary-slips" element={<PrivateRoute><MainLayout><SalarySlipsPage /></MainLayout></PrivateRoute>} />
            <Route path="/expenses" element={<PrivateRoute><MainLayout><ExpensesPage /></MainLayout></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><MainLayout><EmployeesPage /></MainLayout></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><MainLayout><AnalyticsPage /></MainLayout></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><MainLayout><NotificationsPage /></MainLayout></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
