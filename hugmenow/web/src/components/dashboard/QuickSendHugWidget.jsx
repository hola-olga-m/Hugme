import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, SEND_HUG } from '../../graphql/queries';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSearch, FiUsers, FiX, FiCheck, FiHeart, FiMail } from 'react-icons/fi';
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
  }
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

const RecipientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  
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

const RecipientOption = styled.div`
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

const UserAvatar = styled.div`
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

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.selected ? '#6c5ce7' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : '#666'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.selected ? '#5b4cc8' : '#e0e0e0'};
  }
`;

const MessageArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 0.9rem;
  resize: none;
  height: 80px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 8px 12px;
  background: none;
  border: none;
  color: ${props => props.active ? '#6c5ce7' : '#888'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? '#6c5ce7' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #6c5ce7;
  }
`;

const ExternalRecipientForm = styled.div`
  margin-bottom: 1rem;
`;

const ExternalRecipientInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const SendButton = styled.button`
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

const LoadingState = styled.div`
  text-align: center;
  padding: 1rem;
  color: #888;
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

const ErrorMessage = styled.div`
  color: #ff3b30;
  font-size: 0.8rem;
  margin-top: 4px;
  margin-bottom: 8px;
`;

// Component
const QuickSendHugWidget = () => {
  const [selectedTab, setSelectedTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHugType, setSelectedHugType] = useState('StandardHug');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [externalRecipient, setExternalRecipient] = useState('');
  const [externalType, setExternalType] = useState('email');
  const [showHugSentToast, setShowHugSentToast] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isExternalValid, setIsExternalValid] = useState(false);
  
  // GraphQL queries and mutations
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { limit: 10, search: searchTerm },
    fetchPolicy: 'network-only',
  });
  
  const [sendHug, { loading: sendingHug }] = useMutation(SEND_HUG);
  
  // Effect to hide toast after 3 seconds
  useEffect(() => {
    if (showHugSentToast) {
      const timer = setTimeout(() => {
        setShowHugSentToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showHugSentToast]);
  
  // Effect to validate external recipient input
  useEffect(() => {
    if (selectedTab === 'external') {
      if (externalType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsExternalValid(emailRegex.test(externalRecipient));
      } else if (externalType === 'telegram') {
        // Just check if it's not empty for Telegram
        setIsExternalValid(externalRecipient.trim().length > 0);
      }
    }
  }, [externalRecipient, externalType, selectedTab]);
  
  // Effect to generate default message based on hug type
  useEffect(() => {
    let defaultMessage = '';
    
    switch (selectedHugType) {
      case 'ComfortingHug':
        defaultMessage = "I'm sending you a comforting hug to help you feel better!";
        break;
      case 'FriendlyHug':
        defaultMessage = "Hey friend! Thought you might appreciate a friendly hug today.";
        break;
      case 'EnthusiasticHug':
        defaultMessage = "Sending you an enthusiastic hug to celebrate with you!";
        break;
      case 'GroupHug':
        defaultMessage = "Group hug! Bringing us all together.";
        break;
      case 'FamilyHug':
        defaultMessage = "A warm family hug to let you know I care about you.";
        break;
      case 'StandardHug':
      default:
        defaultMessage = "Just sending a hug to brighten your day!";
        break;
    }
    
    setMessage(defaultMessage);
  }, [selectedHugType]);
  
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
  
  // Helper function to generate random avatar color
  const getRandomColor = (userId) => {
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff', '#55efc4'];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };
  
  // Handle send hug action
  const handleSendHug = async () => {
    setSendError('');
    
    try {
      // Send hug to internal user
      if (selectedTab === 'friends' && selectedRecipient) {
        const response = await sendHug({
          variables: {
            input: {
              receiverId: selectedRecipient.id,
              type: selectedHugType,
              message: message.trim(),
            }
          }
        });
        
        if (response.data?.sendHug) {
          setShowHugSentToast(true);
          setSelectedRecipient(null);
          resetForm();
        }
      } 
      // Send hug to external recipient
      else if (selectedTab === 'external' && isExternalValid) {
        const response = await sendHug({
          variables: {
            input: {
              externalRecipient: {
                type: externalType,
                contact: externalRecipient.trim(),
              },
              type: selectedHugType,
              message: message.trim(),
            }
          }
        });
        
        if (response.data?.sendHug) {
          setShowHugSentToast(true);
          resetForm();
        }
      }
    } catch (err) {
      console.error('Error sending hug:', err);
      setSendError('Failed to send hug. Please try again.');
    }
  };
  
  const resetForm = () => {
    setMessage(getDefaultMessage(selectedHugType));
    setExternalRecipient('');
  };
  
  const getDefaultMessage = (hugType) => {
    switch (hugType) {
      case 'ComfortingHug':
        return "I'm sending you a comforting hug to help you feel better!";
      case 'FriendlyHug':
        return "Hey friend! Thought you might appreciate a friendly hug today.";
      case 'EnthusiasticHug':
        return "Sending you an enthusiastic hug to celebrate with you!";
      case 'GroupHug':
        return "Group hug! Bringing us all together.";
      case 'FamilyHug':
        return "A warm family hug to let you know I care about you.";
      case 'StandardHug':
      default:
        return "Just sending a hug to brighten your day!";
    }
  };
  
  // Handle searching
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const toggleUserSelection = (user) => {
    if (selectedRecipient && selectedRecipient.id === user.id) {
      setSelectedRecipient(null);
    } else {
      setSelectedRecipient(user);
    }
  };
  
  // Render functions
  const renderUsers = () => {
    if (loading) return <LoadingState>Loading friends...</LoadingState>;
    if (error) return <EmptyState>Error loading friends. Please try again.</EmptyState>;
    if (!data || !data.users || data.users.length === 0) {
      return <EmptyState>No friends found. Add some friends to send hugs!</EmptyState>;
    }
    
    return (
      <RecipientsList>
        {data.users.map(user => (
          <RecipientOption 
            key={user.id}
            selected={selectedRecipient && selectedRecipient.id === user.id}
            onClick={() => toggleUserSelection(user)}
          >
            <UserAvatar bgColor={getRandomColor(user.id)}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                getInitials(user.name || user.username)
              )}
            </UserAvatar>
            <UserInfo>
              <UserName>{user.name || 'Unnamed User'}</UserName>
              <Username>@{user.username}</Username>
            </UserInfo>
            <SelectButton selected={selectedRecipient && selectedRecipient.id === user.id}>
              {selectedRecipient && selectedRecipient.id === user.id ? (
                <FiCheck size={14} />
              ) : null}
            </SelectButton>
          </RecipientOption>
        ))}
      </RecipientsList>
    );
  };
  
  const renderExternalForm = () => {
    return (
      <ExternalRecipientForm>
        <TabsContainer style={{ marginBottom: '8px' }}>
          <Tab 
            active={externalType === 'email'} 
            onClick={() => setExternalType('email')}
          >
            Email
          </Tab>
          <Tab 
            active={externalType === 'telegram'} 
            onClick={() => setExternalType('telegram')}
          >
            Telegram
          </Tab>
        </TabsContainer>
        
        <ExternalRecipientInput
          type={externalType === 'email' ? 'email' : 'text'}
          placeholder={externalType === 'email' ? 'Enter email address' : 'Enter Telegram username'}
          value={externalRecipient}
          onChange={(e) => setExternalRecipient(e.target.value)}
        />
        
        {!isExternalValid && externalRecipient.trim() !== '' && (
          <ErrorMessage>
            {externalType === 'email' 
              ? 'Please enter a valid email address.' 
              : 'Please enter a valid Telegram username.'}
          </ErrorMessage>
        )}
      </ExternalRecipientForm>
    );
  };
  
  const canSendHug = () => {
    if (selectedTab === 'friends') {
      return selectedRecipient !== null && message.trim() !== '';
    } else if (selectedTab === 'external') {
      return isExternalValid && message.trim() !== '';
    }
    return false;
  };
  
  return (
    <WidgetContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <WidgetHeader>
        <Title>
          <FiSend size={16} />
          Quick Send Hug
        </Title>
      </WidgetHeader>
      
      <TabsContainer>
        <Tab 
          active={selectedTab === 'friends'} 
          onClick={() => setSelectedTab('friends')}
        >
          <FiUsers size={14} style={{ marginRight: '4px' }} />
          Friends
        </Tab>
        <Tab 
          active={selectedTab === 'external'} 
          onClick={() => setSelectedTab('external')}
        >
          <FiMail size={14} style={{ marginRight: '4px' }} />
          External
        </Tab>
      </TabsContainer>
      
      {/* Friends Tab */}
      {selectedTab === 'friends' && (
        <>
          <SearchContainer>
            <SearchIcon>
              <FiSearch size={16} />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search friends..." 
              value={searchTerm}
              onChange={handleSearch}
            />
            <ClearButton 
              visible={searchTerm !== ''}
              onClick={handleClearSearch}
            >
              <FiX size={16} />
            </ClearButton>
          </SearchContainer>
          
          {renderUsers()}
        </>
      )}
      
      {/* External Tab */}
      {selectedTab === 'external' && renderExternalForm()}
      
      {/* Hug Type Selector (Common to both tabs) */}
      <HugTypeSelector>
        <HugTypeOption 
          selected={selectedHugType === 'StandardHug'} 
          onClick={() => setSelectedHugType('StandardHug')}
        >
          <div className="icon-wrapper">
            <Icon type="StandardHug" size={36} animate={true} />
          </div>
          <span>Standard</span>
        </HugTypeOption>
        <HugTypeOption 
          selected={selectedHugType === 'FriendlyHug'} 
          onClick={() => setSelectedHugType('FriendlyHug')}
        >
          <div className="icon-wrapper">
            <Icon type="FriendlyHug" size={36} animate={true} />
          </div>
          <span>Friendly</span>
        </HugTypeOption>
        <HugTypeOption 
          selected={selectedHugType === 'ComfortingHug'} 
          onClick={() => setSelectedHugType('ComfortingHug')}
        >
          <div className="icon-wrapper">
            <Icon type="ComfortingHug" size={36} animate={true} />
          </div>
          <span>Comforting</span>
        </HugTypeOption>
        <HugTypeOption 
          selected={selectedHugType === 'EnthusiasticHug'} 
          onClick={() => setSelectedHugType('EnthusiasticHug')}
        >
          <div className="icon-wrapper">
            <Icon type="EnthusiasticHug" size={36} animate={true} />
          </div>
          <span>Enthusiastic</span>
        </HugTypeOption>
        <HugTypeOption 
          selected={selectedHugType === 'FamilyHug'} 
          onClick={() => setSelectedHugType('FamilyHug')}
        >
          <div className="icon-wrapper">
            <Icon type="FamilyHug" size={36} animate={true} />
          </div>
          <span>Family</span>
        </HugTypeOption>
        <HugTypeOption 
          selected={selectedHugType === 'GroupHug'} 
          onClick={() => setSelectedHugType('GroupHug')}
        >
          <div className="icon-wrapper">
            <Icon type="GroupHug" size={36} animate={true} />
          </div>
          <span>Group</span>
        </HugTypeOption>
      </HugTypeSelector>
      
      {/* Message Area (Common to both tabs) */}
      <MessageArea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      {sendError && <ErrorMessage>{sendError}</ErrorMessage>}
      
      {/* Send Button */}
      <SendButton 
        onClick={handleSendHug}
        disabled={!canSendHug() || sendingHug}
      >
        {sendingHug ? 'Sending...' : 'Send Hug'}
        <FiHeart size={16} />
      </SendButton>
      
      {/* Success Toast */}
      <AnimatePresence>
        {showHugSentToast && (
          <HugSentToast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiHeart size={16} />
            Hug sent successfully!
          </HugSentToast>
        )}
      </AnimatePresence>
    </WidgetContainer>
  );
};

export default QuickSendHugWidget;