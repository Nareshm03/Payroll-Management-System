import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        error.response.data.detail = detail.map(e => e.msg || JSON.stringify(e)).join(', ');
      } else if (typeof detail === 'object') {
        error.response.data.detail = JSON.stringify(detail);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  getEmployees: () => api.get('/auth/employees'),
};

export const adminAPI = {
  createSalarySlip: (data) => api.post('/admin/salary-slips', data),
  updateSalarySlip: (id, data) => api.put(`/admin/salary-slips/${id}`, data),
  getAllSalarySlips: () => api.get('/admin/salary-slips'),
  getAllExpenses: () => api.get('/admin/expenses'),
  updateExpenseStatus: (id, status) => api.patch(`/admin/expenses/${id}`, { status }),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
};

export const employeeAPI = {
  createExpense: (data) => api.post('/employee/expenses', data),
  getMyExpenses: () => api.get('/employee/expenses'),
  getMySalarySlips: () => api.get('/employee/salary-slips'),
  getDashboardStats: () => api.get('/employee/dashboard-stats'),
};

export default api;
