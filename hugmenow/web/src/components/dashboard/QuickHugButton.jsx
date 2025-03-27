import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS, SEND_HUG } from '../../graphql/queries';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiHeart, FiX, FiAlertCircle } from 'react-icons/fi';
import { Icon } from '../ui/IconComponent';

// Styled Components
const QuickHugContainer = styled(motion.div)`
  position: relative;
`;

const QuickHugTrigger = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
`;

const QuickHugPopup = styled(motion.div)`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 320px;
  z-index: 100;
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    border-radius: 2px;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PopupTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  
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

const FriendOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(108, 92, 231, 0.1)' : '#f8f9fa'};
  border: 1px solid ${props => props.selected ? 'rgba(108, 92, 231, 0.3)' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#6c5ce7'};
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Username = styled.div`
  color: #888;
  font-size: 0.8rem;
`;

const HugTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 8px;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    height: 4px;
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
  padding: 12px 8px;
  background: ${props => props.selected ? 'rgba(108, 92, 231, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.selected ? '#6c5ce7' : '#eee'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  flex-shrink: 0;
  box-shadow: ${props => props.selected ? '0 4px 8px rgba(108, 92, 231, 0.15)' : 'none'};
  transform: ${props => props.selected ? 'translateY(-2px)' : 'none'};
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
    box-shadow: 0 4px 8px rgba(108, 92, 231, 0.08);
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
    font-size: 0.75rem;
    font-weight: ${props => props.selected ? '600' : '500'};
    color: ${props => props.selected ? '#6c5ce7' : '#666'};
  }
`;

const SendButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #5b4cc8;
  }
  
  &:disabled {
    background: #a8a3e1;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`;

const HugSentToast = styled(Toast)`
  background-color: #4cd964;
  color: white;
`;

const ErrorToast = styled(Toast)`
  background-color: #e74c3c;
  color: white;
`;

// Quick Hug Button Component
const QuickHugButton = ({ onSent = () => {} }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedHugType, setSelectedHugType] = useState('StandardHug');
  const [showHugSentToast, setShowHugSentToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentToUser, setSentToUser] = useState('');
  
  // Fetch users list (will be filtered to friends in a future update)
  const { loading, error, data } = useQuery(GET_USERS, {
    fetchPolicy: 'network-only',
    skip: !showPopup,
    onError: (error) => {
      console.error("Error fetching users:", error);
    }
  });
  
  // Send hug mutation
  const [sendHug, { loading: sendingHug }] = useMutation(SEND_HUG, {
    onError: (error) => {
      console.error("Error sending hug:", error);
      setErrorMessage(error.message?.split(':')[0] || 'Failed to send hug');
      setShowErrorToast(true);
    }
  });
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && event.target.closest('.quick-hug-popup') === null &&
          event.target.closest('.quick-hug-trigger') === null) {
        setShowPopup(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);
  
  // Hide toasts after 3 seconds
  useEffect(() => {
    if (showHugSentToast) {
      const timer = setTimeout(() => {
        setShowHugSentToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showHugSentToast]);

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);
  
  // Toggle popup visibility
  const togglePopup = () => {
    setShowPopup(prev => !prev);
    
    // Reset selections when opening
    if (!showPopup) {
      setSelectedFriend(null);
      setSelectedHugType('StandardHug');
    }
  };
  
  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };
  
  // Select a friend
  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend === selectedFriend ? null : friend);
  };
  
  // Helper function to get user initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Helper function for avatar color
  const getRandomColor = (userId) => {
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff', '#55efc4'];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };
  
  // Send hug to selected friend
  const handleSendHug = async () => {
    if (!selectedFriend) return;
    
    try {
      const response = await sendHug({
        variables: {
          sendHugInput: {
            recipientId: selectedFriend.id,
            type: selectedHugType,
            message: `Sending you a quick ${selectedHugType.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}!`,
          }
        }
      });
      
      if (response.data?.sendHug) {
        setSentToUser(selectedFriend.name || selectedFriend.username);
        setShowHugSentToast(true);
        closePopup();
        onSent(); // Callback to parent component
      }
    } catch (err) {
      console.error('Error sending hug:', err);
    }
  };
  
  return (
    <QuickHugContainer>
      <QuickHugTrigger 
        className="quick-hug-trigger"
        onClick={togglePopup}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiHeart size={16} />
        Quick Hug
      </QuickHugTrigger>
      
      <AnimatePresence>
        {showPopup && (
          <QuickHugPopup
            className="quick-hug-popup"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PopupHeader>
              <PopupTitle>
                <FiHeart size={16} />
                Send a Quick Hug
              </PopupTitle>
              <CloseButton onClick={closePopup}>
                <FiX size={18} />
              </CloseButton>
            </PopupHeader>
            
            {/* Friends List */}
            {loading ? (
              <LoadingState>Loading friends...</LoadingState>
            ) : error ? (
              <ErrorState>
                Couldn't load friends list. 
                {error.message && <div>Error: {error.message.split(':')[0]}</div>}
              </ErrorState>
            ) : !data || !data.users || data.users.length === 0 ? (
              <EmptyState>No friends found</EmptyState>
            ) : (
              <FriendsList>
                {data.users.map(friend => (
                  <FriendOption
                    key={friend.id}
                    selected={selectedFriend && selectedFriend.id === friend.id}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <Avatar bgColor={getRandomColor(friend.id)}>
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={friend.name} />
                      ) : (
                        getInitials(friend.name || friend.username)
                      )}
                    </Avatar>
                    <UserInfo>
                      <UserName>{friend.name || 'Unnamed User'}</UserName>
                      <Username>@{friend.username}</Username>
                    </UserInfo>
                  </FriendOption>
                ))}
              </FriendsList>
            )}
            
            {/* Hug Type Selector */}
            <HugTypeSelector>
              <HugTypeOption 
                selected={selectedHugType === 'StandardHug'} 
                onClick={() => setSelectedHugType('StandardHug')}
              >
                <div className="icon-wrapper">
                  <Icon type="StandardHug" size={48} animate={true} />
                </div>
                <span>Standard</span>
              </HugTypeOption>
              <HugTypeOption 
                selected={selectedHugType === 'FriendlyHug'} 
                onClick={() => setSelectedHugType('FriendlyHug')}
              >
                <div className="icon-wrapper">
                  <Icon type="FriendlyHug" size={48} animate={true} />
                </div>
                <span>Friendly</span>
              </HugTypeOption>
              <HugTypeOption 
                selected={selectedHugType === 'ComfortingHug'} 
                onClick={() => setSelectedHugType('ComfortingHug')}
              >
                <div className="icon-wrapper">
                  <Icon type="ComfortingHug" size={48} animate={true} />
                </div>
                <span>Comforting</span>
              </HugTypeOption>
            </HugTypeSelector>
            
            {/* Send Button */}
            <SendButton
              onClick={handleSendHug}
              disabled={!selectedFriend || sendingHug}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {sendingHug ? 'Sending...' : 'Send Hug'}
              <FiSend size={16} />
            </SendButton>
          </QuickHugPopup>
        )}
      </AnimatePresence>
      
      {/* Toast notifications */}
      <AnimatePresence>
        {showHugSentToast && (
          <HugSentToast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiHeart size={16} />
            Hug sent to {sentToUser}!
          </HugSentToast>
        )}
        
        {showErrorToast && (
          <ErrorToast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiAlertCircle size={16} />
            {errorMessage}
          </ErrorToast>
        )}
      </AnimatePresence>
    </QuickHugContainer>
  );
};

export default QuickHugButton;