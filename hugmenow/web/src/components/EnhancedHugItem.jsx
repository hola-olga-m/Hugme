import React, { useState } from 'react';
import { HugEmoji, HugTypeLabel, AnimatedHug, HUG_COLORS, HUG_DESCRIPTIONS } from './HugIcons';

const EnhancedHugItem = ({ 
  hug, 
  isSent = false, 
  onMarkAsRead, 
  onSendHug, 
  showActions = true 
}) => {
  const [expanded, setExpanded] = useState(false);
  
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
  const hugColor = HUG_COLORS[hug.type] || '#4A90E2';
  const hugDescription = HUG_DESCRIPTIONS[hug.type] || 'A warm hug';
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  return (
    <div 
      className={`enhanced-hug-item ${!hug.isRead && !isSent ? 'unread' : ''} ${expanded ? 'expanded' : ''}`}
      onClick={() => !hug.isRead && !isSent && onMarkAsRead && onMarkAsRead(hug.id)}
      style={{ 
        borderRadius: '12px', 
        padding: '16px', 
        margin: '16px 0',
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08)`,
        border: `1px solid ${hugColor}30`,
        transition: 'all 0.3s ease',
        cursor: !hug.isRead && !isSent ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background design elements */}
      <div className="hug-item-decoration" 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.04,
          zIndex: -1,
          pointerEvents: 'none'
        }}>
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
          <path d="M0 0C40 20 60 40 80 80C100 120 140 160 200 180V0H0Z" fill={hugColor} />
        </svg>
      </div>
        
      <div className="hug-item-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div className="hug-item-sender" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div className="hug-avatar" style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: `${hugColor}20`,
            color: hugColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: `2px solid ${hugColor}`
          }}>
            {getInitials(personName)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {isSent ? `To: ${personName}` : `From: ${personName}`}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              {formatDate(hug.createdAt)}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <HugTypeLabel type={hug.type} showIcon={false} showEmoji={true} />
          
          {!isSent && !hug.isRead && 
            <span className="hug-status" style={{
              backgroundColor: '#FF5722',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>New</span>
          }
          
          {isSent && 
            <span className="hug-status" style={{
              backgroundColor: hug.isRead ? '#4CAF50' : '#9E9E9E',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>{hug.isRead ? 'Read' : 'Unread'}</span>
          }
        </div>
      </div>
      
      <div className="hug-item-content" style={{
        display: 'flex',
        flexDirection: expanded ? 'column' : 'row',
        gap: '16px',
        alignItems: expanded ? 'center' : 'flex-start',
        padding: expanded ? '16px 0' : '0',
        transition: 'all 0.3s ease'
      }}>
        <div className="hug-item-illustration" style={{
          transition: 'all 0.3s ease',
          transform: expanded ? 'scale(1.2)' : 'scale(1)'
        }}>
          {expanded ? (
            <AnimatedHug type={hug.type} size={expanded ? 'large' : 'medium'} />
          ) : (
            <HugEmoji type={hug.type} size={60} />
          )}
        </div>
        
        <div className="hug-item-details" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {hug.message && (
            <div className="hug-item-message" style={{
              backgroundColor: `${hugColor}10`,
              padding: '12px',
              borderRadius: '12px',
              position: 'relative',
              fontStyle: 'italic',
              marginLeft: expanded ? '0' : '12px',
              maxWidth: expanded ? '100%' : '320px'
            }}>
              <div style={{ position: 'absolute', top: '12px', left: '-8px', transform: 'rotate(45deg)', width: '16px', height: '16px', backgroundColor: `${hugColor}10` }}></div>
              "{hug.message}"
            </div>
          )}
          
          {expanded && (
            <div className="hug-description" style={{
              textAlign: 'center',
              fontWeight: 'medium',
              color: hugColor,
              margin: '8px 0'
            }}>
              {hugDescription}
            </div>
          )}
          
          <div className="hug-item-footer" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px'
          }}>
            <button 
              className="btn-expand"
              onClick={toggleExpand}
              style={{
                background: 'none',
                border: 'none',
                color: hugColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.9rem',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              {expanded ? (
                <>
                  <span style={{ fontSize: '1.2rem' }}>↑</span> 
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.2rem' }}>↓</span> 
                  <span>Expand</span>
                </>
              )}
            </button>
            
            {showActions && (
              <button 
                className="btn-send"
                onClick={(e) => {
                  e.stopPropagation();
                  onSendHug && onSendHug(person.id);
                }}
                style={{
                  backgroundColor: hugColor,
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: `0 2px 8px ${hugColor}50`
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✉</span>
                {isSent ? 'Send Again' : 'Send Back'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHugItem;