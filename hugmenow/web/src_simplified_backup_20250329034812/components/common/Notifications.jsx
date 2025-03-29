import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animation for notifications
const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
`;

const NotificationsContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  max-width: 90vw;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificationItem = styled.div`
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => {
    switch (props.type) {
      case 'success': return 'var(--success-color, green)';
      case 'error': return 'var(--danger-color, red)';
      case 'warning': return 'var(--warning-color, orange)';
      case 'info': default: return 'var(--info-color, blue)';
    }
  }};
  color: white;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s forwards;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
`;

// Global variable to hold notifications across renders
// Not ideal for production, but works for this example
window.notificationSystem = window.notificationSystem || {
  notifications: [],
  addNotification: null
};

/**
 * Notifications component for displaying toast-style messages
 */
const Notifications = () => {
  const [notifications, setNotifications] = useState(window.notificationSystem.notifications);
  const [exitingIds, setExitingIds] = useState([]);
  
  // Set up the global notification function
  useEffect(() => {
    window.notificationSystem.addNotification = (notification) => {
      const id = Date.now().toString();
      const newNotification = {
        id,
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        duration: notification.duration || 5000, // Default 5 seconds
      };
      
      setNotifications(prev => [...prev, newNotification]);
      window.notificationSystem.notifications = [...window.notificationSystem.notifications, newNotification];
      
      // Auto-remove after duration
      if (newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    };
    
    return () => {
      window.notificationSystem.addNotification = null;
    };
  }, []);
  
  // Helper function to remove a notification with animation
  const removeNotification = (id) => {
    // Mark as exiting to trigger slide-out animation
    setExitingIds(prev => [...prev, id]);
    
    // Remove after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setExitingIds(prev => prev.filter(exitId => exitId !== id));
      window.notificationSystem.notifications = window.notificationSystem.notifications.filter(n => n.id !== id);
    }, 300); // Animation duration
  };
  
  // Exit if no notifications
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <NotificationsContainer>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          type={notification.type}
          isExiting={exitingIds.includes(notification.id)}
        >
          <NotificationContent>
            {notification.title && (
              <NotificationTitle>{notification.title}</NotificationTitle>
            )}
            <NotificationMessage>{notification.message}</NotificationMessage>
          </NotificationContent>
          <CloseButton onClick={() => removeNotification(notification.id)}>×</CloseButton>
        </NotificationItem>
      ))}
    </NotificationsContainer>
  );
};

// Helper functions for showing different types of notifications
export const showNotification = (message, options = {}) => {
  if (window.notificationSystem && window.notificationSystem.addNotification) {
    window.notificationSystem.addNotification({
      message,
      ...options
    });
  }
};

export const showSuccess = (message, title = 'Success') => {
  showNotification(message, { type: 'success', title });
};

export const showError = (message, title = 'Error') => {
  showNotification(message, { type: 'error', title });
};

export const showWarning = (message, title = 'Warning') => {
  showNotification(message, { type: 'warning', title });
};

export const showInfo = (message, title = 'Info') => {
  showNotification(message, { type: 'info', title });
};

export default Notifications;