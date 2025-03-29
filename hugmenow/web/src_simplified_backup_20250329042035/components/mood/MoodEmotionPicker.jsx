import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const wiggle = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin: 1.5rem 0;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
  font-weight: 600;
  text-align: center;
`;

const EmotionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 500px;
`;

const EmotionButton = styled.button`
  border: none;
  background: ${props => props.selected ? 'var(--gray-100)' : 'transparent'};
  border-radius: var(--border-radius-md);
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-base);
  position: relative;
  
  &:hover {
    background: var(--gray-100);
    transform: translateY(-5px);
  }
  
  &:focus {
    outline: 2px solid var(--primary-light);
  }
  
  ${props => props.selected && `
    box-shadow: 0 0 0 2px var(--primary-color);
  `}
  
  .emotion-icon {
    font-size: 2.5rem;
    animation: ${props => {
      if (props.selected) {
        switch (props.intensity) {
          case 10: return bounce;
          case 8: return wiggle;
          case 6: return pulse;
          default: return 'none';
        }
      }
      return 'none';
    }} 2s infinite;
  }
  
  .emotion-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--gray-700);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: ${props => props.selected ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
  }
`;

const MoodNote = styled.textarea`
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  padding: 1rem;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1.5rem;
  transition: var(--transition-base);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-light-transparent);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const VisibilityToggle = styled.div`
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
  border-radius: var(--border-radius-md);
  padding: 0.75rem 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
    transform: none;
  }
  
  .button-icon {
    font-size: 1.2rem;
  }
`;

const moodEmotions = [
  { intensity: 10, emoji: '😄', label: 'Great', description: 'Feeling awesome!' },
  { intensity: 8, emoji: '😊', label: 'Good', description: 'Feeling pretty good' },
  { intensity: 6, emoji: '😐', label: 'Okay', description: 'Feeling neutral' },
  { intensity: 4, emoji: '😔', label: 'Down', description: 'Feeling low' },
  { intensity: 2, emoji: '😢', label: 'Bad', description: 'Feeling terrible' }
];

const MoodEmotionPicker = ({ onSubmit, loading = false }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
  };
  
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  
  const toggleVisibility = () => {
    setIsPublic(!isPublic);
  };
  
  const handleSubmit = () => {
    if (!selectedMood) return;
    
    onSubmit({
      intensity: selectedMood.intensity,
      note: note.trim(),
      isPublic
    });
  };
  
  return (
    <Container>
      <Title>How are you feeling right now?</Title>
      
      <EmotionsContainer>
        {moodEmotions.map((mood) => (
          <EmotionButton
            key={mood.intensity}
            selected={selectedMood?.intensity === mood.intensity}
            onClick={() => handleSelectMood(mood)}
            intensity={mood.intensity}
            title={mood.description}
          >
            <span className="emotion-icon">{mood.emoji}</span>
            <span className="emotion-label">{mood.label}</span>
          </EmotionButton>
        ))}
      </EmotionsContainer>
      
      <MoodNote
        placeholder="Add a note about how you're feeling (optional)"
        value={note}
        onChange={handleNoteChange}
        maxLength={200}
      />
      
      <VisibilityToggle>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={isPublic}
            onChange={toggleVisibility}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">
          <span className="toggle-icon">{isPublic ? '👥' : '🔒'}</span>
          {isPublic ? 'Share with friends' : 'Keep private'}
        </span>
      </VisibilityToggle>
      
      <SubmitButton
        onClick={handleSubmit}
        disabled={!selectedMood || loading}
      >
        <span className="button-icon">📝</span>
        {loading ? 'Saving...' : 'Save Mood'}
      </SubmitButton>
    </Container>
  );
};

export default MoodEmotionPicker;