import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../../services/api';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Divider, Typography, Box, Skeleton, InputAdornment, Tooltip } from '@mui/material';
import { CheckCircle, Info } from '@mui/icons-material';
import { showToast } from '../../utils/toast';
import { handleApiError, validateField } from '../../utils/errorHandler';

const CreateSalarySlip = ({ open, onClose, onSuccess, editSlip }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    employee_id: '',
    month_year: '',
    basic_salary: '',
    allowances: 0,
    deductions: 0,
    bonuses: 0,
    tax: 0,
    notes: ''
  });

  useEffect(() => {
    if (open) {
      loadEmployees();
      if (editSlip) {
        setFormData({
          employee_id: editSlip.employee_id,
          month_year: editSlip.month_year,
          basic_salary: editSlip.basic_salary,
          allowances: editSlip.allowances,
          deductions: editSlip.deductions,
          bonuses: editSlip.bonuses,
          tax: editSlip.tax,
          notes: editSlip.notes || ''
        });
      }
    }
  }, [open, editSlip]);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await authAPI.getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      handleApiError(err, 'loading employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const validate = (name, value) => {
    const rules = {
      employee_id: { required: true, requiredMessage: 'Employee is required' },
      month_year: { required: true, requiredMessage: 'Month-Year is required' },
      basic_salary: { required: true, requiredMessage: 'Basic salary is required', minValue: 0, minValueMessage: 'Amount must be greater than 0' },
      allowances: { min: 0, minMessage: 'Amount cannot be negative' },
      deductions: { min: 0, minMessage: 'Amount cannot be negative' },
      bonuses: { min: 0, minMessage: 'Amount cannot be negative' },
      tax: { min: 0, minMessage: 'Amount cannot be negative' }
    };
    return validateField(name, value, rules[name] || {});
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isFormValid = () => {
    return formData.employee_id && formData.month_year && formData.basic_salary && 
           parseFloat(formData.basic_salary) > 0 && !Object.values(errors).some(e => e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    
    setLoading(true);
    try {
      if (editSlip) {
        await adminAPI.updateSalarySlip(editSlip.id, formData);
        showToast.success('Salary slip updated successfully');
      } else {
        await adminAPI.createSalarySlip(formData);
        showToast.success('Salary slip created successfully');
      }
      onSuccess();
      handleClose();
    } catch (err) {
      handleApiError(err, editSlip ? 'updating the salary slip' : 'creating the salary slip');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employee_id: '',
      month_year: '',
      basic_salary: '',
      allowances: 0,
      deductions: 0,
      bonuses: 0,
      tax: 0,
      notes: ''
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  const netSalary = parseFloat(formData.basic_salary || 0) + 
                    parseFloat(formData.allowances || 0) + 
                    parseFloat(formData.bonuses || 0) - 
                    parseFloat(formData.deductions || 0) - 
                    parseFloat(formData.tax || 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '24px' }}>
          {editSlip ? 'Edit Salary Slip' : 'Create Salary Slip'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-tertiary)', mt: 0.5 }}>
          {editSlip ? 'Update employee compensation details' : 'Enter employee compensation details'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {/* Employee Selection Section */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--surface-foreground)', borderRadius: '8px' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Employee Selection
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {loadingEmployees ? (
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '8px' }} />
              ) : (
                <TextField
                  select
                  label="Employee *"
                  value={formData.employee_id}
                  onChange={(e) => handleChange('employee_id', e.target.value)}
                  onBlur={() => handleBlur('employee_id')}
                  error={touched.employee_id && !!errors.employee_id}
                  helperText={touched.employee_id && errors.employee_id}
                  required
                  fullWidth
                  disabled={!!editSlip}
                  inputProps={{ 'aria-label': 'Employee selection', 'aria-required': 'true' }}
                  InputProps={{
                    endAdornment: formData.employee_id && !errors.employee_id && <CheckCircle sx={{ color: 'var(--success-base)', fontSize: 20 }} />
                  }}
                >
                  {employees.length === 0 ? (
                    <MenuItem disabled>No employees found</MenuItem>
                  ) : (
                    employees.map(emp => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.full_name || emp.email}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              )}
              <TextField
                label="Month-Year *"
                type="month"
                value={formData.month_year}
                onChange={(e) => handleChange('month_year', e.target.value)}
                onBlur={() => handleBlur('month_year')}
                error={touched.month_year && !!errors.month_year}
                helperText={touched.month_year && errors.month_year}
                required
                fullWidth
                inputProps={{ 'aria-label': 'Month and year', 'aria-required': 'true' }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: formData.month_year && !errors.month_year && <CheckCircle sx={{ color: 'var(--success-base)', fontSize: 20 }} />
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Salary Breakdown Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Salary Breakdown
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Basic Salary *"
                type="number"
                value={formData.basic_salary}
                onChange={(e) => handleChange('basic_salary', e.target.value)}
                onBlur={() => handleBlur('basic_salary')}
                error={touched.basic_salary && !!errors.basic_salary}
                helperText={touched.basic_salary && errors.basic_salary}
                required
                fullWidth
                inputProps={{ step: '0.01', min: '0', 'aria-label': 'Basic salary amount', 'aria-required': 'true' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: formData.basic_salary && !errors.basic_salary && <CheckCircle sx={{ color: 'var(--success-base)', fontSize: 20 }} />,
                  sx: { '& input': { textAlign: 'right' } }
                }}
              />
              <TextField
                label="Allowances"
                type="number"
                value={formData.allowances}
                onChange={(e) => handleChange('allowances', e.target.value)}
                onBlur={() => handleBlur('allowances')}
                error={touched.allowances && !!errors.allowances}
                helperText={touched.allowances && errors.allowances}
                fullWidth
                inputProps={{ step: '0.01', min: '0', 'aria-label': 'Allowances amount' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: { '& input': { textAlign: 'right' } }
                }}
              />
              <TextField
                label="Bonuses"
                type="number"
                value={formData.bonuses}
                onChange={(e) => handleChange('bonuses', e.target.value)}
                onBlur={() => handleBlur('bonuses')}
                error={touched.bonuses && !!errors.bonuses}
                helperText={touched.bonuses && errors.bonuses}
                fullWidth
                inputProps={{ step: '0.01', min: '0', 'aria-label': 'Bonuses amount' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: { '& input': { textAlign: 'right' } }
                }}
              />
              <TextField
                label="Deductions"
                type="number"
                value={formData.deductions}
                onChange={(e) => handleChange('deductions', e.target.value)}
                onBlur={() => handleBlur('deductions')}
                error={touched.deductions && !!errors.deductions}
                helperText={touched.deductions && errors.deductions}
                fullWidth
                inputProps={{ step: '0.01', min: '0', 'aria-label': 'Deductions amount' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: { '& input': { textAlign: 'right' } }
                }}
              />
              <TextField
                label="Tax"
                type="number"
                value={formData.tax}
                onChange={(e) => handleChange('tax', e.target.value)}
                onBlur={() => handleBlur('tax')}
                error={touched.tax && !!errors.tax}
                helperText={touched.tax && errors.tax}
                fullWidth
                inputProps={{ step: '0.01', min: '0', 'aria-label': 'Tax amount' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: (
                    <Tooltip title="Tax amount deducted from gross salary" arrow>
                      <Info sx={{ color: 'var(--text-tertiary)', fontSize: 18, cursor: 'help' }} />
                    </Tooltip>
                  ),
                  sx: { '& input': { textAlign: 'right' } }
                }}
              />
              <Box sx={{ p: 2, bgcolor: 'var(--success-bg)', borderRadius: '8px', border: '1px solid var(--success-base)' }}>
                <Typography variant="caption" sx={{ color: 'var(--success-text)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>
                  Net Salary
                </Typography>
                <Typography variant="h5" sx={{ color: 'var(--success-text)', fontWeight: 700, mt: 0.5 }}>
                  ${formatCurrency(netSalary)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Additional Information Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Additional Information
            </Typography>
            <TextField
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any additional notes or comments..."
              inputProps={{ 'aria-label': 'Additional notes' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'var(--surface-foreground)' }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}
            aria-label="Cancel and close dialog"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !isFormValid()}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              bgcolor: 'var(--primary-base)',
              '&:hover': { bgcolor: 'var(--primary-hover)' },
              '&:disabled': { bgcolor: 'var(--primary-disabled)' }
            }}
            aria-label={editSlip ? 'Update salary slip' : 'Create salary slip'}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                {editSlip ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editSlip ? 'Update Salary Slip' : 'Create Salary Slip'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSalarySlip;
