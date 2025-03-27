import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';
import PublicMoodList from '../components/PublicMoodList';
import DashboardStats from '../components/dashboard/DashboardStats';
import FriendMoodsWidget from '../components/dashboard/FriendMoodsWidget';
import QuickSendHugWidget from '../components/dashboard/QuickSendHugWidget';
import ReceivedHugsWidget from '../components/dashboard/ReceivedHugsWidget';
import QuickHugButton from '../components/dashboard/QuickHugButton';
import WelcomeHugButton from '../components/dashboard/WelcomeHugButton';
import { Icon } from '../components/ui/IconComponent';

// Styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const DashboardHeader = styled.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
`;

const Avatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #6c5ce7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.25);
`;

const Username = styled.span`
  font-weight: 500;
  margin-right: 1rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  
  @media (max-width: 480px) {
    max-width: 80px;
  }
`;

const LogoutButton = styled(motion.button)`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
  
  &:hover {
    color: #e74c3c;
    background-color: #f8f9fa;
  }
`;

const DashboardContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const WelcomeCard = styled(motion.div)`
  background-color: #6c5ce7;
  background-image: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.15);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  h1 {
    margin-bottom: 1rem;
    color: white;
    position: relative;
    z-index: 1;
    font-size: 1.8rem;
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
    max-width: 700px;
    font-size: 1.1rem;
    line-height: 1.5;
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const WelcomeDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const WidgetsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2.5rem 0;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const WidgetColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled(motion.h2)`
  margin: 2rem 0 1rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #e0e0e0, transparent);
    margin-left: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    color: #6c5ce7;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    font-size: 1.3rem;
  }
  
  p {
    color: #666;
    position: relative;
    z-index: 1;
    margin-bottom: 0;
    line-height: 1.5;
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
        <HeaderActions>
          <QuickHugButton onSent={() => console.log('Quick hug sent successfully!')} />
          <WelcomeHugButton onSent={() => console.log('Welcome hug and friend request sent successfully!')} />
          <UserInfo>
            <Avatar 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              {getInitials(currentUser?.name)}
            </Avatar>
            <Username className="user-name">{currentUser?.name || 'Guest'}</Username>
            <LogoutButton 
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </LogoutButton>
          </UserInfo>
        </HeaderActions>
      </DashboardHeader>
      
      <DashboardContent>
        <WelcomeCard
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <WelcomeDecoration>
            <svg viewBox="0 0 300 200" fill="none">
              <circle cx="250" cy="50" r="200" fill="white" />
              <circle cx="50" cy="150" r="100" fill="white" />
            </svg>
          </WelcomeDecoration>
          
          <h1>Welcome, {currentUser?.name || 'Friend'}!</h1>
          <p>
            Track your daily emotions, send and receive virtual hugs, and connect with supportive friends.
          </p>
        </WelcomeCard>
        
        {/* Stats Section */}
        <DashboardStats />
        
        {/* Widgets Section */}
        <SectionTitle 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Icon type="heart" size={20} />
          Your Activity Center
        </SectionTitle>
        
        <WidgetsContainer>
          <WidgetColumn>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FriendMoodsWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PublicMoodList />
            </motion.div>
          </WidgetColumn>
          
          <WidgetColumn>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ReceivedHugsWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <QuickSendHugWidget />
            </motion.div>
          </WidgetColumn>
        </WidgetsContainer>
        
        {/* Features Section */}
        <SectionTitle 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Icon type="moodTracker" size={20} />
          Featured Tools
        </SectionTitle>
        
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
            
            <h3>
              <Icon type="moodTracker" size={24} />
              Mood Tracker
            </h3>
            <p>
              Track your daily mood and discover patterns in your emotional well-being over time.
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
            
            <h3>
              <Icon type="ComfortingHug" size={28} />
              Hug Center
            </h3>
            <p>
              Send customized virtual hugs to friends or request support from your community.
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
            
            <h3>
              <Icon type="profile" size={24} />
              Profile
            </h3>
            <p>
              Customize your profile, manage privacy settings, and track your emotional journey.
            </p>
          </FeatureCard>
        </FeaturesGrid>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;