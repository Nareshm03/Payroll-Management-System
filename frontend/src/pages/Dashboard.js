import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import { Search, Settings, Brightness4, Brightness7, Notifications, HelpOutline, Person, Tune, Logout as LogoutIcon } from '@mui/icons-material';
import { IconButton, Tooltip, Badge, Menu, MenuItem, Divider, InputBase } from '@mui/material';

const Dashboard = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div style={{ minHeight: '100vh' }}>
        {/* Premium Top Bar */}
        <header className="dashboard-topbar">
          <div className="topbar-content">
            {/* Search Bar */}
            <div className={`topbar-search ${searchFocused ? 'focused' : ''}`}>
              <Search sx={{ fontSize: 18, color: 'var(--text-tertiary)' }} />
              <InputBase
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                sx={{ 
                  ml: 1, 
                  flex: 1, 
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  '& input::placeholder': { color: 'var(--text-tertiary)', opacity: 1 }
                }}
              />
              <kbd className="topbar-kbd">⌘K</kbd>
            </div>

            {/* Right Controls */}
            <div className="topbar-controls">
              <Tooltip title="Help & Documentation">
                <IconButton size="small" className="topbar-icon-btn">
                  <HelpOutline sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notifications">
                <IconButton size="small" className="topbar-icon-btn">
                  <Badge badgeContent={3} color="error" variant="dot">
                    <Notifications sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                <IconButton onClick={() => setDarkMode(!darkMode)} size="small" className="topbar-icon-btn">
                  {darkMode ? <Brightness7 sx={{ fontSize: 20 }} /> : <Brightness4 sx={{ fontSize: 20 }} />}
                </IconButton>
              </Tooltip>

              <div className="topbar-divider" />

              {/* User Menu */}
              <div className="topbar-user" onClick={handleMenuOpen}>
                <div className="topbar-avatar">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="topbar-user-info">
                  <p className="topbar-user-name">{user?.full_name}</p>
                  <span className="topbar-user-badge">{user?.role}</span>
                </div>
              </div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className="modal-animate"
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    borderRadius: '8px',
                    border: '1px solid #ECF0F1',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    overflow: 'visible'
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  onClick={handleMenuClose} 
                  className="btn-transition"
                  sx={{ 
                    fontSize: '14px', 
                    py: 1.5, 
                    px: 2,
                    '&:hover': { backgroundColor: 'rgba(26, 188, 156, 0.08)' }
                  }}
                >
                  <Person sx={{ fontSize: 18, mr: 1.5, color: '#2C3E50' }} /> 
                  Profile Settings
                </MenuItem>
                <MenuItem 
                  onClick={handleMenuClose} 
                  className="btn-transition"
                  sx={{ 
                    fontSize: '14px', 
                    py: 1.5, 
                    px: 2,
                    '&:hover': { backgroundColor: 'rgba(26, 188, 156, 0.08)' }
                  }}
                >
                  <Tune sx={{ fontSize: 18, mr: 1.5, color: '#2C3E50' }} /> 
                  Preferences
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setDarkMode(!darkMode);
                    handleMenuClose();
                  }} 
                  className="btn-transition"
                  sx={{ 
                    fontSize: '14px', 
                    py: 1.5, 
                    px: 2,
                    '&:hover': { backgroundColor: 'rgba(26, 188, 156, 0.08)' }
                  }}
                >
                  {darkMode ? <Brightness7 sx={{ fontSize: 18, mr: 1.5, color: '#2C3E50' }} /> : <Brightness4 sx={{ fontSize: 18, mr: 1.5, color: '#2C3E50' }} />}
                  Theme: {darkMode ? 'Light' : 'Dark'}
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                    handleMenuClose();
                  }} 
                  className="btn-transition"
                  sx={{ 
                    fontSize: '14px', 
                    py: 1.5, 
                    px: 2,
                    color: '#E74C3C',
                    '&:hover': { backgroundColor: 'rgba(231, 76, 60, 0.08)' }
                  }}
                >
                  <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} /> 
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </header>

      {/* Content Area */}
      <main>
        {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
