import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HUG_ICONS, getHugTypeDescription } from '../../utils/hugIcons';
import HugIcon from '../HugIcon';

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const GalleryHeader = styled.div`
  margin-bottom: 16px;
`;

const GalleryTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 4px 0;
`;

const GalleryDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: ${props => props.showSelectedSection ? '16px' : '0'};
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SelectedIconSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-top: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const SelectedIconTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
`;

const SelectedIconDetails = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const SelectedIconName = styled.h5`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 8px 0;
`;

const SelectedIconDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
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

/**
 * HugIconGallery Component
 * Displays a gallery of all available hug icons with selection functionality
 */
const HugIconGallery = ({
  /** Title for the gallery section */
  title = 'Hug Types',
  /** Description for the gallery */
  description = 'Select a hug type to send',
  /** Whether to show the selected icon section */
  showSelectedSection = true,
  /** Default selected hug type */
  defaultSelectedType = 'standard',
  /** Callback when a hug type is selected */
  onSelectHugType
}) => {
  const [selectedType, setSelectedType] = useState(defaultSelectedType);
  
  // Update selected type if default changes
  useEffect(() => {
    if (defaultSelectedType !== selectedType) {
      setSelectedType(defaultSelectedType);
    }
  }, [defaultSelectedType, selectedType]);
  
  // Handle icon selection
  const handleSelectIcon = useCallback((type) => {
    setSelectedType(type);
    if (onSelectHugType) {
      onSelectHugType(type);
    }
  }, [onSelectHugType]);
  
  // Get the description for the selected hug type
  const selectedDescription = useMemo(() => 
    getHugTypeDescription(selectedType), 
    [selectedType]
  );
  
  // Memoize the HUG_ICONS keys to avoid re-rendering
  const hugIconKeys = useMemo(() => Object.keys(HUG_ICONS), []);

  return (
    <GalleryContainer data-testid="hug-icon-gallery">
      <GalleryHeader>
        <GalleryTitle>{title}</GalleryTitle>
        <GalleryDescription>{description}</GalleryDescription>
      </GalleryHeader>
      
      <motion.div
        variants={galleryVariants}
        initial="hidden"
        animate="visible"
      >
        <GalleryGrid showSelectedSection={showSelectedSection}>
          {hugIconKeys.map((hugType) => (
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
          <SelectedIconTitle>Selected Hug Type</SelectedIconTitle>
          <HugIcon
            type={selectedType}
            size="lg"
            showBackground
            isSelected
          />
          <SelectedIconDetails>
            <SelectedIconName>{HUG_ICONS[selectedType]?.name || ''}</SelectedIconName>
            <SelectedIconDescription>{selectedDescription}</SelectedIconDescription>
          </SelectedIconDetails>
        </SelectedIconSection>
      )}
    </GalleryContainer>
  );
};

HugIconGallery.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  showSelectedSection: PropTypes.bool,
  defaultSelectedType: PropTypes.oneOf(Object.keys(HUG_ICONS)),
  onSelectHugType: PropTypes.func
};

export default HugIconGallery;