import React, { createContext, useContext, useCallback, useState } from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  type: AlertProps['severity'];
  timeout?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  showSuccess: (message: string, timeout?: number) => void;
  showError: (message: string, timeout?: number) => void;
  showWarning: (message: string, timeout?: number) => void;
  showInfo: (message: string, timeout?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    ({ message, type, timeout = 6000 }: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).substring(7);
      setNotifications((prev) => [...prev, { id, message, type, timeout }]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, timeout?: number) => {
      showNotification({ message, type: 'success', timeout });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, timeout?: number) => {
      showNotification({ message, type: 'error', timeout });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, timeout?: number) => {
      showNotification({ message, type: 'warning', timeout });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, timeout?: number) => {
      showNotification({ message, type: 'info', timeout });
    },
    [showNotification]
  );

  const handleClose = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.timeout}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

// Usage example:
// const { showSuccess, showError } = useNotification();
// showSuccess('Operation successful!');
// showError('An error occurred');
