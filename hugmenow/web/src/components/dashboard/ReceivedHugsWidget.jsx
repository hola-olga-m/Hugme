import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { Icon } from '../ui/IconComponent';
import { SEND_HUG } from '../../graphql/queries';

// Styled components for the widget
const WidgetContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HugCountBadge = styled.span`
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const HugCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  
  h4 {
    margin: 16px 0 8px;
    color: var(--gray-700);
  }
  
  p {
    color: var(--gray-500);
    max-width: 360px;
    margin: 0 auto;
  }
`;

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9]
    }
  })
};

/**
 * The enhanced ReceivedHugsWidget component for the dashboard
 * Using PNG icons for better visual appeal
 */
const ReceivedHugsWidget = ({ hugs = [] }) => {
  const unreadCount = hugs.filter(hug => !hug.isRead).length;
  
  if (hugs.length === 0) {
    return (
      <WidgetContainer>
        <WidgetHeader>
          <Title>
            <Icon type="hugIcon" size={24} />
            Received Hugs
          </Title>
        </WidgetHeader>
        
        <EmptyState>
          <Icon type="ComfortingHug" size={80} animate={true} />
          <h4>No hugs yet</h4>
          <p>When someone sends you a hug, it will appear here. Why not send a hug to a friend first?</p>
        </EmptyState>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer>
      <WidgetHeader>
        <Title>
          <Icon type="hugIcon" size={24} />
          Received Hugs
          {unreadCount > 0 && <HugCountBadge>{unreadCount} new</HugCountBadge>}
        </Title>
      </WidgetHeader>
      
      <HugCardsContainer>
        <AnimatePresence>
          {hugs.map((hug, index) => (
            <HugCard 
              key={hug.id} 
              hug={hug} 
              index={index} 
              isNew={!hug.isRead} 
            />
          ))}
        </AnimatePresence>
      </HugCardsContainer>
    </WidgetContainer>
  );
};

// Styled components for the hug card
const CardContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  ${props => props.isNew && `
    border-left: 3px solid var(--primary-color);
    background-color: var(--primary-lightest);
  `}
`;

const NewLabel = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  z-index: 2;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HugIconContainer = styled.div`
  margin-bottom: 12px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: ${props => props.color || 'var(--primary-color)'};
    border-radius: 2px;
    opacity: 0.5;
  }
`;

const SenderInfo = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-700);
`;

const TimestampText = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-bottom: 12px;
`;

const MessagePreview = styled.div`
  background-color: ${props => `${props.color}10` || 'rgba(0,0,0,0.03)'};
  padding: 10px 12px;
  border-radius: 8px;
  font-style: italic;
  color: var(--gray-600);
  font-size: 0.9rem;
  margin-top: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 14px;
  background: ${props => props.primary ? 'var(--primary-color)' : props.color || 'white'};
  color: ${props => props.primary ? 'white' : props.color || 'var(--gray-700)'};
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : props.color || '#e0e0e0'};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  margin: 0 4px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 14px;
  gap: 8px;
`;

const ReplyForm = styled(motion.div)`
  margin-top: 16px;
  border-top: 1px dashed ${props => props.color ? `${props.color}40` : '#e0e0e0'};
  padding-top: 16px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  margin-bottom: 8px;
  resize: none;
  height: 80px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ExternalFormContainer = styled(motion.div)`
  margin-top: 12px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const Tab = styled.button`
  padding: 6px 12px;
  background: ${props => props.active ? props.color || 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : props.color || 'var(--gray-600)'};
  border: 1px solid ${props => props.color || '#e0e0e0'};
  border-radius: ${props => props.position === 'left' ? '8px 0 0 8px' : props.position === 'right' ? '0 8px 8px 0' : '0'};
  font-size: 0.8rem;
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background: ${props => props.active ? props.color || 'var(--primary-color)' : `${props.color}10` || '#f5f5f5'};
  }
`;

const SuccessMessage = styled.div`
  padding: 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 8px;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.04;
  z-index: 0;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * HugCard component - a beautiful card showing a received hug with PNG icon
 * Now with reply and external sharing functionality
 */
const HugCard = ({ hug, index, isNew }) => {
  // State variables for the UI
  const [isReplying, setIsReplying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [externalEmail, setExternalEmail] = useState('');
  const [externalTelegram, setExternalTelegram] = useState('');
  const [activeTab, setActiveTab] = useState('email');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Send hug mutation
  const [sendHug, { loading: sending }] = useMutation(SEND_HUG);
  
  // Map to return specific colors and descriptions based on hug type
  const getHugColor = (type) => {
    const colors = {
      'ComfortingHug': '#9D65C9',
      'EnthusiasticHug': '#FF7043',
      'GroupHug': '#4CAF50',
      'StandardHug': '#FFC107',
      'SupportiveHug': '#5C6BC0',
      'VirtualHug': '#7E57C2',
      'RelaxingHug': '#26A69A',
      'WelcomeHug': '#42A5F5',
      'FriendlyHug': '#66BB6A',
      'GentleHug': '#AB47BC',
      'FamilyHug': '#EF5350',
      'SmilingHug': '#FFA726'
    };
    return colors[type] || '#4A90E2';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const type = hug.type || 'StandardHug';
  const hugColor = getHugColor(type);
  const senderName = hug.sender?.name || hug.sender?.username || 'Anonymous';
  
  // Handle opening the reply form
  const handleReplyClick = () => {
    setIsReplying(true);
    setIsSharing(false);
  };
  
  // Handle opening the external share form
  const handleShareClick = () => {
    setIsSharing(true);
    setIsReplying(false);
  };
  
  // Handle sending a reply hug
  const handleSendReply = async () => {
    if (!hug.sender?.id || !replyMessage.trim()) return;
    
    try {
      await sendHug({
        variables: {
          input: {
            recipientId: hug.sender.id,
            type: type, // Use the same type of hug they sent you
            message: replyMessage.trim()
          }
        }
      });
      
      // Show success and reset form
      setSuccessMessage('Reply sent successfully!');
      setShowSuccess(true);
      setReplyMessage('');
      setIsReplying(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending reply hug:', error);
    }
  };
  
  // Handle sending to external contact
  const handleSendExternal = async () => {
    const contactInfo = activeTab === 'email' ? externalEmail : externalTelegram;
    
    if (!contactInfo.trim()) return;
    
    try {
      await sendHug({
        variables: {
          input: {
            externalRecipient: {
              type: activeTab,
              contact: contactInfo.trim()
            },
            type: type,
            message: `I'm sharing this ${type.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} with you!`
          }
        }
      });
      
      // Show success and reset form
      setSuccessMessage(`Hug sent to ${activeTab === 'email' ? 'email' : 'Telegram'} successfully!`);
      setShowSuccess(true);
      setExternalEmail('');
      setExternalTelegram('');
      setIsSharing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending external hug:', error);
    }
  };
  
  // Handle canceling forms
  const handleCancel = () => {
    setIsReplying(false);
    setIsSharing(false);
    setReplyMessage('');
    setExternalEmail('');
    setExternalTelegram('');
  };
  
  return (
    <CardContainer 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      exit="hidden"
      isNew={isNew}
    >
      {isNew && <NewLabel>New</NewLabel>}
      
      <BackgroundDecoration>
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="180" cy="20" r="60" fill={hugColor} />
          <circle cx="20" cy="180" r="40" fill={hugColor} />
        </svg>
      </BackgroundDecoration>
      
      <CardContent>
        <HugIconContainer color={hugColor}>
          <Icon 
            type={type} 
            size={64} 
            animate={true} 
          />
        </HugIconContainer>
        
        <h4 style={{ margin: '12px 0 4px', color: hugColor }}>
          {type.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        
        <SenderInfo>From: {senderName}</SenderInfo>
        <TimestampText>{formatDate(hug.createdAt || new Date())}</TimestampText>
        
        {hug.message && (
          <MessagePreview color={hugColor}>
            "{hug.message}"
          </MessagePreview>
        )}
        
        {/* Action buttons */}
        {!isReplying && !isSharing && !showSuccess && (
          <ActionButtonsContainer>
            <ActionButton 
              color={hugColor}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReplyClick}
            >
              <Icon type="StandardHug" size={16} animate={false} /> Reply
            </ActionButton>
            
            <ActionButton
              color={hugColor}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareClick}
            >
              <Icon type={type} size={16} animate={false} /> Share
            </ActionButton>
          </ActionButtonsContainer>
        )}
        
        {/* Reply form */}
        <AnimatePresence>
          {isReplying && (
            <ReplyForm 
              color={hugColor}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ReplyInput
                placeholder={`Reply to ${senderName} with a message...`}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                autoFocus
              />
              
              <ActionButtonsContainer>
                <ActionButton
                  color="#9e9e9e"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                >
                  Cancel
                </ActionButton>
                
                <ActionButton
                  primary
                  disabled={!replyMessage.trim() || sending}
                  whileHover={{ scale: !sending ? 1.05 : 1 }}
                  whileTap={{ scale: !sending ? 0.95 : 1 }}
                  onClick={handleSendReply}
                >
                  {sending ? 'Sending...' : 'Send Reply'}
                </ActionButton>
              </ActionButtonsContainer>
            </ReplyForm>
          )}
          
          {/* External sharing form */}
          {isSharing && (
            <ExternalFormContainer
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TabContainer>
                <Tab
                  active={activeTab === 'email'}
                  position="left"
                  color={hugColor}
                  onClick={() => setActiveTab('email')}
                >
                  Email
                </Tab>
                <Tab
                  active={activeTab === 'telegram'}
                  position="right"
                  color={hugColor}
                  onClick={() => setActiveTab('telegram')}
                >
                  Telegram
                </Tab>
              </TabContainer>
              
              {activeTab === 'email' ? (
                <InputField
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={externalEmail}
                  onChange={(e) => setExternalEmail(e.target.value)}
                  autoFocus
                />
              ) : (
                <InputField
                  type="text"
                  placeholder="Enter recipient's Telegram username"
                  value={externalTelegram}
                  onChange={(e) => setExternalTelegram(e.target.value)}
                  autoFocus
                />
              )}
              
              <ActionButtonsContainer>
                <ActionButton
                  color="#9e9e9e"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                >
                  Cancel
                </ActionButton>
                
                <ActionButton
                  primary
                  disabled={!(activeTab === 'email' ? externalEmail.trim() : externalTelegram.trim()) || sending}
                  whileHover={{ scale: !sending ? 1.05 : 1 }}
                  whileTap={{ scale: !sending ? 0.95 : 1 }}
                  onClick={handleSendExternal}
                >
                  {sending ? 'Sending...' : `Send to ${activeTab === 'email' ? 'Email' : 'Telegram'}`}
                </ActionButton>
              </ActionButtonsContainer>
            </ExternalFormContainer>
          )}
          
          {/* Success message */}
          {showSuccess && (
            <SuccessMessage>
              {successMessage}
            </SuccessMessage>
          )}
        </AnimatePresence>
      </CardContent>
    </CardContainer>
  );
};

export default ReceivedHugsWidget;