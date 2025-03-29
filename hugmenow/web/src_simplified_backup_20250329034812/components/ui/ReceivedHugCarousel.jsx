import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './IconComponent';

const CarouselContainer = styled.div`
  width: 100%;
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const CarouselTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const CarouselContent = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HugSlide = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 160px;
`;

const HugType = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #6366F1;
  margin-top: 5px;
`;

const HugSender = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  
  .sender-name {
    font-size: 0.9rem;
    font-weight: 500;
    margin-left: 8px;
  }
`;

const HugMessage = styled.div`
  font-size: 0.85rem;
  color: #4b5563;
  margin-top: 10px;
  text-align: center;
  font-style: italic;
  max-width: 90%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 10px;
`;

const NavButton = styled(motion.button)`
  border: none;
  background-color: #e0e7ff;
  color: #6366F1;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  
  &:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #6b7280;
  text-align: center;
  
  svg {
    margin-bottom: 10px;
  }
`;

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  })
};

const ReceivedHugCarousel = ({ hugs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Auto rotate through hugs
  useEffect(() => {
    if (hugs.length <= 1) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hugs.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [hugs.length]);
  
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + hugs.length) % hugs.length);
  };
  
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % hugs.length);
  };
  
  if (hugs.length === 0) {
    return (
      <CarouselContainer>
        <CarouselTitle>
          <span role="img" aria-label="inbox">📬</span> Received Hugs
        </CarouselTitle>
        <EmptyState>
          <span role="img" aria-label="empty" style={{ fontSize: '24px' }}>💌</span>
          <p>No hugs received yet.</p>
          <p>Send some hugs to your friends to start exchanging!</p>
        </EmptyState>
      </CarouselContainer>
    );
  }
  
  const currentHug = hugs[currentIndex];
  
  return (
    <CarouselContainer>
      <CarouselTitle>
        <span role="img" aria-label="inbox">📬</span> Received Hugs
      </CarouselTitle>
      <CarouselContent>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <HugSlide
            key={currentHug.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Icon 
              type={currentHug.type || 'StandardHug'} 
              size={64} 
              animate={true} 
            />
            <HugType>{currentHug.type || 'Standard'} Hug</HugType>
            <HugSender>
              <span className="sender-name">From: {currentHug.sender?.name || currentHug.sender?.username || 'Anonymous'}</span>
            </HugSender>
            {currentHug.message && (
              <HugMessage>"{currentHug.message}"</HugMessage>
            )}
          </HugSlide>
        </AnimatePresence>
      </CarouselContent>
      
      {hugs.length > 1 && (
        <NavigationButtons>
          <NavButton 
            onClick={goToPrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </NavButton>
          <NavButton 
            onClick={goToNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            →
          </NavButton>
        </NavigationButtons>
      )}
    </CarouselContainer>
  );
};

export default ReceivedHugCarousel;