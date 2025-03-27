import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SimpleLayout from '../../layouts/SimpleLayout';
import HugIconGallery from '../../components/HugIconGallery';
import HugIcon from '../../components/HugIcon';
import { getAnimalHugTypes, getAnimalHugTypeColor, getAnimalHugTypeDisplayName } from '../../utils/animalsHugIcons';

// Styled components
const PageContainer = styled.div`
  padding: 16px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 16px 0;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 16px 0;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const IconCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? props.color : 'transparent'};
`;

const IconName = styled.h3`
  font-size: 0.9rem;
  color: #333;
  margin: 8px 0 0 0;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a80d2;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// Animation variants
const cardVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  },
  tap: {
    scale: 0.98,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }
};

/**
 * HugGalleryDemo page
 * Demonstrates the different hug icons and how they can be used
 */
const HugGalleryDemo = () => {
  const navigate = useNavigate();
  const [selectedHugType, setSelectedHugType] = useState('fox');
  
  // Handle hug type selection
  const handleSelectHugType = (type) => {
    setSelectedHugType(type);
  };
  
  // Go back to the dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <SimpleLayout>
      <PageContainer>
        <PageHeader>
          <Title>Hug Icon Gallery</Title>
          <Description>
            Explore the different types of hugs available in the HugMeNow app.
            These icons are used throughout the application to represent different
            types of virtual hugs that you can send to friends and loved ones.
          </Description>
        </PageHeader>
        
        <Section>
          <SectionTitle>Individual Hug Icons</SectionTitle>
          <CardGrid>
            {getAnimalHugTypes().map((hugType) => (
              <IconCard 
                key={hugType}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                isSelected={selectedHugType === hugType}
                color={getAnimalHugTypeColor(hugType)}
                onClick={() => handleSelectHugType(hugType)}
              >
                <HugIcon 
                  type={hugType} 
                  size="md" 
                  showBackground={false}
                />
                <IconName>{getAnimalHugTypeDisplayName(hugType)}</IconName>
              </IconCard>
            ))}
          </CardGrid>
        </Section>
        
        <Section>
          <SectionTitle>Hug Icon Gallery Component</SectionTitle>
          <HugIconGallery 
            title="Select a Hug Type"
            description="Choose the type of hug you want to send"
            defaultSelectedType={selectedHugType}
            onSelectHugType={handleSelectHugType}
          />
        </Section>
        
        <ButtonContainer>
          <Link to="/login">
            <Button>
              Sign In to HugMeNow
            </Button>
          </Link>
        </ButtonContainer>
      </PageContainer>
    </SimpleLayout>
  );
};

export default HugGalleryDemo;