import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMutation } from '@apollo/client';
import { CREATE_HUG_REQUEST } from '../../graphql/mutations';

const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const Container = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-light-transparent);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  resize: vertical;
  min-height: 100px;
  transition: var(--transition-base);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-light-transparent);
  }
`;

const HugTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const HugTypeOption = styled.div`
  flex: 1;
  min-width: 140px;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--gray-200)'};
  border-radius: var(--border-radius-md);
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  transition: var(--transition-base);
  position: relative;
  
  &:hover {
    border-color: var(--primary-light);
    transform: translateY(-3px);
  }
  
  .hug-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    animation: ${floatAnimation} 3s ease-in-out infinite;
  }
  
  .hug-name {
    font-weight: 500;
    color: var(--gray-800);
  }
  
  .hug-description {
    font-size: 0.8rem;
    color: var(--gray-500);
    margin-top: 0.5rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: ${props => props.selected ? 'block' : 'none'};
  }
  
  &::before {
    content: '✓';
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    color: white;
    display: ${props => props.selected ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    z-index: 1;
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--gray-300);
    transition: var(--transition-base);
    border-radius: 30px;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: var(--transition-base);
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: var(--primary-color);
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(30px);
  }
  
  .toggle-label {
    font-size: 0.95rem;
    color: var(--gray-700);
  }
  
  .toggle-icon {
    margin-right: 0.5rem;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
  
  .button-icon {
    font-size: 1.2rem;
  }
`;

const SuccessMessage = styled.div`
  padding: 1.5rem;
  text-align: center;
  
  .success-icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: ${floatAnimation} 2s ease-in-out infinite;
  }
  
  .success-title {
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  .success-message {
    color: var(--gray-700);
    margin-bottom: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  background-color: var(--danger-light);
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .error-icon {
    font-size: 1.2rem;
  }
`;

const hugTypes = [
  {
    id: 'friendly',
    icon: '🤗',
    name: 'Friendly Hug',
    description: 'A warm, friendly hug to brighten someone\'s day'
  },
  {
    id: 'supportive',
    icon: '💪',
    name: 'Supportive Hug',
    description: 'A hug to show your support during challenging times'
  },
  {
    id: 'celebration',
    icon: '🎉',
    name: 'Celebration Hug',
    description: 'Celebrate a success or happy moment together'
  }
];

const HugInvitation = () => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [selectedHugType, setSelectedHugType] = useState('friendly');
  const [isCommunity, setIsCommunity] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [createHugRequest, { loading, error }] = useMutation(CREATE_HUG_REQUEST, {
    onCompleted: () => {
      setSuccess(true);
    }
  });
  
  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleHugTypeSelect = (typeId) => {
    setSelectedHugType(typeId);
  };
  
  const toggleCommunity = () => {
    setIsCommunity(!isCommunity);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const selectedType = hugTypes.find(type => type.id === selectedHugType);
      const hugEmoji = selectedType ? selectedType.icon : '🤗';
      
      await createHugRequest({
        variables: {
          createHugRequestInput: {
            recipientUsername: isCommunity ? null : recipient,
            message: `${hugEmoji} ${message}`,
            isAnonymous: false,
            isCommunity
          }
        }
      });
    } catch (err) {
      console.error('Error creating hug request:', err);
    }
  };
  
  if (success) {
    return (
      <Container>
        <SuccessMessage>
          <div className="success-icon">🤗</div>
          <div className="success-title">Hug Sent!</div>
          <div className="success-message">
            {isCommunity 
              ? 'Your hug request has been shared with the community' 
              : `Your hug invitation has been sent to ${recipient}`}
          </div>
          <SubmitButton onClick={() => {
            setRecipient('');
            setMessage('');
            setSuccess(false);
          }}>
            <span className="button-icon">✨</span>
            Send Another Hug
          </SubmitButton>
        </SuccessMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>
        <span className="title-icon">✉️</span>
        Send a Hug Invitation
      </Title>
      
      {error && (
        <ErrorMessage>
          <span className="error-icon">⚠️</span>
          There was an error sending your hug invitation. Please try again.
        </ErrorMessage>
      )}
      
      <form onSubmit={handleSubmit}>
        <ToggleSwitch>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isCommunity}
              onChange={toggleCommunity}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            <span className="toggle-icon">{isCommunity ? '👥' : '👤'}</span>
            {isCommunity ? 'Share with Community' : 'Send to Specific Person'}
          </span>
        </ToggleSwitch>
        
        {!isCommunity && (
          <FormGroup>
            <Label htmlFor="recipient">Recipient Username</Label>
            <Input 
              id="recipient"
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="Enter username"
              required={!isCommunity}
            />
          </FormGroup>
        )}
        
        <FormGroup>
          <Label>Select Hug Type</Label>
          <HugTypeSelector>
            {hugTypes.map(type => (
              <HugTypeOption 
                key={type.id}
                selected={selectedHugType === type.id}
                onClick={() => handleHugTypeSelect(type.id)}
              >
                <div className="hug-icon">{type.icon}</div>
                <div className="hug-name">{type.name}</div>
                <div className="hug-description">{type.description}</div>
              </HugTypeOption>
            ))}
          </HugTypeSelector>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Add a personal message..."
            required
          />
        </FormGroup>
        
        <SubmitButton 
          type="submit"
          disabled={loading || (!isCommunity && !recipient)}
        >
          <span className="button-icon">🤗</span>
          {loading ? 'Sending...' : 'Send Hug Invitation'}
        </SubmitButton>
      </form>
    </Container>
  );
};

export default HugInvitation;