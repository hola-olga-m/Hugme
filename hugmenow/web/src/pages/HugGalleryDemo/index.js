import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeIn, pageTransition } from '../../utils/animations';
import HugIconGallery from '../../components/HugIconGallery';
import HugIcon from '../../components/HugIcon';
import { getHugTypes, getHugTypeDisplayName } from '../../utils/hugIcons';

// Styled components
const PageContainer = styled(motion.div)`
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 2rem 0 1rem;
`;

const DemoSection = styled.section`
  background: ${props => props.theme.cardBackground};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const DemoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DemoDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const BackButton = styled(motion.button)`
  padding: 0.75rem 1.25rem;
  background-color: ${props => props.theme.buttonSecondary};
  color: ${props => props.theme.textPrimary};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  
  &:hover {
    background-color: ${props => props.theme.buttonSecondaryHover};
  }
`;

/**
 * HugGalleryDemo page
 * Demonstrates the different hug icons and how they can be used
 */
const HugGalleryDemo = () => {
  const navigate = useNavigate();
  const [selectedHugType, setSelectedHugType] = useState('standard');
  const hugTypes = getHugTypes();
  
  const handleSelectHug = (type) => {
    setSelectedHugType(type);
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
    >
      <PageHeader>
        <PageTitle>Hug Icons Demo</PageTitle>
        <PageDescription>
          Explore our collection of expressive hug icons designed in a friendly, colorful style similar to "hugs not drugs" Telegram stickers.
        </PageDescription>
      </PageHeader>
      
      <HugIconGallery 
        title="Choose Your Hug Style"
        description="Select from our variety of hug types to express different emotions and situations"
        onSelectHug={handleSelectHug}
        defaultSelected={selectedHugType}
      />
      
      <motion.div variants={fadeIn}>
        <SectionTitle>Different Sizes</SectionTitle>
        <DemoSection>
          <DemoDescription>
            Hug icons are available in different sizes to fit various UI contexts
          </DemoDescription>
          <DemoRow>
            <HugIcon type={selectedHugType} size="tiny" showLabel />
            <HugIcon type={selectedHugType} size="small" showLabel />
            <HugIcon type={selectedHugType} size="medium" showLabel />
            <HugIcon type={selectedHugType} size="large" showLabel />
            <HugIcon type={selectedHugType} size="xlarge" showLabel />
          </DemoRow>
        </DemoSection>
      </motion.div>
      
      <motion.div variants={fadeIn}>
        <SectionTitle>Displaying Options</SectionTitle>
        <DemoSection>
          <DemoDescription>
            Different ways to display hug icons in your UI
          </DemoDescription>
          <DemoRow>
            <HugIcon 
              type={selectedHugType} 
              showBackground 
              showLabel 
              size="medium" 
            />
            <HugIcon 
              type={selectedHugType} 
              showBackground={false}
              showLabel 
              size="medium" 
            />
            <HugIcon 
              type={selectedHugType} 
              showBackground 
              showLabel={false}
              size="medium" 
            />
            <HugIcon 
              type={selectedHugType} 
              highlighted
              showBackground 
              showLabel 
              size="medium" 
            />
          </DemoRow>
        </DemoSection>
      </motion.div>
      
      <motion.div variants={fadeIn}>
        <SectionTitle>All Types Gallery</SectionTitle>
        <DemoSection>
          <DemoDescription>
            The complete collection of available hug icons
          </DemoDescription>
          <DemoRow>
            {hugTypes.map(type => (
              <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <HugIcon 
                  type={type}
                  showBackground
                  size="medium" 
                />
                <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  {getHugTypeDisplayName(type)}
                </span>
              </div>
            ))}
          </DemoRow>
        </DemoSection>
      </motion.div>
      
      <BackButton 
        onClick={handleBackClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </BackButton>
    </PageContainer>
  );
};

export default HugGalleryDemo;