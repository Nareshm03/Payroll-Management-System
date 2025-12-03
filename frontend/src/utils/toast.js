import { toast } from 'react-toastify';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

const toastConfig = {
  position: 'top-right',
  autoClose: 6000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  closeButton: true,
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...toastConfig,
      icon: <CheckCircle sx={{ color: '#22C55E' }} />,
    });
  },
  
  error: (message) => {
    toast.error(message, {
      ...toastConfig,
      icon: <Error sx={{ color: '#EF4444' }} />,
    });
  },
  
  warning: (message) => {
    toast.warning(message, {
      ...toastConfig,
      icon: <Warning sx={{ color: '#F59E0B' }} />,
    });
  },
  
  info: (message) => {
    toast.info(message, {
      ...toastConfig,
      icon: <Info sx={{ color: '#3B82F6' }} />,
    });
  },
};
