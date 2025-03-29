import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const WelcomeCard = styled.div`
  background-color: var(--card-bg-color, white);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h1`
  font-size: 1.5rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`;

const WelcomeMessage = styled.p`
  color: var(--text-secondary-color, #6b7280);
  margin-bottom: 1.5rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background-color: var(--card-bg-color, white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color, #6366f1);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--text-secondary-color, #6b7280);
  font-size: 0.875rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const FeatureCard = styled.div`
  background-color: var(--card-bg-color, white);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.75rem;
`;

const CardContent = styled.div`
  color: var(--text-secondary-color, #6b7280);
`;

/**
 * Dashboard Component
 * Main dashboard page displaying user statistics and shortcuts to main features
 */
const Dashboard = () => {
  // Placeholder data - would come from API in real implementation
  const userFirstName = "User";
  const moodStreak = 5;
  const hugsSent = 12;
  const hugsReceived = 8;
  
  return (
    <DashboardContainer>
      <WelcomeCard>
        <WelcomeTitle>Welcome back, {userFirstName}!</WelcomeTitle>
        <WelcomeMessage>
          Here's an overview of your mood tracking and hug activity.
        </WelcomeMessage>
        
        <StatsContainer>
          <StatCard>
            <StatValue>{moodStreak}</StatValue>
            <StatLabel>Day Streak</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{hugsSent}</StatValue>
            <StatLabel>Hugs Sent</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{hugsReceived}</StatValue>
            <StatLabel>Hugs Received</StatLabel>
          </StatCard>
        </StatsContainer>
      </WelcomeCard>
      
      <CardsGrid>
        <FeatureCard>
          <CardTitle>Today's Mood</CardTitle>
          <CardContent>
            <p>You haven't tracked your mood today. How are you feeling?</p>
          </CardContent>
        </FeatureCard>
        
        <FeatureCard>
          <CardTitle>Recent Hugs</CardTitle>
          <CardContent>
            <p>Content for Recent Hugs will be implemented here.</p>
          </CardContent>
        </FeatureCard>
        
        <FeatureCard>
          <CardTitle>Mood Insights</CardTitle>
          <CardContent>
            <p>Content for Mood Insights will be implemented here.</p>
          </CardContent>
        </FeatureCard>
        
        <FeatureCard>
          <CardTitle>Community Activity</CardTitle>
          <CardContent>
            <p>Content for Community Activity will be implemented here.</p>
          </CardContent>
        </FeatureCard>
      </CardsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;