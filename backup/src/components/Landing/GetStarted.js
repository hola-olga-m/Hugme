import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Get Started component - guides new users through the app features
 */
const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();
  
  // Move to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // On final step, redirect to registration
      navigate('/register');
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // On first step, go back to landing
      navigate('/landing');
    }
  };
  
  // Skip tour and go to registration
  const skipTour = () => {
    navigate('/register');
  };
  
  // Content for each step
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-image">
              <img src="/img/get-started-mood.png" alt="Track your mood" />
            </div>
            <h2>Track Your Mood</h2>
            <p>Log and visualize your emotional state over time. Gain insights about your patterns and triggers.</p>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <div className="step-image">
              <img src="/img/get-started-hugs.png" alt="Send virtual hugs" />
            </div>
            <h2>Send Virtual Hugs</h2>
            <p>Share emotional support with friends and family through personalized virtual hugs.</p>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <div className="step-image">
              <img src="/img/get-started-social.png" alt="Connect with friends" />
            </div>
            <h2>Connect With Friends</h2>
            <p>Follow your friends' emotional journeys and stay connected through shared experiences.</p>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <div className="step-image">
              <img src="/img/get-started-media.png" alt="Media hugs" />
            </div>
            <h2>Media Hugs</h2>
            <p>Share hugs featuring your favorite movie and cartoon characters for a personalized touch.</p>
          </div>
        );
      case 5:
        return (
          <div className="step-content">
            <div className="step-image">
              <img src="/img/get-started-therapy.png" alt="Therapy mode" />
            </div>
            <h2>Therapy Mode</h2>
            <p>Access therapeutic tools and resources designed to support you during difficult emotional times.</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="get-started-container">
      <header className="get-started-header">
        <div className="logo">
          <Link to="/landing">
            <h1>HugMood</h1>
          </Link>
        </div>
        <button className="skip-button" onClick={skipTour}>
          Skip
        </button>
      </header>
      
      <div className="get-started-content">
        {getStepContent()}
        
        <div className="progress-indicator">
          {[...Array(totalSteps)].map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${currentStep === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentStep(index + 1)}
            ></div>
          ))}
        </div>
        
        <div className="step-navigation">
          <button className="prev-button" onClick={prevStep}>
            {currentStep === 1 ? 'Back' : 'Previous'}
          </button>
          <button className="next-button" onClick={nextStep}>
            {currentStep === totalSteps ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;