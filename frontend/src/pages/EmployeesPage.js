import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';
import EmptyState from '../components/common/EmptyState';
import Footer from '../components/common/Footer';

const EmployeesPage = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadEmployees();
    }
  }, [user]);

  const loadEmployees = async () => {
    try {
      const res = await authAPI.getEmployees();
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredEmployees(employees);
      return;
    }

    const query = debouncedSearch.toLowerCase();
    const filtered = employees.filter(emp => 
      (emp.full_name?.toLowerCase().includes(query)) ||
      (emp.email?.toLowerCase().includes(query)) ||
      (emp.id?.toString().includes(query)) ||
      (emp.role?.toLowerCase().includes(query))
    );
    setFilteredEmployees(filtered);
  }, [debouncedSearch, employees]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="error">Access Denied: Admin Only</Typography>
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-[32px] font-bold leading-[48px] text-navy-900 mb-2">Manage Employees</h1>
        <p className="text-base leading-6 text-navy-600">View and manage all employee accounts</p>
      </div>

      {/* Employees Table */}
      <Card className="rounded-xl border border-neutral-200 shadow-sm animate-card hover-lift">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold leading-9 text-navy-900">All Employees</h2>
                <p className="text-sm leading-[21px] text-navy-500 mt-1">Complete list of registered employees</p>
              </div>
              <TextField
                placeholder="Search employees..."
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
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ID</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>NAME</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>EMAIL</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ROLE</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>JOINED</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: 'none' }}>
                      <EmptyState
                        icon="👥"
                        title={searchQuery ? 'No employees match your search' : 'No employees found'}
                        description={searchQuery ? 'Try adjusting your search terms' : 'Employee accounts will appear here once registered.'}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <TableRow 
                      key={emp.id}
                      className="table-row-animate"
                      sx={{ 
                        height: '56px',
                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,1)' : 'rgba(248,249,250,0.5)',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{emp.id}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500, py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{emp.full_name || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{emp.email}</TableCell>
                      <TableCell sx={{ py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        <Chip 
                          label={emp.role} 
                          size="small"
                          sx={{
                            backgroundColor: emp.role === 'admin' ? '#E6F7E6' : '#E6F7E6',
                            color: emp.role === 'admin' ? '#2E7D32' : '#2E7D32',
                            fontSize: '12px',
                            fontWeight: 500,
                            height: '24px',
                            borderRadius: '6px',
                            textTransform: 'lowercase'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '14px', color: '#1e293b', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>{new Date(emp.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Footer />
    </div>
  );
};

export default EmployeesPage;
