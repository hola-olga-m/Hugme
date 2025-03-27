import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RECEIVED_HUGS, MARK_HUG_AS_READ, SEND_HUG } from '../../graphql/queries';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiClock, FiMessageCircle, FiCheck, FiHeart, FiCornerUpRight } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '../ui/IconComponent';

// Styled Components
const WidgetContainer = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #6c5ce7;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`;

const HugsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 92, 231, 0.4);
  }
`;

const HugCard = styled(motion.div)`
  display: flex;
  padding: 16px;
  border-radius: 16px;
  background: ${props => props.isRead ? '#f8f9fa' : 'linear-gradient(to right, rgba(108, 92, 231, 0.05), #f8f9fa)'};
  gap: 16px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  border: 1px solid ${props => props.isRead ? 'transparent' : 'rgba(108, 92, 231, 0.1)'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    background: ${props => props.isRead ? '#f0f0f5' : 'linear-gradient(to right, rgba(108, 92, 231, 0.08), #f0f0f5)'};
  }
  
  ${props => !props.isRead && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #6c5ce7;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px rgba(108, 92, 231, 0.3);
    }
  `}
`;

const HugIconWrapper = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || 'rgba(108, 92, 231, 0.1)'};
  flex-shrink: 0;
  padding: 6px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const SenderAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#6c5ce7'};
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  position: absolute;
  bottom: -5px;
  left: -5px;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 0.7rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HugContent = styled.div`
  flex: 1;
`;

const HugHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const SenderName = styled.span`
  font-weight: 600;
  color: #333;
`;

const HugType = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
  background: ${props => {
    switch (props.type) {
      case 'ComfortingHug': return 'rgba(255, 152, 0, 0.15)';
      case 'GroupHug': return 'rgba(76, 175, 80, 0.15)';
      case 'EnthusiasticHug': return 'rgba(233, 30, 99, 0.15)';
      case 'FriendlyHug': return 'rgba(33, 150, 243, 0.15)';
      case 'FamilyHug': return 'rgba(156, 39, 176, 0.15)';
      case 'StandardHug': 
      default: return 'rgba(108, 92, 231, 0.15)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'ComfortingHug': return '#f57c00';
      case 'GroupHug': return '#388e3c';
      case 'EnthusiasticHug': return '#c2185b';
      case 'FriendlyHug': return '#1976d2';
      case 'FamilyHug': return '#7b1fa2';
      case 'StandardHug':
      default: return '#5c4ccc';
    }
  }};
`;

const HugMessage = styled.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const HugFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 0.8rem;
`;

const TimeStamp = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`;

const ReadButton = styled.button`
  background: none;
  border: none;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`;

const LoadingState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`;

const UnreadCountBadge = styled.span`
  background-color: #ff3b30;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 6px;
`;

const HugSentToast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4cd964;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`;

const ReplyDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ReplyDialogContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
  }
`;

const HugTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 1.25rem;
  padding: 5px;
  max-height: 225px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
`;

const HugTypeOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: ${props => props.selected ? 'rgba(108, 92, 231, 0.1)' : '#f8f9fa'};
  border: 1px solid ${props => props.selected ? '#6c5ce7' : '#eee'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.selected ? '0 2px 8px rgba(108, 92, 231, 0.15)' : 'none'};
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
    border-color: #d0ccfa;
    transform: translateY(-2px);
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  span {
    font-size: 0.85rem;
    font-weight: ${props => props.selected ? '500' : 'normal'};
    color: ${props => props.selected ? '#6c5ce7' : '#444'};
    text-align: center;
  }
`;

const TextField = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  resize: none;
  height: 100px;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: #f8f9fa;
  color: #666;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #eee;
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #5b4cc8;
  }
  
  &:disabled {
    background: #a8a3e1;
    cursor: not-allowed;
  }
`;

// Component
const ReceivedHugsWidget = () => {
  const { loading, error, data, refetch } = useQuery(GET_RECEIVED_HUGS, {
    variables: { limit: 10 },
    fetchPolicy: 'network-only',
  });
  
  const [markAsRead] = useMutation(MARK_HUG_AS_READ);
  const [sendHug, { loading: sendingHug }] = useMutation(SEND_HUG);
  
  const [replyingToHug, setReplyingToHug] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyHugType, setReplyHugType] = useState('StandardHug');
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showHugSentToast, setShowHugSentToast] = useState(false);
  const [hugSentToUser, setHugSentToUser] = useState(null);
  
  // Calculate unread hugs
  const unreadHugs = data?.receivedHugs?.filter(hug => !hug.isRead) || [];
  const hasUnreadHugs = unreadHugs.length > 0;
  
  // Auto dismiss toast
  useEffect(() => {
    if (showHugSentToast) {
      const timer = setTimeout(() => {
        setShowHugSentToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showHugSentToast]);
  
  // Helper functions
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (userId) => {
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff', '#55efc4'];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };
  
  const handleMarkAsRead = async (event, hugId) => {
    event.stopPropagation();
    
    try {
      await markAsRead({
        variables: { id: hugId }
      });
      
      // Refetch to update UI
      refetch();
    } catch (err) {
      console.error('Error marking hug as read:', err);
    }
  };
  
  const openReplyDialog = (event, hug) => {
    event.stopPropagation();
    
    setReplyingToHug(hug);
    setReplyMessage(`Thanks for the ${hug.type.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}!`);
    setReplyHugType('StandardHug');
    setShowReplyDialog(true);
  };
  
  const closeReplyDialog = () => {
    setShowReplyDialog(false);
    setReplyingToHug(null);
    setReplyMessage('');
  };
  
  const handleReplySubmit = async () => {
    if (!replyingToHug || !replyMessage.trim()) return;
    
    try {
      const response = await sendHug({
        variables: {
          input: {
            receiverId: replyingToHug.sender.id,
            type: replyHugType,
            message: replyMessage.trim(),
          }
        }
      });
      
      if (response.data?.sendHug) {
        setHugSentToUser(replyingToHug.sender.name || replyingToHug.sender.username);
        setShowHugSentToast(true);
        closeReplyDialog();
        
        // Refetch after a short delay
        setTimeout(() => {
          refetch();
        }, 1000);
      }
    } catch (err) {
      console.error('Error sending reply hug:', err);
    }
  };
  
  // Get background color based on hug type
  const getHugBackgroundColor = (type) => {
    switch (type) {
      case 'ComfortingHug': return 'rgba(255, 152, 0, 0.1)';
      case 'GroupHug': return 'rgba(76, 175, 80, 0.1)';
      case 'EnthusiasticHug': return 'rgba(233, 30, 99, 0.1)';
      case 'FriendlyHug': return 'rgba(33, 150, 243, 0.1)';
      case 'FamilyHug': return 'rgba(156, 39, 176, 0.1)';
      case 'StandardHug':
      default: return 'rgba(108, 92, 231, 0.1)';
    }
  };

  // Render functions
  const renderHugs = () => {
    if (loading) return <LoadingState>Loading received hugs...</LoadingState>;
    if (error) return <EmptyState>Couldn't load hugs. Please try again.</EmptyState>;
    if (!data || !data.receivedHugs || data.receivedHugs.length === 0) {
      return <EmptyState>No hugs received yet. Send some to get the ball rolling!</EmptyState>;
    }

    return (
      <HugsList>
        {data.receivedHugs.map(hug => (
          <HugCard 
            key={hug.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            isRead={hug.isRead}
          >
            <HugIconWrapper bgColor={getHugBackgroundColor(hug.type)}>
              <Icon type={hug.type} size={48} animate={true} />
              <SenderAvatar bgColor={getRandomColor(hug.sender.id)}>
                {getInitials(hug.sender.name || hug.sender.username)}
              </SenderAvatar>
            </HugIconWrapper>
            <HugContent>
              <HugHeader>
                <SenderName>{hug.sender.name || hug.sender.username}</SenderName>
                <HugType type={hug.type}>
                  {hug.type.replace(/([A-Z])/g, ' $1').trim()}
                </HugType>
              </HugHeader>
              <HugMessage>
                {hug.message || "Sent you a hug!"}
              </HugMessage>
              <HugFooter>
                <TimeStamp>
                  <FiClock size={12} />
                  {formatDistanceToNow(new Date(hug.createdAt), { addSuffix: true })}
                </TimeStamp>
                
                {!hug.isRead && (
                  <ReadButton onClick={(e) => handleMarkAsRead(e, hug.id)}>
                    <FiCheck size={12} />
                    Mark Read
                  </ReadButton>
                )}
                
                <ReplyButton onClick={(e) => openReplyDialog(e, hug)}>
                  <FiCornerUpRight size={12} />
                  Reply
                </ReplyButton>
              </HugFooter>
            </HugContent>
          </HugCard>
        ))}
      </HugsList>
    );
  };

  return (
    <WidgetContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <WidgetHeader>
        <Title>
          <FiHeart size={16} />
          Received Hugs
          {hasUnreadHugs && (
            <UnreadCountBadge>{unreadHugs.length}</UnreadCountBadge>
          )}
        </Title>
        <ViewAllButton>
          View All
        </ViewAllButton>
      </WidgetHeader>
      
      {renderHugs()}
      
      {/* Reply Dialog */}
      <AnimatePresence>
        {showReplyDialog && replyingToHug && (
          <ReplyDialog
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ReplyDialogContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h4>
                <FiCornerUpRight size={18} />
                Reply to {replyingToHug.sender.name || replyingToHug.sender.username}
              </h4>
              
              <HugTypeSelector>
                <HugTypeOption 
                  selected={replyHugType === 'StandardHug'} 
                  onClick={() => setReplyHugType('StandardHug')}
                >
                  <div className="icon-wrapper">
                    <Icon type="StandardHug" size={42} animate={true} />
                  </div>
                  <span>Standard</span>
                </HugTypeOption>
                <HugTypeOption 
                  selected={replyHugType === 'FriendlyHug'} 
                  onClick={() => setReplyHugType('FriendlyHug')}
                >
                  <div className="icon-wrapper">
                    <Icon type="FriendlyHug" size={42} animate={true} />
                  </div>
                  <span>Friendly</span>
                </HugTypeOption>
                <HugTypeOption 
                  selected={replyHugType === 'EnthusiasticHug'} 
                  onClick={() => setReplyHugType('EnthusiasticHug')}
                >
                  <div className="icon-wrapper">
                    <Icon type="EnthusiasticHug" size={42} animate={true} />
                  </div>
                  <span>Enthusiastic</span>
                </HugTypeOption>
                <HugTypeOption 
                  selected={replyHugType === 'ComfortingHug'} 
                  onClick={() => setReplyHugType('ComfortingHug')}
                >
                  <div className="icon-wrapper">
                    <Icon type="ComfortingHug" size={42} animate={true} />
                  </div>
                  <span>Comforting</span>
                </HugTypeOption>
              </HugTypeSelector>
              
              <TextField
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your reply message..."
              />
              
              <DialogActions>
                <CancelButton onClick={closeReplyDialog}>
                  Cancel
                </CancelButton>
                <SendButton 
                  onClick={handleReplySubmit}
                  disabled={!replyMessage.trim() || sendingHug}
                >
                  {sendingHug ? 'Sending...' : 'Send Reply'}
                </SendButton>
              </DialogActions>
            </ReplyDialogContent>
          </ReplyDialog>
        )}
      </AnimatePresence>
      
      {/* Toast notification when hug is sent */}
      <AnimatePresence>
        {showHugSentToast && (
          <HugSentToast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiHeart size={16} />
            Hug sent to {hugSentToUser}!
          </HugSentToast>
        )}
      </AnimatePresence>
    </WidgetContainer>
  );
};

export default ReceivedHugsWidget;