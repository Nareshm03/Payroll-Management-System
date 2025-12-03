import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminAPI, employeeAPI } from '../services/api';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';
import EmptyState from '../components/common/EmptyState';
import Footer from '../components/common/Footer';

const SalarySlipsPage = () => {
  const { user } = useContext(AuthContext);
  const [slips, setSlips] = useState([]);
  const [filteredSlips, setFilteredSlips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSlips = async () => {
    try {
      const res = user.role === 'admin' 
        ? await adminAPI.getAllSalarySlips()
        : await employeeAPI.getMySalarySlips();
      setSlips(res.data);
      setFilteredSlips(res.data);
    } catch (err) {
      console.error('Failed to load salary slips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredSlips(slips);
      return;
    }

    const query = debouncedSearch.toLowerCase();
    const filtered = slips.filter(slip => 
      slip.month_year?.toLowerCase().includes(query) ||
      slip.employee_id?.toString().includes(query) ||
      slip.net_salary?.toString().includes(query)
    );
    setFilteredSlips(filtered);
  }, [debouncedSearch, slips]);

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
        <h1 className="text-[32px] font-bold leading-[48px] text-navy-900 mb-2">Salary Slips</h1>
        <p className="text-base leading-6 text-navy-600">View your salary history and compensation details</p>
      </div>

      {/* Salary Slips Table */}
      <Card className="rounded-xl border border-neutral-200 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold leading-9 text-navy-900">Payment History</h2>
                <p className="text-sm leading-[21px] text-navy-500 mt-1">Detailed breakdown of your monthly compensation</p>
              </div>
              <TextField
                placeholder="Search salary slips..."
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
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>MONTH</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>BASIC</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>ALLOWANCES</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>BONUSES</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>DEDUCTIONS</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>TAX</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#64748B', py: '12px', px: '16px', borderBottom: '1px solid #f0f0f0' }}>NET SALARY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSlips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ borderBottom: 'none', p: 0 }}>
                      <EmptyState
                        icon="📄"
                        title={searchQuery ? 'No salary slips match your search' : 'No salary slips found'}
                        description={searchQuery ? 'Try adjusting your search terms' : 'Your salary history will appear here once generated.'}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSlips.map((slip, index) => (
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

export default SalarySlipsPage;
