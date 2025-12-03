import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import CreateSalarySlip from './CreateSalarySlip';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import StatCard from '../common/StatCard';
import EmptyState from '../common/EmptyState';
import Footer from '../common/Footer';
import { People, AttachMoney, Receipt } from '@mui/icons-material';
import StatusBadge from '../common/StatusBadge';
import { Add, Edit, CheckCircle, Cancel, Download, PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import { exportToCSV } from '../../utils/csvExport';
import { showToast } from '../../utils/toast';

const AdminDashboard = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredSlips, setFilteredSlips] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [slipSearch, setSlipSearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSlip, setEditSlip] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setStatsLoading(true);
    }
    setError(null);
    try {
      const [slipsRes, expensesRes, statsRes] = await Promise.all([
        adminAPI.getAllSalarySlips(),
        adminAPI.getAllExpenses(),
        adminAPI.getDashboardStats()
      ]);
      setSalarySlips(slipsRes.data || []);
      setExpenses(expensesRes.data || []);
      setFilteredSlips(slipsRes.data || []);
      setFilteredExpenses(expensesRes.data || []);
      setStats(statsRes.data || {});
      setLastUpdate(new Date());
    } catch (err) {
      let errorMsg = 'Failed to load dashboard data';
      if (err.response?.data) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(e => e.msg || e).join(', ');
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!slipSearch) {
      setFilteredSlips(salarySlips);
      return;
    }
    const query = slipSearch.toLowerCase();
    setFilteredSlips(salarySlips.filter(slip => 
      slip.employee_id?.toString().includes(query) ||
      slip.month_year?.toLowerCase().includes(query) ||
      slip.net_salary?.toString().includes(query)
    ));
  }, [slipSearch, salarySlips]);

  useEffect(() => {
    if (!expenseSearch) {
      setFilteredExpenses(expenses);
      return;
    }
    const query = expenseSearch.toLowerCase();
    setFilteredExpenses(expenses.filter(exp => 
      exp.employee_id?.toString().includes(query) ||
      exp.category?.toLowerCase().includes(query) ||
      exp.description?.toLowerCase().includes(query) ||
      exp.amount?.toString().includes(query)
    ));
  }, [expenseSearch, expenses]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateExpenseStatus(id, status);
      if (status === 'approved') {
        showToast.success('Expense approved successfully');
      } else if (status === 'rejected') {
        showToast.warning('Expense rejected');
      }
      loadData();
    } catch (err) {
      showToast.error('Failed to update expense status');
    }
  };

  const handleEdit = (slip) => {
    setEditSlip(slip);
    setDialogOpen(true);
  };

  const generatePDF = (slip) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SALARY SLIP', pageWidth / 2, 20, { align: 'center' });
      
      // Company Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Payroll Management System', pageWidth / 2, 30, { align: 'center' });
      
      // Employee Details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Employee Details', 20, 45);
      doc.setFont('helvetica', 'normal');
      doc.text(`Employee ID: ${slip.employee_id}`, 20, 55);
      
      // Month/Year
      const monthYear = new Date(slip.month_year + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      doc.text(`Period: ${monthYear}`, 20, 65);
      
      // Salary Breakdown
      doc.setFont('helvetica', 'bold');
      doc.text('Salary Breakdown', 20, 80);
      doc.setFont('helvetica', 'normal');
      
      let yPos = 90;
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
      
      // Line separator
      yPos += 5;
      doc.line(20, yPos, 150, yPos);
      
      // Net Salary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Net Salary:', 20, yPos);
      doc.text(`$${slip.net_salary.toFixed(2)}`, 150, yPos, { align: 'right' });
      
      // Footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${generatedDate}`, 20, 270);
      doc.text('Authorized Signature: _____________________', 20, 280);
      
      // Save PDF
      doc.save(`salary_slip_${slip.employee_id}_${slip.month_year}.pdf`);
      showToast.success('Salary slip PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      showToast.error('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Typography color="error" variant="h6" className="mb-4">
          {String(error)}
        </Typography>
        <Button variant="contained" onClick={loadData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-[32px] font-bold leading-[48px] text-navy-900 mb-2">Admin Dashboard</h1>
        <p className="text-base leading-6 text-navy-600">Monitor payroll operations and manage employee compensation</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="animate-card" style={{ animationDelay: '0ms' }}>
          <StatCard
            title="Total Employees"
            value={stats.total_employees || 0}
            icon={<People sx={{ fontSize: 40 }} />}
            color="primary"
            updated={`Updated ${lastUpdate.toLocaleTimeString()}`}
            loading={statsLoading}
          />
        </div>
        <div className="animate-card" style={{ animationDelay: '100ms' }}>
          <StatCard
            title="Pending Expenses"
            value={stats.pending_expenses || 0}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="warning"
            trend={stats.pending_expenses > 0 ? 'up' : null}
            trendValue={stats.pending_expenses > 0 ? `${stats.pending_expenses} pending` : null}
            loading={statsLoading}
          />
        </div>
        <div className="animate-card" style={{ animationDelay: '200ms' }}>
          <StatCard
            title="Total Salary Slips"
            value={stats.total_salary_slips || 0}
            icon={<Receipt sx={{ fontSize: 40 }} />}
            color="success"
            updated={`Updated ${lastUpdate.toLocaleTimeString()}`}
            loading={statsLoading}
          />
        </div>
      </div>

      {/* Salary Slips Section */}
      <Card className="mb-6 rounded-xl border border-neutral-200 shadow-sm animate-card hover-lift">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold leading-9 text-navy-900">Salary Slips</h2>
              <p className="text-sm leading-[21px] text-navy-500 mt-1">Manage employee compensation records</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                onClick={() => exportToCSV(salarySlips, 'salary_slips')}
                className="btn-transition"
                sx={{ 
                  height: '40px',
                  px: 2.5,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 400
                }}
              >
                Export CSV
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => {
                  setEditSlip(null);
                  setDialogOpen(true);
                }}
                className="btn-transition"
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
                Create Salary Slip
              </Button>
            </div>
          </div>
          <TableContainer component={Paper} className="modern-table" sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>EMPLOYEE ID</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>MONTH</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>BASIC</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ALLOWANCES</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>BONUSES</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DEDUCTIONS</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>TAX</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>NET SALARY</TableCell>
                  <TableCell align="center" sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salarySlips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ p: 0, borderBottom: 'none' }}>
                      <EmptyState
                        icon="📋"
                        title="No salary slips yet"
                        description="Create one with the Create Salary Slip button."
                        actionLabel="Create Salary Slip"
                        onAction={() => {
                          setEditSlip(null);
                          setDialogOpen(true);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  salarySlips.map((slip, index) => (
                    <TableRow 
                      key={slip.id}
                      className="table-row-animate"
                      sx={{ 
                        height: '56px',
                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,1)' : 'rgba(248,249,250,0.5)',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{slip.employee_id}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{slip.month_year}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.basic_salary.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.allowances.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.bonuses.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.deductions.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.tax.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${slip.net_salary.toLocaleString()}</TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        <div className="flex gap-1 justify-center">
                          <IconButton size="small" onClick={() => handleEdit(slip)} title="Edit" className="icon-btn-animate" sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
                            <Edit sx={{ fontSize: '18px' }} />
                          </IconButton>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Expense Requests Section */}
      <Card className="rounded-xl border border-neutral-200 shadow-sm animate-card hover-lift">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold leading-9 text-navy-900">Expense Requests</h2>
              <p className="text-sm leading-[21px] text-navy-500 mt-1">Review and approve employee expense submissions</p>
            </div>
            <Button 
              variant="outlined" 
              startIcon={<Download />}
              onClick={() => exportToCSV(expenses, 'expenses')}
              className="btn-transition"
              sx={{ 
                height: '40px',
                px: 2.5,
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Export CSV
            </Button>
          </div>
          <TableContainer component={Paper} className="modern-table" sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>EMPLOYEE ID</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>AMOUNT</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DATE</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DESCRIPTION</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>STATUS</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, borderBottom: 'none' }}>
                      <EmptyState
                        icon="💼"
                        title="No expense requests yet"
                        description="Employees' submissions will appear here."
                        secondaryLabel="Learn About Expense Approval"
                        onSecondary={() => window.open('https://github.com/yourusername/payroll-docs', '_blank')}
                        statusText="System connected • Ready to receive submissions"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((exp, index) => (
                    <TableRow 
                      key={exp.id}
                      className="table-row-animate"
                      sx={{ 
                        height: '56px',
                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,1)' : 'rgba(248,249,250,0.5)',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{exp.employee_id}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{exp.category}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: exp.amount > 1000 ? '#ef4444' : '#1e293b', fontWeight: exp.amount > 1000 ? 600 : 400, py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${exp.amount.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{new Date(exp.expense_date).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{exp.description}</TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        <StatusBadge status={exp.status} />
                      </TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        {exp.status === 'pending' && (
                          <div className="flex gap-1">
                            <IconButton 
                              size="small"
                              onClick={() => handleStatusUpdate(exp.id, 'approved')}
                              className="icon-btn-animate"
                              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                              title="Approve"
                            >
                              <CheckCircle sx={{ fontSize: '18px', color: '#22c55e' }} />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleStatusUpdate(exp.id, 'rejected')}
                              className="icon-btn-animate"
                              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                              title="Reject"
                            >
                              <Cancel sx={{ fontSize: '18px', color: '#ef4444' }} />
                            </IconButton>
                          </div>
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

      <CreateSalarySlip 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSuccess={loadData}
        editSlip={editSlip}
      />
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
