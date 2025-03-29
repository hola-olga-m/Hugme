import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HugGallery from '../../components/HugGallery';
import { fadeIn, slideInLeft } from '../../utils/animations';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled(motion.div)`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 24px;
  max-width: 800px;
`;

const SelectedHugInfo = styled(motion.div)`
  margin-top: 32px;
  padding: 24px;
  border-radius: 16px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const SelectedTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const SelectedDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`;

/**
 * Demo page showcasing the HugGallery component with all hug types
 */
const HugGalleryDemo = () => {
  const [selectedHugId, setSelectedHugId] = useState(null);
  
  // Sample hug types data with our new icons
  const hugTypes = [
    {
      id: 'friendship',
      iconName: 'friendship-hug',
      title: 'Friendship Hug',
      description: 'A warm embrace between friends showing connection and support',
      accentColor: '#5e72e4',
      fullDescription: 'The Friendship Hug represents the special bond between friends. It\'s a gesture that says "I value our connection" and strengthens the relationship. This hug is perfect for showing appreciation for a friend who\'s always there for you.'
    },
    {
      id: 'healing',
      iconName: 'healing-hug',
      title: 'Healing Hug',
      description: 'A gentle, nurturing hug that provides comfort during difficult times',
      accentColor: '#36d6b7',
      fullDescription: 'The Healing Hug is designed to provide comfort and support during challenging moments. It represents empathy and care, offering a sense of peace and reassurance. This hug helps in emotional recovery and shows that you\'re not alone in your struggles.'
    },
    {
      id: 'encouragement',
      iconName: 'encouragement-hug',
      title: 'Encouragement Hug',
      description: 'An uplifting hug that motivates and inspires confidence',
      accentColor: '#ffbb13',
      fullDescription: 'The Encouragement Hug is all about boosting confidence and providing motivation. It\'s the perfect hug to send when someone needs a push to believe in themselves. This hug communicates "You can do it!" and helps turn doubt into determination.'
    },
    {
      id: 'love',
      iconName: 'love-hug',
      title: 'Love Hug',
      description: 'A passionate embrace expressing deep affection and romantic love',
      accentColor: '#ff4081',
      fullDescription: 'The Love Hug represents romantic affection and deep emotional connection. It\'s an expression of intimate feelings that goes beyond words. This hug is meant for those special relationships where hearts are truly connected, communicating "You mean everything to me."'
    },
    {
      id: 'gratitude',
      iconName: 'gratitude-hug',
      title: 'Gratitude Hug',
      description: 'A thankful embrace showing appreciation for kindness and support',
      accentColor: '#a78bfa',
      fullDescription: 'The Gratitude Hug is a way to express sincere appreciation for someone\'s kindness, support, or generosity. It communicates "thank you" in the most heartfelt way possible. This hug acknowledges the positive impact someone has had on your life and celebrates their contribution.'
    }
  ];
  
  const selectedHug = hugTypes.find(hug => hug.id === selectedHugId);
  
  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Header variants={slideInLeft}>
        <Title>Hug Gallery</Title>
        <Subtitle>
          Explore our collection of beautiful, emotionally resonant hug types. 
          Each hug is designed to express a specific sentiment and create a meaningful connection.
          Select a hug to learn more about its purpose and meaning.
        </Subtitle>
      </Header>
      
      <HugGallery 
        hugs={hugTypes}
        onSelect={setSelectedHugId}
        selectedHugId={selectedHugId}
      />
      
      {selectedHug && (
        <SelectedHugInfo
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SelectedTitle>{selectedHug.title}</SelectedTitle>
          <SelectedDescription>{selectedHug.fullDescription}</SelectedDescription>
        </SelectedHugInfo>
      )}
    </PageContainer>
  );
};

export default HugGalleryDemo;