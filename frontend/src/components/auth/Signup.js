import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Email, Lock, Visibility, VisibilityOff, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { showToast } from '../../utils/toast';
import { handleApiError, validateField } from '../../utils/errorHandler';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = (name, value) => {
    const rules = {
      fullName: { required: true, requiredMessage: 'Full name is required', minLength: 2, minLengthMessage: 'Name must be at least 2 characters' },
      email: { required: true, requiredMessage: 'Email is required', email: true, emailMessage: 'Please enter a valid email address' },
      password: { required: true, requiredMessage: 'Password is required', minLength: 6, minLengthMessage: 'Password must be at least 6 characters' }
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
      await signup(formData.email, formData.password, formData.fullName);
      showToast.success('Account created successfully! Welcome to PayrollPulse.');
      navigate('/dashboard');
    } catch (err) {
      handleApiError(err, 'creating your account');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.fullName && formData.email && formData.password && !Object.values(errors).some(e => e);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Create your account</h1>
          <p className="login-subtitle">Join PayrollPulse and streamline your payroll</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label active">FULL NAME *</label>
            <div className={`input-wrapper ${touched.fullName && errors.fullName ? 'error' : ''} ${formData.fullName && !errors.fullName ? 'success' : ''}`}>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className="input-field"
                placeholder="John Doe"
                required
                aria-label="Full name"
                aria-required="true"
              />
              {touched.fullName && errors.fullName && <ErrorIcon className="validation-icon error-icon" />}
              {formData.fullName && !errors.fullName && <CheckCircle className="validation-icon success-icon" />}
            </div>
            {touched.fullName && errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label active">WORK EMAIL *</label>
            <div className={`input-wrapper ${touched.email && errors.email ? 'error' : ''} ${formData.email && !errors.email ? 'success' : ''}`}>
              <Email className="input-icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className="input-field"
                placeholder="you@company.com"
                required
                aria-label="Email address"
                aria-required="true"
              />
              {touched.email && errors.email && <ErrorIcon className="validation-icon error-icon" />}
              {formData.email && !errors.email && <CheckCircle className="validation-icon success-icon" />}
            </div>
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label active">PASSWORD *</label>
            <div className={`input-wrapper ${touched.password && errors.password ? 'error' : ''} ${formData.password && !errors.password ? 'success' : ''}`}>
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className="input-field"
                placeholder="Create a strong password"
                required
                aria-label="Password"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`password-toggle ${showPassword ? 'active' : ''}`}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
              {touched.password && errors.password && <ErrorIcon className="validation-icon error-icon" />}
              {formData.password && !errors.password && <CheckCircle className="validation-icon success-icon" />}
            </div>
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !isFormValid()}
            aria-label="Create account"
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <span className="footer-text">Already have an account?</span>
          <Link to="/login" className="footer-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
