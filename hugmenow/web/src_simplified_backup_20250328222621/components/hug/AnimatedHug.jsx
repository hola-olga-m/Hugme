import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(78, 84, 200, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(78, 84, 200, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(78, 84, 200, 0);
  }
`;

const flyAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  
  100% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
`;

const bounceAnimation = keyframes`
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

const wiggleAnimation = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  
  25% {
    transform: rotate(15deg);
  }
  
  75% {
    transform: rotate(-15deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const HugCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  animation: ${pulseAnimation} 2s infinite;
  margin-bottom: 1rem;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

const SendingHugText = styled.div`
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 1rem;
  font-size: 1.1rem;
`;

const FlyingEmoji = styled.div`
  position: absolute;
  font-size: ${props => props.size || '2rem'};
  animation: ${flyAnimation} 1.5s ease-out forwards;
  top: 30%;
  left: ${props => props.left || '50%'};
  opacity: 0;
  animation-delay: ${props => props.delay || '0s'};
`;

const BouncingEmoji = styled.div`
  font-size: 3rem;
  animation: ${bounceAnimation} 2s ease infinite;
`;

const WigglingEmoji = styled.div`
  font-size: 3rem;
  animation: ${wiggleAnimation} 1s ease infinite;
`;

const AnimatedHug = ({ onHugSent, animation = 'pulse', size = 'medium' }) => {
  const [isSending, setIsSending] = useState(false);
  const [flyingEmojis, setFlyingEmojis] = useState([]);
  
  const sizeMap = {
    small: { circle: 60, emoji: '2rem' },
    medium: { circle: 100, emoji: '3rem' },
    large: { circle: 140, emoji: '4rem' }
  };
  
  const getEmoji = () => {
    const emojis = ['🤗', '❤️', '💙', '💜', '💖', '✨', '🌟'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };
  
  const handleHugClick = () => {
    if (isSending) return;
    
    setIsSending(true);
    
    // Create flying emojis
    const newEmojis = [];
    for (let i = 0; i < 5; i++) {
      newEmojis.push({
        id: i,
        emoji: getEmoji(),
        left: `${Math.random() * 80 + 10}%`,
        size: `${Math.random() * 1.5 + 1}rem`,
        delay: `${Math.random() * 0.5}s`
      });
    }
    
    setFlyingEmojis(newEmojis);
    
    // Notify parent component
    if (onHugSent) {
      setTimeout(() => {
        onHugSent();
        setIsSending(false);
        setFlyingEmojis([]);
      }, 2000);
    } else {
      setTimeout(() => {
        setIsSending(false);
        setFlyingEmojis([]);
      }, 2000);
    }
  };
  
  let AnimatedComponent;
  switch (animation) {
    case 'bounce':
      AnimatedComponent = BouncingEmoji;
      break;
    case 'wiggle':
      AnimatedComponent = WigglingEmoji;
      break;
    default:
      AnimatedComponent = HugCircle;
  }
  
  return (
    <Container>
      {animation === 'pulse' ? (
        <HugCircle 
          onClick={handleHugClick}
          style={{ 
            width: sizeMap[size].circle,
            height: sizeMap[size].circle, 
            fontSize: sizeMap[size].emoji
          }}
        >
          🤗
        </HugCircle>
      ) : (
        <AnimatedComponent onClick={handleHugClick}>
          🤗
        </AnimatedComponent>
      )}
      
      {isSending && <SendingHugText>Sending hug...</SendingHugText>}
      
      {flyingEmojis.map(emoji => (
        <FlyingEmoji
          key={emoji.id}
          left={emoji.left}
          size={emoji.size}
          delay={emoji.delay}
        >
          {emoji.emoji}
        </FlyingEmoji>
      ))}
    </Container>
  );
};

export default AnimatedHug;