import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/IconComponent';

// Styled components for the widget
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

const HugCountBadge = styled.span`
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const HugCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  
  h4 {
    margin: 16px 0 8px;
    color: var(--gray-700);
  }
  
  p {
    color: var(--gray-500);
    max-width: 360px;
    margin: 0 auto;
  }
`;

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9]
    }
  })
};

/**
 * The enhanced ReceivedHugsWidget component for the dashboard
 * Using PNG icons for better visual appeal
 */
const ReceivedHugsWidget = ({ hugs = [] }) => {
  const unreadCount = hugs.filter(hug => !hug.isRead).length;
  
  if (hugs.length === 0) {
    return (
      <WidgetContainer>
        <WidgetHeader>
          <Title>
            <Icon type="hugIcon" size={24} />
            Received Hugs
          </Title>
        </WidgetHeader>
        
        <EmptyState>
          <Icon type="ComfortingHug" size={80} animate={true} />
          <h4>No hugs yet</h4>
          <p>When someone sends you a hug, it will appear here. Why not send a hug to a friend first?</p>
        </EmptyState>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer>
      <WidgetHeader>
        <Title>
          <Icon type="hugIcon" size={24} />
          Received Hugs
          {unreadCount > 0 && <HugCountBadge>{unreadCount} new</HugCountBadge>}
        </Title>
      </WidgetHeader>
      
      <HugCardsContainer>
        <AnimatePresence>
          {hugs.map((hug, index) => (
            <HugCard 
              key={hug.id} 
              hug={hug} 
              index={index} 
              isNew={!hug.isRead} 
            />
          ))}
        </AnimatePresence>
      </HugCardsContainer>
    </WidgetContainer>
  );
};

// Styled components for the hug card
const CardContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  ${props => props.isNew && `
    border-left: 3px solid var(--primary-color);
    background-color: var(--primary-lightest);
  `}
`;

const NewLabel = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  z-index: 2;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HugIconContainer = styled.div`
  margin-bottom: 12px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: ${props => props.color || 'var(--primary-color)'};
    border-radius: 2px;
    opacity: 0.5;
  }
`;

const SenderInfo = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-700);
`;

const TimestampText = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-bottom: 12px;
`;

const MessagePreview = styled.div`
  background-color: ${props => `${props.color}10` || 'rgba(0,0,0,0.03)'};
  padding: 10px 12px;
  border-radius: 8px;
  font-style: italic;
  color: var(--gray-600);
  font-size: 0.9rem;
  margin-top: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.04;
  z-index: 0;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * HugCard component - a beautiful card showing a received hug with PNG icon
 */
const HugCard = ({ hug, index, isNew }) => {
  // Map to return specific colors and descriptions based on hug type
  const getHugColor = (type) => {
    const colors = {
      'ComfortingHug': '#9D65C9',
      'EnthusiasticHug': '#FF7043',
      'GroupHug': '#4CAF50',
      'StandardHug': '#FFC107',
      'SupportiveHug': '#5C6BC0',
      'VirtualHug': '#7E57C2',
      'RelaxingHug': '#26A69A',
      'WelcomeHug': '#42A5F5',
      'FriendlyHug': '#66BB6A',
      'GentleHug': '#AB47BC',
      'FamilyHug': '#EF5350',
      'SmilingHug': '#FFA726'
    };
    return colors[type] || '#4A90E2';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const type = hug.type || 'StandardHug';
  const hugColor = getHugColor(type);
  const senderName = hug.sender?.name || hug.sender?.username || 'Anonymous';
  
  return (
    <CardContainer 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      exit="hidden"
      isNew={isNew}
    >
      {isNew && <NewLabel>New</NewLabel>}
      
      <BackgroundDecoration>
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="180" cy="20" r="60" fill={hugColor} />
          <circle cx="20" cy="180" r="40" fill={hugColor} />
        </svg>
      </BackgroundDecoration>
      
      <CardContent>
        <HugIconContainer color={hugColor}>
          <Icon 
            type={type} 
            size={64} 
            animate={true} 
          />
        </HugIconContainer>
        
        <h4 style={{ margin: '12px 0 4px', color: hugColor }}>
          {type.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        
        <SenderInfo>From: {senderName}</SenderInfo>
        <TimestampText>{formatDate(hug.createdAt || new Date())}</TimestampText>
        
        {hug.message && (
          <MessagePreview color={hugColor}>
            "{hug.message}"
          </MessagePreview>
        )}
      </CardContent>
    </CardContainer>
  );
};

export default ReceivedHugsWidget;