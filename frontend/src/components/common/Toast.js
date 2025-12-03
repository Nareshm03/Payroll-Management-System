import React, { useEffect } from 'react';
import { CheckCircle, Error, Info } from '@mui/icons-material';

const Toast = ({ type = 'info', message, onClose, duration }) => {
  const config = {
    success: {
      icon: <CheckCircle style={{ fontSize: '20px' }} />,
      duration: duration || 4000
    },
    error: {
      icon: <Error style={{ fontSize: '20px' }} />,
      duration: duration || 6000
    },
    info: {
      icon: <Info style={{ fontSize: '20px' }} />,
      duration: duration || 3000
    }
  };

  const { icon, duration: displayDuration } = config[type] || config.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, displayDuration);

    return () => clearTimeout(timer);
  }, [displayDuration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {icon}
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default Toast;
