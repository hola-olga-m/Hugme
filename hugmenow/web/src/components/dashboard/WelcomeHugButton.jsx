import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS, SEND_HUG, SEND_FRIEND_REQUEST } from '../../graphql/queries';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUserPlus, FiX, FiAlertCircle, FiUsers, FiSearch } from 'react-icons/fi';
import { Icon } from '../ui/IconComponent';

// Styled Components
const WelcomeHugContainer = styled(motion.div)`
  position: relative;
`;

const WelcomeHugTrigger = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
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

const WelcomeHugPopup = styled(motion.div)`
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

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0 12px;
  margin-bottom: 16px;
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 12px 8px;
    outline: none;
    font-size: 0.9rem;
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  svg {
    color: #888;
  }
`;

const UsersList = styled.div`
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
    background: rgba(76, 175, 80, 0.2);
    border-radius: 10px;
  }
`;

const UserOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(76, 175, 80, 0.1)' : '#f8f9fa'};
  border: 1px solid ${props => props.selected ? 'rgba(76, 175, 80, 0.3)' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(76, 175, 80, 0.05);
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
  background: ${props => props.bgColor || '#4CAF50'};
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

const MessageInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-size: 0.9rem;
  margin-bottom: 16px;
  font-family: inherit;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
  }
`;

const SendButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: #4CAF50;
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
    background: #388E3C;
  }
  
  &:disabled {
    background: #A5D6A7;
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

const SuccessToast = styled(Toast)`
  background-color: #4CAF50;
  color: white;
`;

const ErrorToast = styled(Toast)`
  background-color: #e74c3c;
  color: white;
`;

// Welcome Hug Button Component
const WelcomeHugButton = ({ onSent = () => {} }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentToUser, setSentToUser] = useState('');

  // Default welcome message
  useEffect(() => {
    if (!welcomeMessage) {
      setWelcomeMessage('Hi there! I\'d like to connect and be friends on HugMeNow! Sending you a warm welcome hug. 🤗');
    }
  }, []);
  
  // Fetch users list (potential friends)
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { search: searchTerm },
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
      setErrorMessage(error.message?.split(':')[0] || 'Failed to send welcome hug');
      setShowErrorToast(true);
    }
  });

  // Send friend request mutation
  const [sendFriendRequest, { loading: sendingFriendRequest }] = useMutation(SEND_FRIEND_REQUEST, {
    onError: (error) => {
      console.error("Error sending friend request:", error);
      setErrorMessage(error.message?.split(':')[0] || 'Failed to send friend request');
      setShowErrorToast(true);
    }
  });
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && event.target.closest('.welcome-hug-popup') === null &&
          event.target.closest('.welcome-hug-trigger') === null) {
        setShowPopup(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);
  
  // Hide toasts after 3 seconds
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

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
      setSelectedUser(null);
      setSearchTerm('');
      if (!welcomeMessage) {
        setWelcomeMessage('Hi there! I\'d like to connect and be friends on HugMeNow! Sending you a warm welcome hug. 🤗');
      }
    }
  };
  
  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Select a user
  const handleSelectUser = (user) => {
    setSelectedUser(user === selectedUser ? null : user);
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
    const colors = ['#4CAF50', '#8BC34A', '#CDDC39', '#009688', '#00BCD4', '#3F51B5'];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };
  
  // Send welcome hug and friend request
  const handleSendWelcomeHug = async () => {
    if (!selectedUser) return;
    
    try {
      // First send the friend request
      const friendResponse = await sendFriendRequest({
        variables: {
          createFriendshipInput: {
            recipientId: selectedUser.id,
            followMood: true, // Default to following their mood
          }
        }
      });
      
      if (friendResponse.data?.sendFriendRequest) {
        // Then send the welcome hug
        const hugResponse = await sendHug({
          variables: {
            hugInput: {
              recipientId: selectedUser.id,
              type: "WelcomeHug",
              message: welcomeMessage || 'Hi there! I\'d like to connect and be friends on HugMeNow! Sending you a warm welcome hug.',
            }
          }
        });
        
        if (hugResponse.data?.sendHug) {
          setSentToUser(selectedUser.name || selectedUser.username);
          setShowSuccessToast(true);
          closePopup();
          onSent(); // Callback to parent component
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage(err.message || 'Something went wrong');
      setShowErrorToast(true);
    }
  };
  
  return (
    <WelcomeHugContainer>
      <WelcomeHugTrigger 
        className="welcome-hug-trigger"
        onClick={togglePopup}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiUserPlus size={16} />
        Welcome Friend
      </WelcomeHugTrigger>
      
      <AnimatePresence>
        {showPopup && (
          <WelcomeHugPopup
            className="welcome-hug-popup"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PopupHeader>
              <PopupTitle>
                <FiUsers size={16} />
                Welcome a New Friend
              </PopupTitle>
              <CloseButton onClick={closePopup}>
                <FiX size={18} />
              </CloseButton>
            </PopupHeader>
            
            <SearchInput>
              <FiSearch size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </SearchInput>
            
            {/* Users List */}
            {loading ? (
              <LoadingState>Loading users...</LoadingState>
            ) : error ? (
              <ErrorState>
                Couldn't load users list. 
                {error.message && <div>Error: {error.message.split(':')[0]}</div>}
              </ErrorState>
            ) : !data || !data.users || data.users.length === 0 ? (
              <EmptyState>No users found</EmptyState>
            ) : (
              <UsersList>
                {data.users.map(user => (
                  <UserOption
                    key={user.id}
                    selected={selectedUser && selectedUser.id === user.id}
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar bgColor={getRandomColor(user.id)}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} />
                      ) : (
                        getInitials(user.name || user.username)
                      )}
                    </Avatar>
                    <UserInfo>
                      <UserName>{user.name || 'Unnamed User'}</UserName>
                      <Username>@{user.username}</Username>
                    </UserInfo>
                  </UserOption>
                ))}
              </UsersList>
            )}
            
            {/* Welcome Message Input */}
            <MessageInput
              placeholder="Add a welcome message (optional)"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
            />
            
            {/* Preview of the welcome hug */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon type="WelcomeHug" size={64} animate={true} />
            </div>
            
            {/* Send Button */}
            <SendButton
              onClick={handleSendWelcomeHug}
              disabled={!selectedUser || sendingHug || sendingFriendRequest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {sendingHug || sendingFriendRequest ? 'Sending...' : 'Send Welcome Hug'}
              <FiSend size={16} />
            </SendButton>
          </WelcomeHugPopup>
        )}
      </AnimatePresence>
      
      {/* Toast notifications */}
      <AnimatePresence>
        {showSuccessToast && (
          <SuccessToast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiUserPlus size={16} />
            Friend request and welcome hug sent to {sentToUser}!
          </SuccessToast>
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
    </WelcomeHugContainer>
  );
};

export default WelcomeHugButton;