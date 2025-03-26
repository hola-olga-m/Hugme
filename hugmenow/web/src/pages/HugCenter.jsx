import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

// Styled components
const HugCenterContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const HugCenterHeader = styled.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--primary-color);
  }
  
  &::before {
    content: '←';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const HugCenterContent = styled.main`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const HugCenterTitle = styled.h1`
  color: var(--gray-800);
  margin-bottom: 1.5rem;
`;

const HugCenterDescription = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-300);
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--gray-600)'};
  border-bottom: ${props => props.active ? '2px solid var(--primary-color)' : '2px solid transparent'};
  margin-bottom: -1px;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ActionCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 0.5rem;
  }
  
  label {
    font-weight: normal;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const PlaceholderMessage = styled.div`
  background-color: var(--gray-200);
  color: var(--gray-600);
  padding: 2rem;
  text-align: center;
  border-radius: var(--border-radius-md);
`;

const HugsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const HugCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${props => props.received ? 'var(--secondary-color)' : 'var(--primary-color)'};
`;

const HugCardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const HugAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.received ? 'var(--secondary-light)' : 'var(--primary-light)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
`;

const HugUser = styled.div`
  flex: 1;
  
  .name {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .date {
    font-size: 0.8rem;
    color: var(--gray-600);
  }
`;

const HugType = styled.div`
  background-color: ${props => props.received ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: white;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  margin-left: 0.5rem;
`;

const HugMessage = styled.p`
  color: var(--gray-700);
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const HugCenter = () => {
  const [activeTab, setActiveTab] = useState('sendHug');
  const [formData, setFormData] = useState({
    recipientId: '',
    hugType: 'SUPPORTIVE',
    message: '',
    isCommunity: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would submit this data to your API
    console.log('Submitting hug:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setFormData({
        recipientId: '',
        hugType: 'SUPPORTIVE',
        message: '',
        isCommunity: false,
      });
      setIsSubmitting(false);
      
      // Display success message or update UI accordingly
      alert('Hug sent successfully!');
    }, 1000);
  };
  
  const renderSendHugForm = () => (
    <ActionCard>
      <SectionTitle>Send a Virtual Hug</SectionTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="recipientId">Recipient</Label>
          <Select
            id="recipientId"
            name="recipientId"
            value={formData.recipientId}
            onChange={handleChange}
            required
          >
            <option value="">Select a recipient</option>
            <option value="user1">Sarah Johnson</option>
            <option value="user2">Michael Chen</option>
            <option value="user3">Aisha Patel</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="hugType">Hug Type</Label>
          <Select
            id="hugType"
            name="hugType"
            value={formData.hugType}
            onChange={handleChange}
            required
          >
            <option value="QUICK">Quick Hug</option>
            <option value="WARM">Warm Hug</option>
            <option value="SUPPORTIVE">Supportive Hug</option>
            <option value="COMFORTING">Comforting Hug</option>
            <option value="ENCOURAGING">Encouraging Hug</option>
            <option value="CELEBRATORY">Celebratory Hug</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Add a personal message with your hug..."
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Hug'}
        </SubmitButton>
      </form>
    </ActionCard>
  );
  
  const renderRequestHugForm = () => (
    <ActionCard>
      <SectionTitle>Request a Hug</SectionTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="message">Why do you need a hug?</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share why you could use some support right now..."
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Checkbox>
            <input
              type="checkbox"
              id="isCommunity"
              name="isCommunity"
              checked={formData.isCommunity}
              onChange={handleChange}
            />
            <label htmlFor="isCommunity">Make this a community request (anyone can respond)</label>
          </Checkbox>
        </FormGroup>
        
        {!formData.isCommunity && (
          <FormGroup>
            <Label htmlFor="recipientId">Request from specific person</Label>
            <Select
              id="recipientId"
              name="recipientId"
              value={formData.recipientId}
              onChange={handleChange}
              required={!formData.isCommunity}
            >
              <option value="">Select a person</option>
              <option value="user1">Sarah Johnson</option>
              <option value="user2">Michael Chen</option>
              <option value="user3">Aisha Patel</option>
            </Select>
          </FormGroup>
        )}
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Request Hug'}
        </SubmitButton>
      </form>
    </ActionCard>
  );
  
  const renderHugHistory = () => (
    <>
      <SectionTitle>Hugs Received</SectionTitle>
      <HugsList>
        <HugCard received>
          <HugCardHeader>
            <HugAvatar received>MJ</HugAvatar>
            <HugUser>
              <div className="name">Michael Johnson</div>
              <div className="date">March 20, 2025</div>
            </HugUser>
            <HugType received>SUPPORTIVE</HugType>
          </HugCardHeader>
          <HugMessage>
            Hang in there! I know you've been going through a tough time lately, but you're stronger than you think. Here's a hug to remind you that you're not alone.
          </HugMessage>
        </HugCard>
        
        <HugCard received>
          <HugCardHeader>
            <HugAvatar received>AP</HugAvatar>
            <HugUser>
              <div className="name">Aisha Patel</div>
              <div className="date">March 15, 2025</div>
            </HugUser>
            <HugType received>CELEBRATORY</HugType>
          </HugCardHeader>
          <HugMessage>
            Congratulations on your achievement! So proud of you. Virtual hug sent your way! 🎉
          </HugMessage>
        </HugCard>
      </HugsList>
      
      <SectionTitle style={{ marginTop: '2rem' }}>Hugs Sent</SectionTitle>
      <HugsList>
        <HugCard>
          <HugCardHeader>
            <HugAvatar>SJ</HugAvatar>
            <HugUser>
              <div className="name">Sarah Johnson</div>
              <div className="date">March 22, 2025</div>
            </HugUser>
            <HugType>COMFORTING</HugType>
          </HugCardHeader>
          <HugMessage>
            I heard about what happened. I'm here for you, always. This hug comes with my heartfelt support.
          </HugMessage>
        </HugCard>
      </HugsList>
    </>
  );
  
  const renderPendingRequests = () => (
    <PlaceholderMessage>
      <p>There are no pending hug requests at this time.</p>
      <p>When someone requests a hug from you, it will appear here.</p>
    </PlaceholderMessage>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'sendHug':
        return renderSendHugForm();
      case 'requestHug':
        return renderRequestHugForm();
      case 'hugHistory':
        return renderHugHistory();
      case 'pendingRequests':
        return renderPendingRequests();
      default:
        return null;
    }
  };
  
  return (
    <HugCenterContainer>
      <HugCenterHeader>
        <Logo onClick={navigateToDashboard}>HugMeNow</Logo>
        <BackButton onClick={navigateToDashboard}>Back to Dashboard</BackButton>
      </HugCenterHeader>
      
      <HugCenterContent>
        <HugCenterTitle>Hug Center</HugCenterTitle>
        <HugCenterDescription>
          Send and receive virtual hugs to provide emotional support and connection with others.
          Sometimes a simple gesture can make all the difference.
        </HugCenterDescription>
        
        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'sendHug'} 
              onClick={() => handleTabChange('sendHug')}
            >
              Send a Hug
            </TabButton>
            <TabButton 
              active={activeTab === 'requestHug'} 
              onClick={() => handleTabChange('requestHug')}
            >
              Request a Hug
            </TabButton>
            <TabButton 
              active={activeTab === 'hugHistory'} 
              onClick={() => handleTabChange('hugHistory')}
            >
              Hug History
            </TabButton>
            <TabButton 
              active={activeTab === 'pendingRequests'} 
              onClick={() => handleTabChange('pendingRequests')}
            >
              Pending Requests
            </TabButton>
          </TabButtons>
          
          {renderTabContent()}
        </TabContainer>
      </HugCenterContent>
    </HugCenterContainer>
  );
};

export default HugCenter;