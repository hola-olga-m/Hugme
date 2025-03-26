import React from 'react';
import { HugIcon, HugTypeLabel } from './HugIcons';

const EnhancedHugItem = ({ 
  hug, 
  isSent = false, 
  onMarkAsRead, 
  onSendHug, 
  showActions = true 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const person = isSent ? hug.recipient : hug.sender;
  const personName = person?.name || person?.username || 'Anonymous';
  
  return (
    <div 
      className={`enhanced-hug-item ${!hug.isRead && !isSent ? 'unread' : ''}`}
      onClick={() => !hug.isRead && !isSent && onMarkAsRead && onMarkAsRead(hug.id)}
    >
      <div className="hug-item-icon">
        <HugIcon type={hug.type} size={48} />
      </div>
      
      <div className="hug-item-content">
        <div className="hug-item-header">
          <div className="hug-item-sender">
            <div className="hug-avatar">
              {getInitials(personName)}
            </div>
            {isSent ? `To: ${personName}` : `From: ${personName}`}
          </div>
          
          <HugTypeLabel type={hug.type} showIcon={false} showEmoji={true} />
        </div>
        
        {hug.message && (
          <div className="hug-item-message">
            "{hug.message}"
          </div>
        )}
        
        <div className="hug-item-footer">
          <span className="hug-item-date">{formatDate(hug.createdAt)}</span>
          {!isSent && !hug.isRead && <span className="hug-status">New</span>}
          {isSent && <span className="hug-status">{hug.isRead ? 'Read' : 'Unread'}</span>}
        </div>
      </div>
      
      {showActions && (
        <div className="hug-item-actions">
          <button 
            className="btn btn-sm btn-outline"
            onClick={(e) => {
              e.stopPropagation();
              onSendHug && onSendHug(person.id);
            }}
          >
            {isSent ? 'Send Again' : 'Send Back'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedHugItem;