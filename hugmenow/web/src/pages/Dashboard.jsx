import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';
import PublicMoodList from '../components/PublicMoodList';
import DashboardStats from '../components/dashboard/DashboardStats';
import { Icon } from '../components/ui/IconComponent';

// Styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const DashboardHeader = styled.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Username = styled.span`
  font-weight: 500;
  margin-right: 1rem;
`;

const LogoutButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  
  &:hover {
    color: var(--danger-color);
    background-color: var(--gray-100);
  }
`;

const DashboardContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  h1 {
    margin-bottom: 1rem;
    color: var(--gray-800);
    position: relative;
    z-index: 1;
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
    max-width: 700px;
  }
`;

const WelcomeDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.05;
  z-index: 0;
  pointer-events: none;
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  
  p {
    color: var(--gray-600);
    position: relative;
    z-index: 1;
  }
`;

const FeatureDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we're coming from a login redirect
    const hasRedirectFlag = localStorage.getItem('redirectToDashboard') === 'true';
    
    if (hasRedirectFlag) {
      console.log('Dashboard detected redirect flag from login');
      // Clear the flag
      localStorage.removeItem('redirectToDashboard');
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (hasRedirectFlag) {
        console.log('Dashboard fully loaded after login redirect');
      }
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
        <Logo>
          <Icon type="hugIcon" size={28} />
          HugMeNow
        </Logo>
        <UserInfo>
          <Avatar 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            whileHover={{ scale: 1.1 }}
          >
            {getInitials(currentUser?.name)}
          </Avatar>
          <Username>{currentUser?.name || 'Guest'}</Username>
          <LogoutButton 
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </LogoutButton>
        </UserInfo>
      </DashboardHeader>
      
      <DashboardContent>
        <WelcomeCard
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <WelcomeDecoration>
            <svg viewBox="0 0 300 200" fill="none">
              <circle cx="250" cy="50" r="200" fill="var(--primary-color)" />
              <circle cx="50" cy="150" r="100" fill="var(--primary-color)" />
            </svg>
          </WelcomeDecoration>
          
          <h1>Welcome, {currentUser?.name || 'Friend'}!</h1>
          <p>
            This is your personal dashboard where you can track your mood, 
            send and receive virtual hugs, and connect with others.
          </p>
        </WelcomeCard>
        
        <DashboardStats />
        
        <FeaturesGrid
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <FeatureCard
            onClick={() => navigateToFeature('/mood-tracker')}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FeatureDecoration>
              <svg viewBox="0 0 200 200" fill="none">
                <path d="M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z" fill="var(--primary-color)" />
              </svg>
            </FeatureDecoration>
            
            <h2>
              <Icon type="moodTracker" size={24} />
              Mood Tracker
            </h2>
            <p>
              Track your daily mood and see patterns in your emotional wellbeing over time.
            </p>
          </FeatureCard>
          
          <FeatureCard
            onClick={() => navigateToFeature('/hug-center')}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FeatureDecoration>
              <svg viewBox="0 0 200 200" fill="none">
                <path d="M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z" fill="#9D65C9" />
              </svg>
            </FeatureDecoration>
            
            <h2>
              <Icon type="ComfortingHug" size={28} />
              Hug Center
            </h2>
            <p>
              Send virtual hugs to friends or request hugs from the community when you need support.
            </p>
          </FeatureCard>
          
          <FeatureCard
            onClick={() => navigateToFeature('/profile')}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FeatureDecoration>
              <svg viewBox="0 0 200 200" fill="none">
                <path d="M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z" fill="#4CAF50" />
              </svg>
            </FeatureDecoration>
            
            <h2>
              <Icon type="profile" size={24} />
              Profile
            </h2>
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