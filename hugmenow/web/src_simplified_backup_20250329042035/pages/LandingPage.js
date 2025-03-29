import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  color: #555;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled(Link)`
  background-color: ${props => props.primary ? '#635BFF' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#635BFF'};
  border: 2px solid #635BFF;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.primary ? '#483dff' : 'rgba(99, 91, 255, 0.1)'};
  }
`;

const FeatureSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  max-width: 1200px;
`;

const FeatureCard = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  color: #333;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: #666;
`;

/**
 * Landing Page Component
 * The first page users see when visiting the application
 */
const LandingPage = () => {
  return (
    <LandingContainer>
      <Title>Welcome to HugMood</Title>
      <Subtitle>
        Share virtual hugs, track your emotional wellness, and stay connected with 
        those who matter most in a supportive online environment.
      </Subtitle>
      
      <ButtonGroup>
        <Button to="/auth/login" primary>Log In</Button>
        <Button to="/auth/register">Sign Up</Button>
      </ButtonGroup>
      
      <FeatureSection>
        <FeatureCard>
          <FeatureTitle>Track Your Moods</FeatureTitle>
          <FeatureDescription>
            Record your daily emotions with intuitive tools and gain insights
            into patterns affecting your well-being.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Send Virtual Hugs</FeatureTitle>
          <FeatureDescription>
            Show someone you care with personalized virtual hugs. Choose
            from different hug types to match your feelings.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Connect with Others</FeatureTitle>
          <FeatureDescription>
            Build a supportive community, join group hugs, and share
            your emotional journey with trusted friends.
          </FeatureDescription>
        </FeatureCard>
      </FeatureSection>
    </LandingContainer>
  );
};

export default LandingPage;