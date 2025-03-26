import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import ColorPaletteSelector from '../components/theme/ColorPaletteSelector';
import PageContainer from '../components/layout/PageContainer';
import { FiChevronLeft, FiInfo } from 'react-icons/fi';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-base);
  padding: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
    transform: translateX(-3px);
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
`;

const SettingsCard = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const InfoBox = styled.div`
  background-color: var(--info-light, rgba(184, 233, 134, 0.3));
  border-radius: var(--border-radius-md);
  padding: 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  
  .info-icon {
    color: var(--info-color);
    font-size: 1.25rem;
    margin-top: 0.25rem;
  }
  
  .info-content {
    flex: 1;
    
    h4 {
      font-weight: 600;
      color: var(--gray-800);
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: var(--gray-700);
      margin: 0;
      line-height: 1.5;
      font-size: 0.95rem;
    }
  }
`;

const SaveFeedback = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--success-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: ${props => props.visible ? 'block' : 'none'};
  animation: fadeInUp 0.3s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

const ThemeSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { colorPalette, setTheme } = useTheme();
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  const handleSavePalette = (palette) => {
    setTheme(palette);
    
    // Show feedback message
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };
  
  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label={t('navigation.back')}>
          <FiChevronLeft />
        </BackButton>
        <Title>{t('theme.settings')}</Title>
      </Header>
      
      <InfoBox>
        <div className="info-icon">
          <FiInfo />
        </div>
        <div className="info-content">
          <h4>{t('theme.howItWorks')}</h4>
          <p>{t('theme.colorPaletteDescription')}</p>
        </div>
      </InfoBox>
      
      <ColorPaletteSelector 
        onSave={handleSavePalette}
        initialPalette={colorPalette.id}
      />
      
      <SaveFeedback visible={showSavedMessage}>
        {t('theme.paletteApplied')}
      </SaveFeedback>
    </PageContainer>
  );
};

export default ThemeSettings;