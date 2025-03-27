import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@apollo/client';
import { Icon } from '../ui/IconComponent';
import { SEND_HUG, GET_USERS } from '../../graphql/queries';

// Styled components
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HugTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const HugTypeButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.selected ? `${props.color}20` : 'white'};
  border: 2px solid ${props => props.selected ? props.color : '#f0f0f0'};
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
  
  span {
    margin-top: 8px;
    font-size: 0.75rem;
    color: ${props => props.selected ? props.color : 'var(--gray-600)'};
    font-weight: ${props => props.selected ? 600 : 400};
    text-align: center;
  }
`;

const RecipientContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecipientLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-700);
`;

const RecipientSelect = styled.div`
  position: relative;
`;

const RecipientInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-lightest);
  }
`;

const DropdownContainer = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  z-index: 10;
  max-height: 250px;
  overflow-y: auto;
`;

const DropdownItem = styled(motion.div)`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  
  &:hover {
    background: var(--primary-lightest);
  }
  
  .name {
    font-weight: 500;
  }
  
  .username {
    font-size: 0.8rem;
    color: var(--gray-500);
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-700);
`;

const MessageInput = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-lightest);
  }
`;

const CharacterCounter = styled.div`
  align-self: flex-end;
  font-size: 0.8rem;
  color: ${props => props.isOverLimit ? 'var(--error-color)' : 'var(--gray-500)'};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SendButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  
  &:disabled {
    background-color: var(--gray-300);
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  background-color: #e6f7ee;
  color: #00a86b;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  gap: 10px;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: { 
    opacity: 1, 
    y: 0,
    height: 'auto',
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

/**
 * QuickSendHugWidget component - allows users to quickly send hugs from the dashboard
 */
const QuickSendHugWidget = () => {
  // Hug types with their corresponding colors
  const hugTypes = [
    { id: 'StandardHug', name: 'Standard', color: '#FFC107' },
    { id: 'ComfortingHug', name: 'Comforting', color: '#9D65C9' },
    { id: 'SupportiveHug', name: 'Supportive', color: '#5C6BC0' },
    { id: 'EnthusiasticHug', name: 'Enthusiastic', color: '#FF7043' },
    { id: 'FriendlyHug', name: 'Friendly', color: '#66BB6A' },
    { id: 'VirtualHug', name: 'Virtual', color: '#7E57C2' }
  ];
  
  // State variables
  const [selectedHugType, setSelectedHugType] = useState('StandardHug');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Maximum character length for message
  const maxMessageLength = 150;
  
  // Query for users
  const { data: userData } = useQuery(GET_USERS, {
    variables: {
      search: searchQuery,
      limit: 10
    },
    skip: searchQuery.length < 2
  });
  
  // Filtered users based on search
  const filteredUsers = userData?.users || [];
  
  // Send hug mutation
  const [sendHug, { loading: sending }] = useMutation(SEND_HUG);
  
  // Handle selecting a hug type
  const handleSelectHugType = (typeId) => {
    setSelectedHugType(typeId);
  };
  
  // Handle recipient input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setDropdownOpen(e.target.value.length >= 2);
  };
  
  // Handle selecting a recipient
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.name || user.username);
    setDropdownOpen(false);
  };
  
  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value.slice(0, maxMessageLength));
  };
  
  // Handle sending a hug
  const handleSendHug = async () => {
    if (!selectedUser || !selectedHugType) return;
    
    try {
      await sendHug({
        variables: {
          input: {
            recipientId: selectedUser.id,
            type: selectedHugType,
            message: message.trim()
          }
        }
      });
      
      // Reset the form and show success message
      setSelectedUser(null);
      setSearchQuery('');
      setMessage('');
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending hug:', error);
    }
  };
  
  // Check if form is valid
  const isFormValid = selectedUser && selectedHugType;
  
  return (
    <WidgetContainer as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <WidgetHeader>
        <Title>
          <Icon type={selectedHugType} size={28} />
          Quick Send Hug
        </Title>
      </WidgetHeader>
      
      <ContentContainer>
        <AnimatePresence>
          {showSuccess ? (
            <SuccessMessage
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Icon type={selectedHugType} size={24} />
              Hug sent successfully!
            </SuccessMessage>
          ) : (
            <>
              <div>
                <RecipientLabel>Select Hug Type</RecipientLabel>
                <HugTypesGrid>
                  {hugTypes.map((type) => (
                    <HugTypeButton
                      key={type.id}
                      selected={selectedHugType === type.id}
                      color={type.color}
                      onClick={() => handleSelectHugType(type.id)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon type={type.id} size={40} animate={false} />
                      <span>{type.name}</span>
                    </HugTypeButton>
                  ))}
                </HugTypesGrid>
              </div>
              
              <RecipientContainer>
                <RecipientLabel>Recipient</RecipientLabel>
                <RecipientSelect>
                  <RecipientInput
                    type="text"
                    placeholder="Search for a user..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setDropdownOpen(searchQuery.length >= 2)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  />
                  
                  <AnimatePresence>
                    {dropdownOpen && filteredUsers.length > 0 && (
                      <DropdownContainer
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {filteredUsers.map((user) => (
                          <DropdownItem
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            whileHover={{ x: 5 }}
                          >
                            <Icon type="user" size={24} />
                            <div>
                              <div className="name">{user.name || 'Anonymous'}</div>
                              <div className="username">@{user.username}</div>
                            </div>
                          </DropdownItem>
                        ))}
                      </DropdownContainer>
                    )}
                  </AnimatePresence>
                </RecipientSelect>
              </RecipientContainer>
              
              <MessageContainer>
                <MessageLabel>Message (Optional)</MessageLabel>
                <MessageInput
                  placeholder="Write a short message to accompany your hug..."
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={maxMessageLength}
                />
                <CharacterCounter isOverLimit={message.length >= maxMessageLength}>
                  {message.length}/{maxMessageLength}
                </CharacterCounter>
              </MessageContainer>
              
              <ButtonContainer>
                <SendButton
                  disabled={!isFormValid || sending}
                  onClick={handleSendHug}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sending ? 'Sending...' : 'Send Hug'}
                  {!sending && <Icon type="heart" size={18} />}
                </SendButton>
              </ButtonContainer>
            </>
          )}
        </AnimatePresence>
      </ContentContainer>
    </WidgetContainer>
  );
};

export default QuickSendHugWidget;