import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ANIMAL_HUG_ICONS, getAnimalHugTypeDescription } from '../../utils/animalsHugIcons';
import HugIcon from '../HugIcon';

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GalleryHeader = styled.div`
  margin-bottom: 20px;
`;

const GalleryTitle = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

const GalleryDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 20px;
  margin-bottom: ${props => props.showSelectedSection ? '20px' : '0'};
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SelectedIconSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eaeaea;
`;

const SelectedIconTitle = styled.h4`
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
  font-weight: 600;
`;

const SelectedIconDetails = styled.div`
  margin-top: 20px;
  text-align: center;
  max-width: 320px;
`;

const SelectedIconName = styled.h5`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 500;
`;

const SelectedIconDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.isActive ? props.activeColor || '#6A5ACD' : '#f1f1f1'};
  color: ${props => props.isActive ? '#ffffff' : '#333'};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.isActive ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.isActive ? props.activeColor || '#6A5ACD' : '#e4e4e4'};
  }
`;

/**
 * Animation variants for the gallery items
 */
const galleryVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInVariants = {
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

// Define categories for organizing the animal hugs
const HUG_CATEGORIES = {
  all: 'All Animals',
  forest: 'Forest Friends',
  arctic: 'Arctic Pals',
  magic: 'Magical Creatures',
  domestic: 'Domestic Companions'
};

// Map animal types to categories
const ANIMAL_CATEGORIES = {
  fox: 'forest',
  bear: 'forest',
  hedgehog: 'forest',
  rabbit: 'forest',
  penguin: 'arctic',
  yinyang: 'magic',
  sloth: 'forest',
  panda: 'forest',
  cat: 'domestic',
  unicorn: 'magic'
};

/**
 * AnimalHugGallery Component
 * Displays a gallery of animal-themed hug icons with selection functionality and category filtering
 */
const AnimalHugGallery = ({
  /** Title for the gallery section */
  title = 'Animal Hug Gallery',
  /** Description for the gallery */
  description = 'Select an animal hug to send your warmth',
  /** Whether to show the selected icon section */
  showSelectedSection = true,
  /** Default selected animal hug type */
  defaultSelectedType = 'fox',
  /** Callback when an animal hug type is selected */
  onSelectHugType
}) => {
  const [selectedType, setSelectedType] = useState(defaultSelectedType);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Update selected type if default changes
  useEffect(() => {
    setSelectedType(defaultSelectedType);
  }, [defaultSelectedType]);
  
  // Handle icon selection
  const handleSelectIcon = (type) => {
    setSelectedType(type);
    if (onSelectHugType) {
      onSelectHugType(type);
    }
  };
  
  // Get the description for the selected hug type
  const selectedDescription = getAnimalHugTypeDescription(selectedType);
  
  // Filter animal types by active category
  const getFilteredAnimalTypes = () => {
    if (activeCategory === 'all') {
      return Object.keys(ANIMAL_HUG_ICONS);
    }
    
    return Object.keys(ANIMAL_HUG_ICONS).filter(
      animalType => ANIMAL_CATEGORIES[animalType] === activeCategory
    );
  };
  
  // Get color for the category button
  const getCategoryColor = (category) => {
    switch (category) {
      case 'forest': return '#4CAF50';
      case 'arctic': return '#2196F3';
      case 'magic': return '#9C27B0';
      case 'domestic': return '#FF9800';
      default: return '#6A5ACD';
    }
  };
  
  return (
    <GalleryContainer data-testid="animal-hug-gallery">
      <GalleryHeader>
        <GalleryTitle>{title}</GalleryTitle>
        <GalleryDescription>{description}</GalleryDescription>
      </GalleryHeader>
      
      <CategoryButtons>
        {Object.entries(HUG_CATEGORIES).map(([category, label]) => (
          <CategoryButton 
            key={category}
            isActive={activeCategory === category}
            activeColor={getCategoryColor(category)}
            onClick={() => setActiveCategory(category)}
          >
            {label}
          </CategoryButton>
        ))}
      </CategoryButtons>
      
      <motion.div
        variants={galleryVariants}
        initial="hidden"
        animate="visible"
      >
        <GalleryGrid showSelectedSection={showSelectedSection}>
          {getFilteredAnimalTypes().map((hugType) => (
            <motion.div key={hugType} variants={fadeInVariants}>
              <HugIcon
                type={hugType}
                showLabel
                showBackground
                isSelected={selectedType === hugType}
                margin="8px 0"
                onClick={() => handleSelectIcon(hugType)}
              />
            </motion.div>
          ))}
        </GalleryGrid>
      </motion.div>
      
      {showSelectedSection && (
        <SelectedIconSection
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <SelectedIconTitle>Your Selected Hug</SelectedIconTitle>
          <HugIcon
            type={selectedType}
            size="lg"
            showBackground
            isSelected
          />
          <SelectedIconDetails>
            <SelectedIconName>{ANIMAL_HUG_ICONS[selectedType]?.name}</SelectedIconName>
            <SelectedIconDescription>{selectedDescription}</SelectedIconDescription>
          </SelectedIconDetails>
        </SelectedIconSection>
      )}
    </GalleryContainer>
  );
};

AnimalHugGallery.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  showSelectedSection: PropTypes.bool,
  defaultSelectedType: PropTypes.oneOf(Object.keys(ANIMAL_HUG_ICONS)),
  onSelectHugType: PropTypes.func
};

export default AnimalHugGallery;