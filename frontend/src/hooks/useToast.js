import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => showToast('success', message, duration), [showToast]);
  const error = useCallback((message, duration) => showToast('error', message, duration), [showToast]);
  const info = useCallback((message, duration) => showToast('info', message, duration), [showToast]);

  return { toasts, hideToast, success, error, info };
};
