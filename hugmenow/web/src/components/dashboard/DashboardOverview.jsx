import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_USER_STATS, GET_MOOD_STREAK, GET_RECEIVED_HUGS } from '../../graphql/queries';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: var(--transition-base);
  border-top: 4px solid ${props => props.color || 'var(--primary-color)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StatTitle = styled.h3`
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  font-size: 1rem;
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color || 'var(--primary-color)'};
  background-color: ${props => `${props.color || 'var(--primary-color)'}15` || 'var(--primary-light-transparent)'};
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
`;

const StatDescription = styled.p`
  color: var(--gray-600);
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
`;

const StatFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
`;

const ViewLink = styled(Link)`
  font-size: 0.9rem;
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--gray-500);
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: var(--danger-light);
  color: var(--danger-color);
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
  
  .error-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const DashboardOverview = () => {
  const { data: userStatsData, loading: userStatsLoading, error: userStatsError } = useQuery(GET_USER_STATS);
  const { data: streakData, loading: streakLoading, error: streakError } = useQuery(GET_MOOD_STREAK);
  const { data: hugsData, loading: hugsLoading, error: hugsError } = useQuery(GET_RECEIVED_HUGS);
  
  const isLoading = userStatsLoading || streakLoading || hugsLoading;
  const hasError = userStatsError || streakError || hugsError;
  
  if (isLoading) {
    return (
      <LoadingContainer>
        <div className="loading-indicator">
          Loading your dashboard data...
        </div>
      </LoadingContainer>
    );
  }
  
  if (hasError) {
    return (
      <ErrorContainer>
        <div className="error-title">
          <span>⚠️</span>
          <span>Unable to load dashboard data</span>
        </div>
        <div>Please try refreshing the page or check your connection.</div>
      </ErrorContainer>
    );
  }
  
  // Extract data
  const userStats = userStatsData?.userStats || {
    totalMoodEntries: 0,
    averageMoodScore: 0,
    highestMoodThisMonth: 0,
    lowestMoodThisMonth: 0
  };
  
  const moodStreak = streakData?.moodStreak || 0;
  const receivedHugs = hugsData?.receivedHugs || [];
  const unreadHugs = receivedHugs.filter(hug => !hug.isRead).length;
  
  // Calculate average mood
  const averageMood = Math.round(userStats.averageMoodScore * 10) / 10;
  const hasDataToShow = userStats.totalMoodEntries > 0;
  const moodTrend = hasDataToShow && userStats.averageMoodScore > 3 ? 'positive' : 'negative';
  
  // Get mood emoji
  const getMoodEmoji = (score) => {
    if (score >= 4.5) return '😄';
    if (score >= 3.5) return '😊';
    if (score >= 2.5) return '😐';
    if (score >= 1.5) return '😔';
    return '😢';
  };
  
  return (
    <Container>
      <StatCard color="var(--primary-color)">
        <StatHeader>
          <StatTitle>Mood Streak</StatTitle>
          <StatIcon color="var(--primary-color)">🔥</StatIcon>
        </StatHeader>
        <StatValue>{moodStreak}</StatValue>
        <StatDescription>
          {moodStreak === 0
            ? "Start tracking your mood daily!"
            : moodStreak === 1
            ? "You've tracked your mood today!"
            : `You've tracked your mood ${moodStreak} days in a row!`}
        </StatDescription>
        <StatFooter>
          <StatChange isPositive={true}>
            <span>Keep it up!</span>
          </StatChange>
          <ViewLink to="/mood-tracker">
            <span>Track mood</span>
            <span>→</span>
          </ViewLink>
        </StatFooter>
      </StatCard>
      
      <StatCard color="var(--tertiary-color)">
        <StatHeader>
          <StatTitle>Average Mood</StatTitle>
          <StatIcon color="var(--tertiary-color)">
            {getMoodEmoji(averageMood)}
          </StatIcon>
        </StatHeader>
        <StatValue>
          {hasDataToShow ? averageMood : '-'}
        </StatValue>
        <StatDescription>
          {hasDataToShow
            ? `Based on ${userStats.totalMoodEntries} mood entries`
            : "Start tracking to see your average mood"}
        </StatDescription>
        <StatFooter>
          {hasDataToShow && (
            <StatChange isPositive={moodTrend === 'positive'}>
              <span>
                {moodTrend === 'positive' ? '↑' : '↓'}
              </span>
              <span>
                {moodTrend === 'positive' ? 'Above average' : 'Below average'}
              </span>
            </StatChange>
          )}
          <ViewLink to="/mood-tracker">
            <span>View trends</span>
            <span>→</span>
          </ViewLink>
        </StatFooter>
      </StatCard>
      
      <StatCard color="var(--success-color)">
        <StatHeader>
          <StatTitle>Hug Inbox</StatTitle>
          <StatIcon color="var(--success-color)">🤗</StatIcon>
        </StatHeader>
        <StatValue>{unreadHugs}</StatValue>
        <StatDescription>
          {unreadHugs === 0
            ? "No new hugs in your inbox"
            : unreadHugs === 1
            ? "You have 1 unread hug waiting for you!"
            : `You have ${unreadHugs} unread hugs waiting for you!`}
        </StatDescription>
        <StatFooter>
          <StatChange isPositive={unreadHugs > 0}>
            <span>{receivedHugs.length} total</span>
          </StatChange>
          <ViewLink to="/hug-center">
            <span>View hugs</span>
            <span>→</span>
          </ViewLink>
        </StatFooter>
      </StatCard>
    </Container>
  );
};

export default DashboardOverview;