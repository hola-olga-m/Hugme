import React from 'react';
import styled from 'styled-components';

const AuthLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color, #f8f9fa);
`;

const AuthContentSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const AuthImageSide = styled.div`
  flex: 1;
  background-color: var(--primary-color, #635BFF);
  background-image: linear-gradient(
    135deg,
    var(--primary-color, #635BFF) 0%,
    var(--primary-dark-color, #483dff) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  
  a {
    text-decoration: none;
    color: var(--primary-color, #635BFF);
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
`;

const ImageSideContent = styled.div`
  max-width: 500px;
  text-align: center;
`;

const ImageSideTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ImageSideText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const FeatureList = styled.div`
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FeatureIcon = styled.div`
  margin-right: 1rem;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureText = styled.div`
  font-size: 1rem;
`;

/**
 * AuthLayout Component
 * Layout wrapper for authentication-related pages (login, register, etc.)
 */
const AuthLayout = ({ children }) => {
  return (
    <AuthLayoutContainer>
      <AuthContentSide>
        <Logo>
          <a href="/">HugMood</a>
        </Logo>
        <AuthCard>
          {children}
        </AuthCard>
      </AuthContentSide>
      
      <AuthImageSide>
        <ImageSideContent>
          <ImageSideTitle>Welcome to the HugMood Community</ImageSideTitle>
          <ImageSideText>
            Join thousands of users who are enhancing their emotional wellness and 
            strengthening connections with loved ones.
          </ImageSideText>
          
          <FeatureList>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>Track your moods and emotional patterns</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>Send and receive virtual hugs from loved ones</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>Get insights about your emotional well-being</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>Join group hugs and community support circles</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>Personalize your experience with theme options</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ImageSideContent>
      </AuthImageSide>
    </AuthLayoutContainer>
  );
};

export default AuthLayout;