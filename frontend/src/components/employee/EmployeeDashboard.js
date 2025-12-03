import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import ExpenseForm from './ExpenseForm';
import { Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import StatCard from '../common/StatCard';
import { AccountBalance, AttachMoney, HourglassEmpty } from '@mui/icons-material';
import StatusBadge from '../common/StatusBadge';
import { Add, Receipt, Download, PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportToCSV } from '../../utils/csvExport';
import EmptyState from '../common/EmptyState';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EmployeeDashboard = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const generatePDF = (slip) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SALARY SLIP', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('PayrollPulse', pageWidth / 2, 30, { align: 'center' });
      
      const monthYear = new Date(slip.month_year + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Period: ${monthYear}`, 20, 50);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Salary Breakdown', 20, 65);
      doc.setFont('helvetica', 'normal');
      
      let yPos = 75;
      doc.text('Basic Salary:', 20, yPos);
      doc.text(`$${slip.basic_salary.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      yPos += 10;
      doc.text('Allowances:', 20, yPos);
      doc.text(`$${slip.allowances.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      yPos += 10;
      doc.text('Bonuses:', 20, yPos);
      doc.text(`$${slip.bonuses.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      yPos += 10;
      doc.text('Deductions:', 20, yPos);
      doc.text(`-$${slip.deductions.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      yPos += 10;
      doc.text('Tax:', 20, yPos);
      doc.text(`-$${slip.tax.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      yPos += 5;
      doc.line(20, yPos, 150, yPos);
      
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Net Salary:', 20, yPos);
      doc.text(`$${slip.net_salary.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${generatedDate}`, 20, 270);
      
      doc.save(`salary_slip_${slip.month_year}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF');
    }
  };

  const loadData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setStatsLoading(true);
    }
    try {
      const [slipsRes, expensesRes, statsRes] = await Promise.all([
        employeeAPI.getMySalarySlips(),
        employeeAPI.getMyExpenses(),
        employeeAPI.getDashboardStats()
      ]);
      setSalarySlips(slipsRes.data || []);
      setExpenses(expensesRes.data || []);
      setStats(statsRes.data || {});
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const getExpensesByCategory = () => {
    const categoryMap = {};
    expenses.forEach(exp => {
      if (exp.status === 'approved') {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      }
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const getSalaryTrend = () => {
    return salarySlips.map(slip => ({
      month: slip.month_year,
      salary: slip.net_salary
    })).reverse();
  };

  const getMonthlyExpenses = () => {
    const monthMap = {};
    expenses.forEach(exp => {
      const month = exp.expense_date.substring(0, 7);
      monthMap[month] = (monthMap[month] || 0) + exp.amount;
    });
    return Object.entries(monthMap).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month));
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
        <h1 className="text-[32px] font-bold leading-[48px] text-navy-900 mb-2">Employee Dashboard</h1>
        <p className="text-base leading-6 text-navy-600">Track your compensation, expenses, and financial insights</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="animate-card" style={{ animationDelay: '0ms' }}>
          <StatCard
            title="Current Month Salary"
            value={`$${stats.current_month_salary || 0}`}
            icon={<AccountBalance sx={{ fontSize: 40 }} />}
            color="success"
            updated={`Updated ${lastUpdate.toLocaleTimeString()}`}
            loading={statsLoading}
          />
        </div>
        <div className="animate-card" style={{ animationDelay: '100ms' }}>
          <StatCard
            title="Total Expenses"
            value={stats.total_expenses || 0}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="primary"
            loading={statsLoading}
          />
        </div>
        <div className="animate-card" style={{ animationDelay: '200ms' }}>
          <StatCard
            title="Pending Expenses"
            value={stats.pending_expenses || 0}
            icon={<HourglassEmpty sx={{ fontSize: 40 }} />}
            color="warning"
            trend={stats.pending_expenses > 0 ? 'up' : null}
            trendValue={stats.pending_expenses > 0 ? 'Awaiting approval' : null}
            loading={statsLoading}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {getSalaryTrend().length > 0 && (
          <Card className="rounded-xl border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium leading-[30px] text-navy-900 mb-6">Salary Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getSalaryTrend()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Line type="monotone" dataKey="salary" stroke="#1976D2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {getMonthlyExpenses().length > 0 && (
          <Card className="rounded-xl border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium leading-[30px] text-navy-900 mb-6">Monthly Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getMonthlyExpenses()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="amount" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expense Breakdown */}
      {getExpensesByCategory().length > 0 && (
        <Card className="mb-12 rounded-xl border border-neutral-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium leading-[30px] text-navy-900 mb-6">Approved Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getExpensesByCategory()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getExpensesByCategory().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* My Expenses Section */}
      <Card className="mb-12 rounded-xl border border-neutral-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold leading-9 text-navy-900">My Expenses</h2>
              <p className="text-sm leading-[21px] text-navy-500 mt-1">Track and manage your expense submissions</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                onClick={() => exportToCSV(expenses, 'my_expenses')}
                sx={{ 
                  height: '40px',
                  px: 2.5,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 400
                }}
              >
                Export
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
                sx={{ 
                  height: '40px',
                  px: 2.5,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                Submit Expense
              </Button>
            </div>
          </div>
          <TableContainer component={Paper} className="modern-table" sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DATE</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>AMOUNT</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DESCRIPTION</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>STATUS</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>RECEIPT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
                      <EmptyState
                        icon="💳"
                        title="You haven't submitted any expenses yet"
                        description="Use Submit Expense to add one."
                        actionLabel="Submit Expense"
                        onAction={() => setDialogOpen(true)}
                        secondaryLabel="Quick Start Guide"
                        onSecondary={() => window.open('https://github.com/yourusername/payroll-docs/expenses', '_blank')}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((exp, index) => (
                    <TableRow 
                      key={exp.id}
                      sx={{ 
                        height: '56px',
                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,1)' : 'rgba(248,249,250,0.5)',
                        '&:hover': { backgroundColor: '#f5f5f5 !important' },
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{new Date(exp.expense_date).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{exp.category}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${exp.amount.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{exp.description}</TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        <StatusBadge status={exp.status} />
                      </TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        {exp.receipt_url && (
                          <a href={exp.receipt_url} target="_blank" rel="noopener noreferrer">
                            <Receipt fontSize="small" color="primary" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* My Salary Slips Section */}
      <Card className="rounded-xl border border-neutral-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold leading-9 text-navy-900">My Salary Slips</h2>
              <p className="text-sm leading-[21px] text-navy-500 mt-1">View your compensation history and breakdown</p>
            </div>
            <Button 
              variant="outlined" 
              startIcon={<Download />}
              onClick={() => exportToCSV(salarySlips, 'my_salary_slips')}
              sx={{ 
                height: '40px',
                px: 2.5,
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Export
            </Button>
          </div>
          <TableContainer component={Paper} className="modern-table" sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>MONTH</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>BASIC SALARY</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ALLOWANCES</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>BONUSES</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DEDUCTIONS</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>TAX</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>NET SALARY</TableCell>
                  <TableCell align="center" sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salarySlips.map((slip, index) => (
                  <TableRow 
                    key={slip.id}
                    sx={{ 
                      height: '56px',
                      backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,1)' : 'rgba(248,249,250,0.5)',
                      '&:hover': { backgroundColor: '#f5f5f5 !important' },
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{slip.month_year}</TableCell>
                    <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.basic_salary.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.allowances.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.bonuses.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.deductions.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.tax.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.net_salary.toLocaleString()}</TableCell>
                    <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PictureAsPdf sx={{ fontSize: '16px' }} />}
                        onClick={() => generatePDF(slip)}
                        className="btn-transition"
                        sx={{
                          height: '32px',
                          px: 1.5,
                          fontSize: '13px',
                          fontWeight: 500,
                          textTransform: 'none',
                          borderRadius: '6px',
                          backgroundColor: '#3B82F6',
                          '&:hover': { backgroundColor: '#2563EB' }
                        }}
                      >
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ExpenseForm 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSuccess={loadData}
      />
    </div>
  );
};

export default EmployeeDashboard;
