/**
 * HumanHugGalleryDemo Page
 * 
 * This page showcases the human-figured hug icons with animations.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import HumanHugIcon from '../../components/HumanHugIcon';
import { HUG_TYPES } from '../../utils/humanHugIcons';

// Page container with responsive grid layout
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ControlGroup = styled.div`
  margin: 0 1rem;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
  
  label {
    margin-right: 0.5rem;
    font-weight: bold;
  }
  
  select, button {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    background-color: #4a90e2;
    color: white;
    border: none;
    cursor: pointer;
    
    &:hover {
      background-color: #357abD;
    }
  }
`;

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
`;

/**
 * HumanHugGalleryDemo Component
 */
const HumanHugGalleryDemo = () => {
  // State for display options
  const [iconSize, setIconSize] = useState('120px');
  const [isAnimated, setIsAnimated] = useState(false);
  const [isCircular, setIsCircular] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  
  // Convert HUG_TYPES object to array for easier mapping
  const hugTypesArray = Object.values(HUG_TYPES);
  
  return (
    <PageContainer>
      <Header>
        <h1>Human Hug Icons Gallery</h1>
        <p>Explore our collection of human-figured hug icons</p>
      </Header>
      
      <ControlsContainer>
        <ControlGroup>
          <label htmlFor="size-select">Size:</label>
          <select 
            id="size-select"
            value={iconSize}
            onChange={(e) => setIconSize(e.target.value)}
          >
            <option value="80px">Small</option>
            <option value="120px">Medium</option>
            <option value="160px">Large</option>
          </select>
        </ControlGroup>
        
        <ControlGroup>
          <button onClick={() => setIsAnimated(!isAnimated)}>
            {isAnimated ? 'Disable Animation' : 'Enable Animation'}
          </button>
        </ControlGroup>
        
        <ControlGroup>
          <button onClick={() => setIsCircular(!isCircular)}>
            {isCircular ? 'Square Icons' : 'Circular Icons'}
          </button>
        </ControlGroup>
        
        <ControlGroup>
          <button onClick={() => setShowCaptions(!showCaptions)}>
            {showCaptions ? 'Hide Captions' : 'Show Captions'}
          </button>
        </ControlGroup>
      </ControlsContainer>
      
      <IconsGrid>
        {hugTypesArray.map((hugType) => (
          <HumanHugIcon
            key={hugType}
            type={hugType}
            size={iconSize}
            animated={isAnimated}
            circular={isCircular}
            showCaption={showCaptions}
            onClick={() => console.log(`Clicked on ${hugType} icon`)}
          />
        ))}
      </IconsGrid>
    </PageContainer>
  );
};

export default HumanHugGalleryDemo;