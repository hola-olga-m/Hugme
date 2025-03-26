import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';
import PublicMoodList from '../components/PublicMoodList';

// Styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const DashboardHeader = styled.header`
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
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const Username = styled.span`
  font-weight: 500;
  margin-right: 1rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const DashboardContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  
  h1 {
    margin-bottom: 1rem;
    color: var(--gray-800);
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--gray-600);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
    font-size: 0.9rem;
  }
`;

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    moodStreak: 0,
    totalMoods: 0,
    hugsSent: 0,
    hugsReceived: 0,
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // In a real app, you would fetch user stats from the API
      setStats({
        moodStreak: 3,
        totalMoods: 15,
        hugsSent: 7,
        hugsReceived: 12,
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const navigateToFeature = (path) => {
    navigate(path);
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return <LoadingScreen text="Loading dashboard..." />;
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <Logo>HugMeNow</Logo>
        <UserInfo>
          <Avatar>{getInitials(currentUser?.name)}</Avatar>
          <Username>{currentUser?.name || 'Guest'}</Username>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </DashboardHeader>
      
      <DashboardContent>
        <WelcomeCard>
          <h1>Welcome, {currentUser?.name || 'Friend'}!</h1>
          <p>
            This is your personal dashboard where you can track your mood, 
            send and receive virtual hugs, and connect with others.
          </p>
        </WelcomeCard>
        
        <StatsContainer>
          <StatCard>
            <h3>{stats.moodStreak}</h3>
            <p>Day Streak</p>
          </StatCard>
          <StatCard>
            <h3>{stats.totalMoods}</h3>
            <p>Moods Tracked</p>
          </StatCard>
          <StatCard>
            <h3>{stats.hugsSent}</h3>
            <p>Hugs Sent</p>
          </StatCard>
          <StatCard>
            <h3>{stats.hugsReceived}</h3>
            <p>Hugs Received</p>
          </StatCard>
        </StatsContainer>
        
        <FeaturesGrid>
          <FeatureCard onClick={() => navigateToFeature('/mood-tracker')}>
            <h2>Mood Tracker</h2>
            <p>
              Track your daily mood and see patterns in your emotional wellbeing over time.
            </p>
          </FeatureCard>
          
          <FeatureCard onClick={() => navigateToFeature('/hug-center')}>
            <h2>Hug Center</h2>
            <p>
              Send virtual hugs to friends or request hugs from the community when you need support.
            </p>
          </FeatureCard>
          
          <FeatureCard onClick={() => navigateToFeature('/profile')}>
            <h2>Profile</h2>
            <p>
              Manage your personal information, preferences, and privacy settings.
            </p>
          </FeatureCard>
        </FeaturesGrid>
        
        <div style={{ marginTop: '2rem' }}>
          <PublicMoodList />
        </div>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;