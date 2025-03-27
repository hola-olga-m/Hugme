import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { Icon } from '../ui/IconComponent';
import ReceivedHugsWidget from './ReceivedHugsWidget';
import { GET_USER_STATS, GET_RECEIVED_HUGS } from '../../graphql/queries';

// Styled components
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
`;

const StatValue = styled.div`
  font-size: 2.8rem;
  font-weight: 700;
  margin: 12px 0;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--gray-600);
  position: relative;
  z-index: 1;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => props.bgColor || 'var(--primary-lightest)'};
  color: ${props => props.iconColor || 'var(--primary-color)'};
  position: relative;
  z-index: 1;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  opacity: 0.04;
  z-index: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200
    }
  }
};

/**
 * Enhanced dashboard statistics component with animated cards
 * using PNG icons for visual appeal
 */
const DashboardStats = () => {
  const { data: statsData, loading: statsLoading } = useQuery(GET_USER_STATS);
  const { data: hugsData, loading: hugsLoading } = useQuery(GET_RECEIVED_HUGS);
  
  const stats = statsData?.userStats || {
    moodStreak: 0,
    totalMoodEntries: 0,
    hugsSent: 0,
    hugsReceived: 0
  };
  
  const receivedHugs = hugsData?.receivedHugs || [];
  
  // Define stats cards data
  const statsCards = [
    {
      label: 'Day Streak',
      value: stats.moodStreak,
      icon: 'fire',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      decoration: (
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="100" cy="20" r="80" fill="#FF9800" />
        </svg>
      )
    },
    {
      label: 'Moods Tracked',
      value: stats.totalMoodEntries,
      icon: 'moodTracker',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      decoration: (
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="100" cy="20" r="80" fill="#4CAF50" />
        </svg>
      )
    },
    {
      label: 'Hugs Sent',
      value: stats.hugsSent,
      icon: 'StandardHug',
      color: '#5C6BC0',
      bgColor: '#E8EAF6',
      decoration: (
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="100" cy="20" r="80" fill="#5C6BC0" />
        </svg>
      )
    },
    {
      label: 'Hugs Received',
      value: stats.hugsReceived,
      icon: 'ComfortingHug',
      color: '#9D65C9',
      bgColor: '#F3E5F5',
      decoration: (
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="100" cy="20" r="80" fill="#9D65C9" />
        </svg>
      )
    }
  ];
  
  if (statsLoading || hugsLoading) {
    return <div>Loading dashboard stats...</div>;
  }

  return (
    <div>
      <StatsContainer as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
        {statsCards.map((stat, index) => (
          <StatCard key={index} variants={cardVariants}>
            <IconContainer bgColor={stat.bgColor} iconColor={stat.color}>
              <Icon type={stat.icon} size={28} />
            </IconContainer>
            
            <StatValue style={{ color: stat.color }}>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            
            <BackgroundDecoration>
              {stat.decoration}
            </BackgroundDecoration>
          </StatCard>
        ))}
      </StatsContainer>
      
      <ReceivedHugsWidget hugs={receivedHugs} />
    </div>
  );
};

export default DashboardStats;