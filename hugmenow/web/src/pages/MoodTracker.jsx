import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

// Styled components
const MoodTrackerContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const MoodTrackerHeader = styled.header`
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

const MoodTrackerContent = styled.main`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const MoodTrackerTitle = styled.h1`
  color: var(--gray-800);
  margin-bottom: 1.5rem;
`;

const MoodTrackerDescription = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const MoodInputCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`;

const MoodHistoryCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const MoodSlider = styled.div`
  margin-bottom: 2rem;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SliderInput = styled.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(
    to right, 
    var(--danger-color) 0%, 
    var(--warning-color) 50%, 
    var(--success-color) 100%
  );
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
  }
`;

const SliderValue = styled.div`
  margin-left: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
  min-width: 40px;
  color: ${props => {
    const value = props.value;
    if (value <= 3) return 'var(--danger-color)';
    if (value <= 7) return 'var(--warning-color)';
    return 'var(--success-color)';
  }};
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  
  span {
    font-size: 0.8rem;
    color: var(--gray-600);
  }
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

const MoodTracker = () => {
  const [moodScore, setMoodScore] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would submit this data to your API
    console.log('Submitting mood:', { moodScore, moodNote, isPublic });
    
    // Simulate API call
    setTimeout(() => {
      setMoodScore(5);
      setMoodNote('');
      setIsPublic(false);
      setIsSubmitting(false);
      
      // Display success message or update UI accordingly
      alert('Mood submitted successfully!');
    }, 1000);
  };
  
  return (
    <MoodTrackerContainer>
      <MoodTrackerHeader>
        <Logo onClick={navigateToDashboard}>HugMeNow</Logo>
        <BackButton onClick={navigateToDashboard}>Back to Dashboard</BackButton>
      </MoodTrackerHeader>
      
      <MoodTrackerContent>
        <MoodTrackerTitle>Mood Tracker</MoodTrackerTitle>
        <MoodTrackerDescription>
          Track your mood and emotional well-being. Regular tracking helps you understand
          patterns and improve self-awareness.
        </MoodTrackerDescription>
        
        <MoodInputCard>
          <SectionTitle>How are you feeling today?</SectionTitle>
          
          <form onSubmit={handleSubmit}>
            <MoodSlider>
              <SliderContainer>
                <SliderInput
                  type="range"
                  min="1"
                  max="10"
                  value={moodScore}
                  onChange={(e) => setMoodScore(parseInt(e.target.value))}
                />
                <SliderValue value={moodScore}>{moodScore}</SliderValue>
              </SliderContainer>
              
              <SliderLabels>
                <span>Not well</span>
                <span>Neutral</span>
                <span>Excellent</span>
              </SliderLabels>
            </MoodSlider>
            
            <FormGroup>
              <Label htmlFor="moodNote">Add a note (optional)</Label>
              <Textarea
                id="moodNote"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Describe how you're feeling or what's been happening..."
              />
            </FormGroup>
            
            <FormGroup>
              <Checkbox>
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <label htmlFor="isPublic">Share this mood entry with the community</label>
              </Checkbox>
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Record Mood'}
            </SubmitButton>
          </form>
        </MoodInputCard>
        
        <MoodHistoryCard>
          <SectionTitle>Your Mood History</SectionTitle>
          
          <PlaceholderMessage>
            <p>Your mood history will be displayed here once you start tracking.</p>
            <p>In the actual app, this would show a graph of your mood over time.</p>
          </PlaceholderMessage>
        </MoodHistoryCard>
      </MoodTrackerContent>
    </MoodTrackerContainer>
  );
};

export default MoodTracker;