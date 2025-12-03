import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Email, Lock, Visibility, VisibilityOff, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { CircularProgress, Tooltip } from '@mui/material';
import { showToast } from '../../utils/toast';
import { handleApiError, validateField } from '../../utils/errorHandler';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = (name, value) => {
    const rules = {
      email: { required: true, requiredMessage: 'Email is required', email: true, emailMessage: "That doesn't look like a valid email address" },
      password: { required: true, requiredMessage: 'Password is required', minLength: 6, minLengthMessage: 'Your password should be at least 6 characters' }
    };
    return validateField(name, value, rules[name] || {});
  };

  useEffect(() => {
    if (touched.email && email) {
      const error = validate('email', email);
      setEmailValid(!error);
    }
  }, [email, touched.email]);

  useEffect(() => {
    if (touched.password && password) {
      const error = validate('password', password);
      setPasswordValid(!error);
    }
  }, [password, touched.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    const emailError = validate('email', email);
    const passwordError = validate('password', password);
    
    if (emailError || passwordError) {
      setEmailValid(!emailError);
      setPasswordValid(!passwordError);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (!user || !user.role) {
        setError('Unable to determine user role');
        showToast.error('Unable to determine user role');
        return;
      }
      showToast.success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'That password doesn\'t match our records';
      setError(errorMsg);
      handleApiError(err, 'signing in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Access your payroll dashboard in seconds</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="input-group">
            <label className={`input-label ${emailFocused || email ? 'active' : ''}`}>
              WORK EMAIL *
            </label>
            <div className={`input-wrapper ${touched.email && emailValid === false ? 'error' : ''} ${emailValid ? 'success' : ''}`}>
              <Email className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => {
                  setEmailFocused(false);
                  setTouched(prev => ({ ...prev, email: true }));
                }}
                className="input-field"
                placeholder="you@company.com"
                required
                aria-label="Email address"
                aria-required="true"
              />
              {touched.email && emailValid === false && <ErrorIcon className="validation-icon error-icon" />}
              {emailValid && <CheckCircle className="validation-icon success-icon" />}
            </div>
            {touched.email && emailValid === false && (
              <span className="error-message">That doesn't look like a valid email address</span>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className={`input-label ${passwordFocused || password ? 'active' : ''}`}>
              YOUR PASSWORD *
            </label>
            <div className={`input-wrapper ${touched.password && passwordValid === false ? 'error' : ''} ${passwordValid ? 'success' : ''}`}>
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordFocused(false);
                  setTouched(prev => ({ ...prev, password: true }));
                }}
                className="input-field"
                placeholder="Enter your password"
                required
                aria-label="Password"
                aria-required="true"
              />
              <Tooltip title={showPassword ? 'Hide password' : 'Show password'} arrow placement="top">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`password-toggle ${showPassword ? 'active' : ''}`}
                  tabIndex="-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </Tooltip>
              {touched.password && passwordValid === false && <ErrorIcon className="validation-icon error-icon" />}
              {passwordValid && <CheckCircle className="validation-icon success-icon" />}
            </div>
            {touched.password && passwordValid === false && (
              <span className="error-message">Your password should be at least 6 characters</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-label">Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
            aria-label="Sign in to your account"
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Signing in...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span className="footer-text">Don't have an account?</span>
          <Link to="/signup" className="footer-link">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
