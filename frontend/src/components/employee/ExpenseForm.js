import React, { useState } from 'react';
import { employeeAPI } from '../../services/api';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Typography, Box, Divider, InputAdornment } from '@mui/material';
import { CheckCircle, Link } from '@mui/icons-material';
import { showToast } from '../../utils/toast';
import { handleApiError, validateField } from '../../utils/errorHandler';

const EXPENSE_CATEGORIES = [
  { value: 'Travel', icon: '✈️' },
  { value: 'Food & Meals', icon: '🍽️' },
  { value: 'Office Supplies', icon: '📎' },
  { value: 'Equipment', icon: '💻' },
  { value: 'Training', icon: '📚' },
  { value: 'Communication', icon: '📱' },
  { value: 'Other', icon: '📋' }
];

const ExpenseForm = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    expense_date: '',
    receipt_url: ''
  });

  const validate = (name, value) => {
    const rules = {
      amount: { required: true, requiredMessage: 'Amount is required', minValue: 0, minValueMessage: 'Amount must be greater than 0' },
      category: { required: true, requiredMessage: 'Category is required' },
      expense_date: { required: true, requiredMessage: 'Expense date is required' },
      description: { required: true, requiredMessage: 'Description is required' },
      receipt_url: { url: true, urlMessage: 'Please enter a valid URL' }
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

  const isFormValid = () => {
    return formData.amount && formData.category && formData.expense_date && 
           formData.description && parseFloat(formData.amount) > 0 && 
           !Object.values(errors).some(e => e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'receipt_url' || formData[key]) {
        const error = validate(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    
    setLoading(true);
    try {
      await employeeAPI.createExpense(formData);
      showToast.success('Expense submitted successfully');
      onSuccess();
      handleClose();
    } catch (err) {
      handleApiError(err, 'submitting the expense');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      expense_date: '',
      receipt_url: ''
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '24px' }}>
          Submit Expense Request
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-tertiary)', mt: 0.5 }}>
          Enter your expense details for approval
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--surface-foreground)', borderRadius: '8px' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Expense Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Amount *"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                onBlur={() => handleBlur('amount')}
                error={touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                required
                fullWidth
                inputProps={{ step: "0.01", min: "0", 'aria-label': 'Expense amount', 'aria-required': 'true' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: formData.amount && !errors.amount && <CheckCircle sx={{ color: 'var(--success-base)', fontSize: 20 }} />,
                  sx: { '& input': { textAlign: 'right' } }
                }}
              />
              <TextField
                select
                label="Category *"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                error={touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                required
                fullWidth
                inputProps={{ 'aria-label': 'Expense category', 'aria-required': 'true' }}
                InputProps={{
                  endAdornment: formData.category && !errors.category && <CheckCircle sx={{ color: 'var(--success-base)', fontSize: 20 }} />
                }}
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                    {cat.value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Expense Date *"
                type="date"
                value={formData.expense_date}
                onChange={(e) => handleChange('expense_date', e.target.value)}
                onBlur={() => handleBlur('expense_date')}
                error={touched.expense_date && !!errors.expense_date}
                helperText={touched.expense_date && errors.expense_date}
                required
                fullWidth
                inputProps={{ 'aria-label': 'Expense date', 'aria-required': 'true' }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: formData.expense_date && !errors.expense_date && <CheckCircle sx={{ color: 'var(--success-base)', fontSize: 20 }} />
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Additional Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Description *"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                required
                fullWidth
                multiline
                rows={3}
                placeholder="Describe the expense purpose..."
                inputProps={{ 'aria-label': 'Expense description', 'aria-required': 'true' }}
              />
              <TextField
                label="Receipt URL (Optional)"
                value={formData.receipt_url}
                onChange={(e) => handleChange('receipt_url', e.target.value)}
                onBlur={() => handleBlur('receipt_url')}
                error={touched.receipt_url && !!errors.receipt_url}
                helperText={touched.receipt_url && errors.receipt_url}
                fullWidth
                placeholder="https://..."
                inputProps={{ 'aria-label': 'Receipt URL' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Link sx={{ fontSize: 18 }} /></InputAdornment>
                }}
              />
            </Box>
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
            aria-label="Submit expense request"
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Submitting...
              </>
            ) : (
              'Submit Expense'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseForm;
