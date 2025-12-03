import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminAPI, employeeAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import ExpenseForm from '../components/employee/ExpenseForm';
import EmptyState from '../components/common/EmptyState';
import Footer from '../components/common/Footer';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Tabs, Tab, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment } from '@mui/material';
import { Add, CheckCircle, Cancel, Search } from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';

const ExpensesPage = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, expenseId: null, action: null });

  useEffect(() => {
    loadExpenses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExpenses = async () => {
    try {
      const res = user.role === 'admin' 
        ? await adminAPI.getAllExpenses()
        : await employeeAPI.getMyExpenses();
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateExpenseStatus(id, status);
      await loadExpenses();
      setConfirmDialog({ open: false, expenseId: null, action: null });
    } catch (err) {
      alert('Failed to update expense');
    }
  };

  const openConfirmDialog = (id, action) => {
    setConfirmDialog({ open: true, expenseId: id, action });
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
    
    if (!debouncedSearch) return matchesStatus;
    
    const query = debouncedSearch.toLowerCase();
    const matchesSearch = 
      exp.category?.toLowerCase().includes(query) ||
      exp.description?.toLowerCase().includes(query) ||
      exp.amount?.toString().includes(query) ||
      exp.employee_id?.toString().includes(query) ||
      new Date(exp.expense_date).toLocaleDateString().toLowerCase().includes(query);
    
    return matchesStatus && matchesSearch;
  });

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
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-bold leading-[48px] text-navy-900 mb-2">Expenses</h1>
            <p className="text-base leading-6 text-navy-600">
              {user.role === 'admin' ? 'Review and manage employee expense requests' : 'Track and submit your expense claims'}
            </p>
          </div>
          {user.role === 'employee' && (
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
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {user.role === 'admin' && (
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={filterStatus} 
            onChange={(e, newValue) => setFilterStatus(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                minHeight: '40px',
                px: 3
              }
            }}
          >
            <Tab label="All" value="all" />
            <Tab label="Pending" value="pending" />
            <Tab label="Approved" value="approved" />
            <Tab label="Rejected" value="rejected" />
          </Tabs>
        </Box>
      )}

      {/* Expenses Table */}
      <Card className="rounded-xl border border-neutral-200 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold leading-9 text-navy-900">Expense Requests</h2>
                <p className="text-sm leading-[21px] text-navy-500 mt-1">
                  {user.role === 'admin' ? 'All employee expense submissions' : 'Your submitted expense claims'}
                </p>
              </div>
              <TextField
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ width: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 20, color: '#7F8C8D' }} />
                    </InputAdornment>
                  )
                }}
              />
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
                  {user.role === 'admin' && <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ACTIONS</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user.role === 'admin' ? 6 : 5} sx={{ borderBottom: 'none', p: 0 }}>
                      <EmptyState
                        icon="💸"
                        title={searchQuery ? 'No expenses match your search' : 'No expenses submitted'}
                        description={searchQuery ? 'Try adjusting your search terms' : (user.role === 'admin' ? 'Employees will see their submission history here.' : 'Submit your first expense using the button above.')}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((exp, index) => (
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
                      <TableCell sx={{ fontSize: '14px', color: exp.amount > 1000 ? '#ef4444' : '#1e293b', fontWeight: exp.amount > 1000 ? 600 : 400, py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>${exp.amount.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{exp.description}</TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        <StatusBadge status={exp.status} />
                      </TableCell>
                      {user.role === 'admin' && (
                        <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                          {exp.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<CheckCircle sx={{ fontSize: '16px' }} />}
                                onClick={() => openConfirmDialog(exp.id, 'approved')}
                                sx={{
                                  backgroundColor: '#22c55e',
                                  color: '#ffffff',
                                  textTransform: 'none',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  px: 2,
                                  py: 0.5,
                                  '&:hover': { backgroundColor: '#16a34a' }
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Cancel sx={{ fontSize: '16px' }} />}
                                onClick={() => openConfirmDialog(exp.id, 'rejected')}
                                sx={{
                                  borderColor: '#ef4444',
                                  color: '#ef4444',
                                  textTransform: 'none',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  px: 2,
                                  py: 0.5,
                                  '&:hover': { borderColor: '#dc2626', backgroundColor: 'rgba(239, 68, 68, 0.04)' }
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {user.role === 'employee' && (
        <ExpenseForm open={dialogOpen} onClose={() => setDialogOpen(false)} onSuccess={loadExpenses} />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, expenseId: null, action: null })}>
        <DialogTitle>
          {confirmDialog.action === 'approved' ? 'Approve Expense?' : 'Reject Expense?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'approved' 
              ? 'Are you sure you want to approve this expense request? This action will notify the employee.'
              : 'Are you sure you want to reject this expense request? This action will notify the employee.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmDialog({ open: false, expenseId: null, action: null })}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleStatusUpdate(confirmDialog.expenseId, confirmDialog.action)}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: confirmDialog.action === 'approved' ? '#22c55e' : '#ef4444',
              '&:hover': { backgroundColor: confirmDialog.action === 'approved' ? '#16a34a' : '#dc2626' }
            }}
          >
            {confirmDialog.action === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ExpensesPage;
