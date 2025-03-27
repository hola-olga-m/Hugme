import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Human Hug Gallery Component
 * A standalone component that displays the human-figured hug icons,
 * both static and animated versions.
 */

// Styled components for the gallery
const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const IconCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const IconName = styled.h3`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const IconDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const IconImage = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  margin: 0 auto;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.cardBackground};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: 8px;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  }
`;

const ReferenceSection = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
`;

const ReferenceTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const ReferenceImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// Main component
const HumanHugGallery = () => {
  const [activeTab, setActiveTab] = useState('static');
  const [icons, setIcons] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(1);
  
  // This would normally load the images dynamically using import.meta.glob or similar
  // Since we can't do that directly, we'll mimic it with predefined data
  const iconTypes = [
    {
      type: 'BearHug',
      description: 'A warm, enveloping hug that brings comfort and security.'
    },
    {
      type: 'Supporting',
      description: 'A supportive embrace for tough times.'
    },
    {
      type: 'Comforting',
      description: 'A gentle hug to soothe and calm.'
    },
    {
      type: 'Loving',
      description: 'A tender expression of affection and care.'
    },
    {
      type: 'Celebrating',
      description: 'A joyful hug to share in happy moments.'
    },
    {
      type: 'Festive',
      description: 'A cheerful hug for celebrations and special occasions.'
    },
    {
      type: 'Caring',
      description: 'A nurturing embrace that shows deep compassion.'
    },
    {
      type: 'Teasing',
      description: 'A playful squeeze to lighten the mood.'
    },
    {
      type: 'Inviting',
      description: 'A welcoming hug that brings people together.'
    },
    {
      type: 'Moody',
      description: 'A consoling hug for those emotion-heavy moments.'
    }
  ];
  
  // Set up animation timer
  useEffect(() => {
    if (activeTab === 'animated') {
      const interval = setInterval(() => {
        setCurrentFrame(prev => (prev % 6) + 1);
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [activeTab]);
  
  // Prepare icon paths
  useEffect(() => {
    const basePath = '/images';
    
    // In a real implementation, we would load the actual files dynamically
    // Here we're just constructing paths based on our knowledge of the file structure
    const preparedIcons = iconTypes.map(icon => {
      const staticIconPath = `${basePath}/human-${icon.type}.png`;
      const animatedFramePaths = Array.from({ length: 6 }, (_, i) => 
        `${basePath}/human-${icon.type}-animated_frame${i + 1}.png`
      );
      
      return {
        ...icon,
        staticPath: staticIconPath,
        animatedPaths: animatedFramePaths
      };
    });
    
    setIcons(preparedIcons);
  }, []);
  
  return (
    <GalleryContainer>
      <Title>Human Hug Icons Gallery</Title>
      <Description>
        Explore our collection of human-figured hug icons, designed to express different
        emotions and types of support.
      </Description>
      
      <Tabs>
        <Tab 
          active={activeTab === 'static'} 
          onClick={() => setActiveTab('static')}
        >
          Static Icons
        </Tab>
        <Tab 
          active={activeTab === 'animated'} 
          onClick={() => setActiveTab('animated')}
        >
          Animated Icons
        </Tab>
      </Tabs>
      
      <IconsGrid>
        {icons.map((icon) => (
          <IconCard key={icon.type}>
            <IconImage 
              src={activeTab === 'static' 
                ? icon.staticPath 
                : icon.animatedPaths[currentFrame - 1]} 
              alt={`${icon.type} hug icon`} 
            />
            <IconName>{icon.type}</IconName>
            <IconDescription>{icon.description}</IconDescription>
          </IconCard>
        ))}
      </IconsGrid>
      
      <ReferenceSection>
        <ReferenceTitle>Reference Grid</ReferenceTitle>
        <ReferenceImage 
          src="/images/reference-human-hugs.png" 
          alt="Hug types reference grid" 
        />
      </ReferenceSection>
    </GalleryContainer>
  );
};

export default HumanHugGallery;