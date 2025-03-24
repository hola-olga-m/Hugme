import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { playNotificationHaptic } from '../../utils/haptics';
import '../../styles/Notifications.css';

const Notifications = () => {
  const { user, isConnected } = useContext(UserContext); // Assuming isConnected is now in UserContext
  const { hugs, hugRequests, groupHugs } = useContext(HugContext);

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showReconnectBanner, setShowReconnectBanner] = useState(false);

  useEffect(() => {
    // Combine and format all notifications
    const unviewedHugs = hugs.filter(hug => !hug.viewed).map(hug => ({
      id: `hug_${hug.id}`,
      type: 'hug',
      title: 'New Hug',
      message: `${hug.senderName} sent you a ${hug.hugType} hug`,
      timestamp: hug.timestamp,
      entityId: hug.id,
      sender: { id: hug.senderId, name: hug.senderName }
    }));

    const pendingRequests = hugRequests.filter(req => req.status === 'pending').map(req => ({
      id: `req_${req.id}`,
      type: 'request',
      title: 'Hug Request',
      message: `${req.senderName} requested a ${req.urgency} hug`,
      timestamp: req.timestamp,
      entityId: req.id,
      sender: { id: req.senderId, name: req.senderName },
      urgency: req.urgency
    }));

    const activeGroupHugs = groupHugs.filter(gh => 
      gh.status === 'active' && 
      !gh.joinedParticipants.includes(user.id)
    ).map(gh => ({
      id: `group_${gh.id}`,
      type: 'group',
      title: 'Group Hug Invitation',
      message: `${gh.creatorName || 'Someone'} invited you to a group hug`,
      timestamp: gh.timestamp,
      entityId: gh.id,
      sender: { id: gh.creatorId, name: gh.creatorName }
    }));

    // Combine all and sort by timestamp (newest first)
    const combined = [...unviewedHugs, ...pendingRequests, ...activeGroupHugs]
      .sort((a, b) => b.timestamp - a.timestamp);

    setNotifications(combined);

    // Trigger haptic feedback if new notifications arrived
    if (combined.length > 0 && combined[0].timestamp > Date.now() - 10000) {
      playNotificationHaptic(combined[0].type);
    }
  }, [hugs, hugRequests, groupHugs, user.id]);

  useEffect(() => {
    if (!isConnected) {
      setShowReconnectBanner(true);
      // Attempt reconnection here (replace with actual reconnection logic)
      console.log("Attempting to reconnect...");
      // Example: setTimeout(() => { /* Reconnection attempt */ }, 5000); 
    } else {
      const timer = setTimeout(() => {
        setShowReconnectBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);


  // Filter notifications based on selected type
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notif => notif.type === filter);

  // Handle marking a notification as read
  const handleMarkAsRead = (notificationId) => {
    // In a real implementation, this would call API to mark as read
    // For demo, just remove from local state
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    // In a real implementation, this would call API to mark all as read
    setNotifications([]);
  };

  return (
    <div className="notifications-container">
      {showReconnectBanner && (
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? (
            <p><i className="fas fa-wifi"></i> Connection restored!</p>
          ) : (
            <p><i className="fas fa-exclamation-triangle"></i> Connection lost. Reconnecting...</p>
          )}
        </div>
      )}

      <div className="notifications-header">
        <h1>Notifications</h1>
        {notifications.length > 0 && (
          <button 
            className="mark-all-button"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${filter === 'hug' ? 'active' : ''}`}
          onClick={() => setFilter('hug')}
        >
          Hugs
        </button>
        <button 
          className={`filter-button ${filter === 'request' ? 'active' : ''}`}
          onClick={() => setFilter('request')}
        >
          Requests
        </button>
        <button 
          className={`filter-button ${filter === 'group' ? 'active' : ''}`}
          onClick={() => setFilter('group')}
        >
          Group Hugs
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-illustration">
              <i className="far fa-bell-slash"></i>
            </div>
            <p>No notifications at the moment</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.type} ${notification.urgency || ''}`}
            >
              <div className="notification-icon">
                {notification.type === 'hug' && <i className="fas fa-hand-holding-heart"></i>}
                {notification.type === 'request' && <i className="fas fa-question-circle"></i>}
                {notification.type === 'group' && <i className="fas fa-users"></i>}
              </div>

              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="notification-actions">
                {notification.type === 'hug' && (
                  <Link to={`/hug/animation/${notification.entityId}`} className="action-button view">
                    View
                  </Link>
                )}

                {notification.type === 'request' && (
                  <Link to={`/hug/send?to=${notification.sender.id}&request=${notification.entityId}`} className="action-button respond">
                    Respond
                  </Link>
                )}

                {notification.type === 'group' && (
                  <Link to={`/hug/group?id=${notification.entityId}`} className="action-button join">
                    Join
                  </Link>
                )}

                <button 
                  className="action-button dismiss"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;