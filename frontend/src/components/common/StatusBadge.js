import React from 'react';
import { CheckCircle, Schedule, Cancel } from '@mui/icons-material';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      bg: '#22c55e',
      text: '#ffffff',
      label: 'Approved',
      icon: <CheckCircle sx={{ fontSize: 14 }} />
    },
    pending: {
      bg: '#fbbf24',
      text: '#1e293b',
      label: 'Pending',
      icon: <Schedule sx={{ fontSize: 14 }} />
    },
    rejected: {
      bg: '#ef4444',
      text: '#ffffff',
      label: 'Rejected',
      icon: <Cancel sx={{ fontSize: 14 }} />
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
