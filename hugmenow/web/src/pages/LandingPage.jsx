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
  background: var(--background-gradient, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%));
`;

const HeroSection = styled.div`
  text-align: center;
  max-width: 800px;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--primary-color, #6366f1);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-color, #4b5563);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  margin-left: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--primary-color, #6366f1);
  border: 1px solid var(--primary-color, #6366f1);
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-color, #6366f1);
    color: white;
  }
`;

const FeatureSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--primary-color, #6366f1);
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary-color, #6b7280);
  line-height: 1.6;
`;

const LandingPage = () => {
  return (
    <LandingContainer>
      <HeroSection>
        <Title>Welcome to HugMeNow</Title>
        <Subtitle>
          Track your moods, receive virtual hugs, and connect with others who understand.
          Our emotional wellness platform helps you navigate your feelings and build meaningful connections.
        </Subtitle>
        <div>
          <CTAButton to="/auth/register">Get Started</CTAButton>
          <SecondaryButton to="/auth/login">Sign In</SecondaryButton>
        </div>
      </HeroSection>

      <FeatureSection>
        <FeatureCard>
          <FeatureTitle>Track Your Mood</FeatureTitle>
          <FeatureDescription>
            Record and monitor your emotional state with our intuitive mood tracker.
            Gain insights into your patterns and triggers over time.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Send & Receive Hugs</FeatureTitle>
          <FeatureDescription>
            Share virtual hugs with friends or strangers when they need support.
            Receive hugs when you're feeling down to boost your mood.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Community Support</FeatureTitle>
          <FeatureDescription>
            Connect with a compassionate community of users who understand what you're going through.
            Share experiences and offer mutual support.
          </FeatureDescription>
        </FeatureCard>
      </FeatureSection>
    </LandingContainer>
  );
};

export default LandingPage;