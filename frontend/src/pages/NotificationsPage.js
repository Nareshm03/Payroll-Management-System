import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Notifications as NotificationsIcon, CheckCircle, Warning, Info, Delete } from '@mui/icons-material';
import tokens from '../theme/tokens';

const NotificationsPage = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock notifications - replace with API call
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Salary Slip Generated',
        message: 'Your salary slip for January 2025 has been generated.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Expense Approved',
        message: 'Your expense request for $250.00 has been approved.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Pending Action',
        message: 'Please submit your monthly expense report by end of week.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle style={{ color: tokens.colors.semantic.success }} />;
      case 'warning': return <Warning style={{ color: tokens.colors.semantic.warning }} />;
      default: return <Info style={{ color: tokens.colors.brand.blue }} />;
    }
  };

  const formatTime = (date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-[32px] font-bold leading-[48px]" style={{ color: tokens.colors.light.text.primary }}>
          Notifications
        </h1>
        <p className="text-sm mt-1" style={{ color: tokens.colors.light.text.secondary }}>
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      <div className="max-w-3xl">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-12 text-center">
            <NotificationsIcon style={{ fontSize: 64, color: tokens.colors.light.text.disabled, marginBottom: 16 }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: tokens.colors.light.text.primary }}>
              No notifications
            </h3>
            <p style={{ color: tokens.colors.light.text.secondary }}>
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                style={{ 
                  backgroundColor: notification.read ? 'white' : tokens.colors.brand.blueLight,
                  borderLeftWidth: '4px',
                  borderLeftColor: notification.read ? tokens.colors.light.border : tokens.colors.brand.blue
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm" style={{ color: tokens.colors.light.text.primary }}>
                        {notification.title}
                      </h3>
                      <span className="text-xs whitespace-nowrap" style={{ color: tokens.colors.light.text.secondary }}>
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: tokens.colors.light.text.secondary }}>
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-1 rounded hover:bg-neutral-100 transition-colors"
                    aria-label="Delete notification"
                  >
                    <Delete style={{ fontSize: 18, color: tokens.colors.light.text.secondary }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
