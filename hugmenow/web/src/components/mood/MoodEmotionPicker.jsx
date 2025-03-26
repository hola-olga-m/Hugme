import React from 'react';
import styled from 'styled-components';

const EmotionPickerContainer = styled.div`
  margin: 1.5rem 0;
`;

const EmotionTitle = styled.h3`
  margin-bottom: 1rem;
  color: var(--gray-700);
  font-weight: 600;
`;

const EmotionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmotionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${props => props.selected ? 'var(--primary-light)' : 'white'};
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--gray-200)'};
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
    border-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--gray-300)'};
  }
  
  .emotion-emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .emotion-name {
    font-size: 0.85rem;
    color: ${props => props.selected ? 'var(--primary-dark)' : 'var(--gray-700)'};
    font-weight: ${props => props.selected ? '600' : '400'};
  }
`;

const emotions = [
  { name: 'Joyful', emoji: '😄', value: 'joy' },
  { name: 'Happy', emoji: '🙂', value: 'happy' },
  { name: 'Grateful', emoji: '🙏', value: 'grateful' },
  { name: 'Calm', emoji: '😌', value: 'calm' },
  { name: 'Content', emoji: '😊', value: 'content' },
  { name: 'Tired', emoji: '😴', value: 'tired' },
  { name: 'Stressed', emoji: '😰', value: 'stressed' },
  { name: 'Sad', emoji: '😢', value: 'sad' },
  { name: 'Anxious', emoji: '😟', value: 'anxious' },
  { name: 'Angry', emoji: '😠', value: 'angry' }
];

const MoodEmotionPicker = ({ selectedEmotion, onChange }) => {
  const handleSelectEmotion = (emotion) => {
    onChange(emotion);
  };
  
  return (
    <EmotionPickerContainer>
      <EmotionTitle>How are you feeling?</EmotionTitle>
      <EmotionsGrid>
        {emotions.map((emotion) => (
          <EmotionButton
            key={emotion.value}
            selected={selectedEmotion === emotion.value}
            onClick={() => handleSelectEmotion(emotion.value)}
            aria-label={`Select mood: ${emotion.name}`}
          >
            <span className="emotion-emoji">{emotion.emoji}</span>
            <span className="emotion-name">{emotion.name}</span>
          </EmotionButton>
        ))}
      </EmotionsGrid>
    </EmotionPickerContainer>
  );
};

export default MoodEmotionPicker;