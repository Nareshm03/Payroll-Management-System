import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Dashboard, Receipt, AttachMoney, People, ExitToApp, Menu as MenuIcon, Close, Settings, BarChart, Person, Notifications } from '@mui/icons-material';
import tokens from '../../theme/tokens';
import { iconConfig } from '../../theme/iconConfig';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [location.pathname]);

  const menuSections = [
    {
      title: 'Workspace',
      items: [
        { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['admin', 'employee'] },
        { label: 'Analytics', icon: <BarChart />, path: '/analytics', roles: ['admin'] },
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Salary Slips', icon: <Receipt />, path: '/salary-slips', roles: ['admin', 'employee'] },
        { label: 'Expenses', icon: <AttachMoney />, path: '/expenses', roles: ['admin', 'employee'] },
        { label: 'Employees', icon: <People />, path: '/employees', roles: ['admin'] },
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Profile', icon: <Person />, path: '/profile', roles: ['admin', 'employee'] },
        { label: 'Preferences', icon: <Settings />, path: '/preferences', roles: ['admin', 'employee'] },
        { label: 'Notifications', icon: <Notifications />, path: '/notifications', roles: ['admin', 'employee'] },
      ]
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b" style={{ borderColor: tokens.colors.light.border }}>
        <div className="flex-1">
          <h2 className="text-lg font-bold" style={{ fontFamily: tokens.typography.fontFamily.secondary }}>
            PayrollPulse
          </h2>
          <p className="text-xs truncate" style={{ color: tokens.colors.light.text.secondary }}>{user?.email}</p>
        </div>
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded"
            style={{ transition: tokens.transitions.base }}
            aria-label="Close menu"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Close style={{ fontSize: `${iconConfig.sizes.md}px`, color: tokens.colors.light.text.secondary }} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {menuSections.map((section, idx) => (
          <div key={idx} style={{ marginTop: idx > 0 ? tokens.spacing.md : '0' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: tokens.colors.light.text.secondary }}>
              {section.title}
            </h3>
            <div style={{ marginBottom: '16px' }}>
              {section.items
                .filter(item => item.roles.includes(user?.role))
                .map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center px-3 py-2 rounded sidebar-item-animate"
                    style={{
                      marginBottom: tokens.spacing.xs,
                      backgroundColor: isActive(item.path) ? tokens.colors.brand.blue : 'transparent',
                      color: isActive(item.path) ? '#FFFFFF' : tokens.colors.light.text.primary,
                      fontWeight: isActive(item.path) ? tokens.typography.fontWeight.semibold : tokens.typography.fontWeight.medium,
                      transition: tokens.transitions.base
                    }}
                    onMouseEnter={(e) => !isActive(item.path) && (e.currentTarget.style.backgroundColor = tokens.colors.brand.blueLight)}
                    onMouseLeave={(e) => !isActive(item.path) && (e.currentTarget.style.backgroundColor = 'transparent')}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                    aria-label={item.label}
                  >
                    <span style={{ width: `${iconConfig.sizes.md}px`, height: `${iconConfig.sizes.md}px`, marginRight: `${iconConfig.spacing.text}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                      {React.cloneElement(item.icon, { style: { fontSize: `${iconConfig.sizes.md}px` } })}
                    </span>
                    <span style={{ fontSize: tokens.typography.fontSize.small }}>{item.label}</span>
                  </button>
                ))}
            </div>
            {idx < menuSections.length - 1 && (
              <div className="border-t my-3" style={{ borderColor: tokens.colors.light.border }} />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t" style={{ borderColor: tokens.colors.light.border }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded"
          style={{ color: tokens.colors.semantic.error, transition: tokens.transitions.base }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.semantic.errorBg}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Logout"
        >
          <span style={{ width: `${iconConfig.sizes.md}px`, height: `${iconConfig.sizes.md}px`, marginRight: `${iconConfig.spacing.text}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <ExitToApp style={{ fontSize: `${iconConfig.sizes.md}px` }} />
          </span>
          <span style={{ fontSize: tokens.typography.fontSize.small, fontWeight: tokens.typography.fontWeight.medium }}>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <MenuIcon style={{ fontSize: `${iconConfig.sizes.md}px` }} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen flex flex-col
          transition-transform duration-300 ease-in-out z-50
          ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
        style={{ 
          width: '240px',
          backgroundColor: tokens.colors.light.surface,
          boxShadow: tokens.shadows.sm
        }}
        aria-label="Sidebar navigation"
      >
        <SidebarContent />
      </aside>

      {/* Spacer for desktop */}
      {!isMobile && <div style={{ width: '240px', flexShrink: 0 }} />}
    </>
  );
};

export default Sidebar;
