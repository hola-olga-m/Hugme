import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--background-color, #f9fafb);
`;

const OnboardingCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 1rem;
  text-align: center;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StepDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active 
    ? 'var(--primary-color, #6366f1)' 
    : 'var(--border-color, #e5e7eb)'};
  margin: 0 5px;
  transition: background-color 0.2s ease;
`;

const StepContent = styled.div`
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviousButton = styled(Button)`
  background-color: transparent;
  color: var(--text-secondary-color, #6b7280);
  border: 1px solid var(--border-color, #e5e7eb);

  &:hover:not(:disabled) {
    background-color: var(--gray-50, #f9fafb);
  }
`;

const NextButton = styled(Button)`
  background-color: var(--primary-color, #6366f1);
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: var(--primary-dark-color, #4f46e5);
  }
`;

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete, navigate to dashboard
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <h2>Welcome to HugMeNow!</h2>
            <p>Let's set up your account to get the most out of your experience.</p>
          </StepContent>
        );
      case 2:
        return (
          <StepContent>
            <h2>Mood Tracking</h2>
            <p>
              HugMeNow helps you track your moods over time. You can record how you're feeling
              and gain insights into your emotional patterns.
            </p>
          </StepContent>
        );
      case 3:
        return (
          <StepContent>
            <h2>Ready to Go!</h2>
            <p>
              Your account is all set up. Click "Complete" to start using HugMeNow and begin your
              emotional wellness journey.
            </p>
          </StepContent>
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <Title>Getting Started</Title>
        
        <StepIndicator>
          {[...Array(totalSteps)].map((_, index) => (
            <StepDot key={index} active={index + 1 <= currentStep} />
          ))}
        </StepIndicator>
        
        {renderStepContent()}
        
        <ButtonContainer>
          <PreviousButton 
            onClick={handlePrevious} 
            disabled={currentStep === 1}
          >
            Previous
          </PreviousButton>
          
          <NextButton onClick={handleNext}>
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </NextButton>
        </ButtonContainer>
      </OnboardingCard>
    </OnboardingContainer>
  );
};

export default OnboardingPage;