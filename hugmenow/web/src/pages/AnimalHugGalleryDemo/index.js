import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AnimalHugGallery from '../../components/AnimalHugGallery';
import { getAnimalHugTypeDisplayName, getAnimalHugTypeDescription } from '../../utils/animalsHugIcons';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContentSection = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 24px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: #6A5ACD;
    border-radius: 3px;
  }
`;

const Card = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 32px;
  color: #6A5ACD;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
`;

const InfoBox = styled.div`
  background-color: #f5f5f5;
  border-left: 4px solid #6A5ACD;
  padding: 20px;
  margin: 30px 0;
  border-radius: 0 8px 8px 0;
`;

const InfoTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 10px 0;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const SelectedHugDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px dashed #ccc;
  margin: 40px 0;
`;

const SelectedHugTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const HugDetails = styled.div`
  text-align: center;
  max-width: 400px;
  margin-top: 20px;
`;

const HugType = styled.span`
  display: inline-block;
  background-color: #6A5ACD;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

/**
 * Animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }
};

/**
 * AnimalHugGalleryDemo page
 * Demonstrates the different animal-themed hug icons and how they can be used
 */
const AnimalHugGalleryDemo = () => {
  const [selectedHugType, setSelectedHugType] = useState('fox');
  
  // Handle hug selection from the gallery
  const handleHugSelection = (type) => {
    setSelectedHugType(type);
  };
  
  return (
    <PageContainer>
      <Header>
        <Title>Animal Hug Gallery</Title>
        <Subtitle>
          Explore our collection of animal-themed hugs, each with unique character and meaning
        </Subtitle>
      </Header>
      
      <ContentSection>
        <SectionTitle>Featured Collection</SectionTitle>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimalHugGallery 
            title="Send an Animal Hug"
            description="Choose from our collection of warm, comforting animal hugs to send to someone who needs it"
            onSelectHugType={handleHugSelection}
            defaultSelectedType={selectedHugType}
          />
        </Card>
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>Your Selected Hug</SectionTitle>
        <SelectedHugDisplay>
          <SelectedHugTitle>You Selected:</SelectedHugTitle>
          <HugType>{selectedHugType.toUpperCase()}</HugType>
          <HugDetails>
            <h3>{getAnimalHugTypeDisplayName(selectedHugType)}</h3>
            <p>{getAnimalHugTypeDescription(selectedHugType)}</p>
          </HugDetails>
        </SelectedHugDisplay>
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>Why Animal Hugs?</SectionTitle>
        <InfoBox>
          <InfoTitle>Did you know?</InfoTitle>
          <InfoText>
            Studies show that animal imagery can have a calming effect on our nervous system.
            Even virtual animal interactions can trigger the release of oxytocin, the "bonding hormone".
          </InfoText>
        </InfoBox>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <FeatureGrid>
            <FeatureCard variants={itemVariants}>
              <FeatureIcon>🌈</FeatureIcon>
              <FeatureTitle>Diverse Expression</FeatureTitle>
              <FeatureDescription>
                Each animal brings its unique characteristics to express different types of emotional support.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard variants={itemVariants}>
              <FeatureIcon>🧠</FeatureIcon>
              <FeatureTitle>Psychological Comfort</FeatureTitle>
              <FeatureDescription>
                Animal imagery has been shown to reduce stress and anxiety levels even in brief exposures.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard variants={itemVariants}>
              <FeatureIcon>💌</FeatureIcon>
              <FeatureTitle>Meaningful Connection</FeatureTitle>
              <FeatureDescription>
                Animal hugs provide a playful, non-threatening way to express care and support.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </motion.div>
      </ContentSection>
    </PageContainer>
  );
};

export default AnimalHugGalleryDemo;