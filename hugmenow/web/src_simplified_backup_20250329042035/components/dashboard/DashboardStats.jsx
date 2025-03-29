import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Icon } from '../ui/IconComponent';
import { useMeshSdk } from '../../hooks/useMeshSdk';

// Styled components
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0 5px;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--gray-600);
  font-weight: 500;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  opacity: 0.05;
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
  // Use Mesh SDK for data fetching
  const { getMoodStreak, getUserMoods, getSentHugs, getReceivedHugs } = useMeshSdk();
  
  // State for stats data
  const [stats, setStats] = useState({
    moodStreak: 0,
    totalMoodEntries: 0,
    hugsSent: 0,
    hugsReceived: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data using Mesh SDK
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [moodStreak, userMoods, sentHugs, receivedHugs] = await Promise.all([
          getMoodStreak(),
          getUserMoods(),
          getSentHugs(),
          getReceivedHugs()
        ]);
        
        // Update stats
        setStats({
          moodStreak: moodStreak?.currentStreak || 0,
          totalMoodEntries: userMoods?.length || 0,
          hugsSent: sentHugs?.length || 0,
          hugsReceived: receivedHugs?.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [getMoodStreak, getUserMoods, getSentHugs, getReceivedHugs]);
  
  // Define stats cards data with updated styling
  const statsCards = [
    {
      label: 'Day Streak',
      value: stats.moodStreak,
      icon: 'fire',
      color: '#FF9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
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
      bgColor: 'rgba(76, 175, 80, 0.1)',
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
      color: '#6c5ce7',
      bgColor: 'rgba(108, 92, 231, 0.1)',
      decoration: (
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="100" cy="20" r="80" fill="#6c5ce7" />
        </svg>
      )
    },
    {
      label: 'Hugs Received',
      value: stats.hugsReceived,
      icon: 'ComfortingHug',
      color: '#9D65C9',
      bgColor: 'rgba(157, 101, 201, 0.1)',
      decoration: (
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="100" cy="20" r="80" fill="#9D65C9" />
        </svg>
      )
    }
  ];
  
  if (isLoading) {
    return (
      <StatsContainer>
        {[1, 2, 3, 4].map((_, index) => (
          <StatCard key={index} style={{ opacity: 0.5 }}>
            <IconContainer style={{ background: '#f0f0f0' }} />
            <StatValue style={{ background: '#f0f0f0', width: '60px', height: '40px' }}></StatValue>
            <StatLabel style={{ background: '#f0f0f0', width: '80px', height: '20px' }}></StatLabel>
          </StatCard>
        ))}
      </StatsContainer>
    );
  }

  return (
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
  );
};

export default DashboardStats;