import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminAPI, employeeAPI } from '../services/api';
import { Card, CardContent, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp } from '@mui/icons-material';

const COLORS = ['#1ABC9C', '#3498DB', '#E74C3C', '#F39C12', '#9B59B6', '#2ECC71'];

const AnalyticsPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [viewMode, setViewMode] = useState('aggregate');

  useEffect(() => {
    loadAnalytics();
  }, [timeFilter, viewMode]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (user?.role === 'admin') {
        const [salaryRes, expenseRes] = await Promise.all([
          adminAPI.getAllSalarySlips(),
          adminAPI.getAllExpenses()
        ]);
        processSalaryData(salaryRes.data);
        processExpenseData(expenseRes.data);
      } else {
        const [salaryRes, expenseRes] = await Promise.all([
          employeeAPI.getMySalarySlips(),
          employeeAPI.getMyExpenses()
        ]);
        processSalaryData(salaryRes.data);
        processExpenseData(expenseRes.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const processSalaryData = (data) => {
    const grouped = data.reduce((acc, slip) => {
      const month = slip.month_year;
      if (!acc[month]) {
        acc[month] = { month, totalSalary: 0, count: 0 };
      }
      acc[month].totalSalary += slip.net_salary;
      acc[month].count += 1;
      return acc;
    }, {});

    const chartData = Object.values(grouped)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(item => ({
        month: item.month,
        salary: viewMode === 'aggregate' ? item.totalSalary : item.totalSalary / item.count
      }));

    setSalaryData(chartData);
  };

  const processExpenseData = (data) => {
    // Monthly totals
    const monthlyGrouped = data.reduce((acc, exp) => {
      const month = new Date(exp.expense_date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { month, total: 0 };
      }
      acc[month].total += exp.amount;
      return acc;
    }, {});

    const monthlyData = Object.values(monthlyGrouped)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    setExpenseData(monthlyData);

    // Category breakdown
    const categoryGrouped = data.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = { name: exp.category, value: 0 };
      }
      acc[exp.category].value += exp.amount;
      return acc;
    }, {});

    setExpenseByCategory(Object.values(categoryGrouped));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-[32px] font-bold leading-[48px] text-navy-900 mb-2">Analytics Dashboard</h1>
        <p className="text-base leading-6 text-navy-600">Comprehensive insights into payroll and expenses</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 rounded-xl border border-neutral-200 shadow-sm animate-card">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Time Period</InputLabel>
              <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} label="Time Period">
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            {user?.role === 'admin' && (
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>View Mode</InputLabel>
                <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)} label="View Mode">
                  <MenuItem value="aggregate">Company Total</MenuItem>
                  <MenuItem value="average">Average per Employee</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button variant="outlined" startIcon={<Download />} className="btn-transition" sx={{ ml: 'auto' }}>
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salary Chart */}
      <Card className="mb-6 rounded-xl border border-neutral-200 shadow-sm animate-card hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp sx={{ color: '#1ABC9C' }} />
            <h2 className="text-2xl font-semibold leading-9 text-navy-900">Salary Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" />
              <XAxis dataKey="month" stroke="#7F8C8D" style={{ fontSize: '12px' }} />
              <YAxis stroke="#7F8C8D" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip 
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #ECF0F1' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="salary" 
                stroke="#1ABC9C" 
                strokeWidth={3}
                dot={{ fill: '#1ABC9C', r: 5 }}
                activeDot={{ r: 7 }}
                name={viewMode === 'aggregate' ? 'Total Salary' : 'Average Salary'}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <Card className="rounded-xl border border-neutral-200 shadow-sm animate-card hover-lift">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold leading-9 text-navy-900 mb-6">Monthly Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" />
                <XAxis dataKey="month" stroke="#7F8C8D" style={{ fontSize: '12px' }} />
                <YAxis stroke="#7F8C8D" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ECF0F1' }}
                />
                <Bar dataKey="total" fill="#3498DB" radius={[8, 8, 0, 0]} name="Total Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense by Category Chart */}
        <Card className="rounded-xl border border-neutral-200 shadow-sm animate-card hover-lift">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold leading-9 text-navy-900 mb-6">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ECF0F1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
