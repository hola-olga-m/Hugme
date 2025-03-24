import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import { playHapticFeedback } from '../../utils/haptics';
import { areNotificationsEnabled, requestNotificationPermission } from '../../utils/notifications';

const Notifications = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { receivedHugs, receivedRequests } = useHug();
  const [notifications, setNotifications] = useState([]);
  const [permissionPrompt, setPermissionPrompt] = useState(false);

  // Check if notifications are enabled
  useEffect(() => {
    if (isAuthenticated) {
      const checkNotificationPermission = async () => {
        const enabled = await areNotificationsEnabled();
        if (!enabled) {
          setPermissionPrompt(true);
        }
      };
      
      checkNotificationPermission();
    }
  }, [isAuthenticated]);

  // Process incoming hugs and requests
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Process new hugs
      const unreadHugs = receivedHugs.filter(hug => !hug.read);
      
      // Process new requests
      const pendingRequests = receivedRequests.filter(req => req.status === 'pending');
      
      // Create notifications
      const newNotifications = [
        ...unreadHugs.map(hug => ({
          id: `hug-${hug.id}`,
          type: 'hug',
          title: 'New Hug Received',
          message: `${hug.senderName} sent you a ${hug.hugType} hug`,
          timestamp: new Date(hug.createdAt),
          read: false,
          data: hug
        })),
        ...pendingRequests.map(req => ({
          id: `request-${req.id}`,
          type: 'request',
          title: 'Hug Request',
          message: req.isPublic 
            ? 'Someone in the community needs a hug'
            : `${req.requesterName} is requesting a hug`,
          timestamp: new Date(req.createdAt),
          read: false,
          data: req
        }))
      ];
      
      // Sort by timestamp (newest first)
      newNotifications.sort((a, b) => b.timestamp - a.timestamp);
      
      // Update state
      setNotifications(newNotifications);
      
      // Play haptic for the newest notification
      if (newNotifications.length > 0) {
        playHapticFeedback(newNotifications[0].type === 'hug' ? 'success' : 'notification');
      }
    }
  }, [isAuthenticated, currentUser, receivedHugs, receivedRequests]);

  // Handle requesting permission
  const handleRequestPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        setPermissionPrompt(false);
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update the original item as read
    // This would typically be done through an API call
  };

  // Dismiss all notifications
  const dismissAll = () => {
    setNotifications([]);
  };

  // Render nothing if no notifications or not authenticated
  if (!isAuthenticated || (notifications.length === 0 && !permissionPrompt)) {
    return null;
  }

  return (
    <div className="notifications-container">
      {permissionPrompt && (
        <div className="notification permission-prompt">
          <div className="notification-header">
            <i className="fas fa-bell notification-icon"></i>
            <h3 className="notification-title">Enable Notifications</h3>
            <button className="notification-close" onClick={() => setPermissionPrompt(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="notification-body">
            <p>Allow HugMood to send you notifications for new hugs and requests</p>
            <button className="notification-action" onClick={handleRequestPermission}>
              Enable Notifications
            </button>
          </div>
        </div>
      )}
      
      {notifications.length > 0 && (
        <>
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="dismiss-all" onClick={dismissAll}>
              Clear All
            </button>
          </div>
          
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification ${notification.read ? 'read' : 'unread'} ${notification.type}`}
              >
                <div className="notification-header">
                  <i className={`notification-icon fas fa-${notification.type === 'hug' ? 'heart' : 'hands-helping'}`}></i>
                  <h3 className="notification-title">{notification.title}</h3>
                  <button className="notification-close" onClick={() => markAsRead(notification.id)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="notification-body">
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;