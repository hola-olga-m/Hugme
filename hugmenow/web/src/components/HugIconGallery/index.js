import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getHugTypes } from '../../utils/hugIcons';
import HugIcon from '../HugIcon';

const GalleryContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${props => props.theme.cardBackground};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const GalleryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 1rem;
`;

const GalleryDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1.5rem;
`;

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SelectedIconSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.borderColor};
`;

const SelectedLabel = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

// Animation variants
const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

/**
 * HugIconGallery Component
 * Displays a gallery of all available hug icons with selection functionality
 */
const HugIconGallery = ({
  title = 'Hug Types',
  description = 'Choose from our variety of hug types to express your feelings',
  showSelection = true,
  defaultSelected = 'standard',
  onSelectHug,
  ...props
}) => {
  const [selectedType, setSelectedType] = useState(defaultSelected);
  const hugTypes = getHugTypes();
  
  const handleIconClick = (type) => {
    setSelectedType(type);
    if (onSelectHug) {
      onSelectHug(type);
    }
  };
  
  return (
    <GalleryContainer 
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      {...props}
    >
      {title && <GalleryTitle>{title}</GalleryTitle>}
      {description && <GalleryDescription>{description}</GalleryDescription>}
      
      <IconsGrid>
        {hugTypes.map(type => (
          <motion.div key={type} variants={itemAnimation}>
            <HugIcon 
              type={type}
              showLabel
              showBackground
              highlighted={selectedType === type}
              onClick={handleIconClick}
              size="medium"
            />
          </motion.div>
        ))}
      </IconsGrid>
      
      {showSelection && selectedType && (
        <SelectedIconSection>
          <SelectedLabel>Selected Hug Type:</SelectedLabel>
          <HugIcon 
            type={selectedType}
            showLabel
            highlighted
            size="large"
          />
        </SelectedIconSection>
      )}
    </GalleryContainer>
  );
};

HugIconGallery.propTypes = {
  /** Title for the gallery section */
  title: PropTypes.string,
  /** Description for the gallery */
  description: PropTypes.string,
  /** Whether to show the selected icon section */
  showSelection: PropTypes.bool,
  /** Default selected hug type */
  defaultSelected: PropTypes.string,
  /** Callback when a hug type is selected */
  onSelectHug: PropTypes.func
};

export default HugIconGallery;