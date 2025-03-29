import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Icon from '../Icon/Icon';
import { fadeIn, staggerContainer } from '../../utils/animations';

const GalleryContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 24px;
  }
`;

const HugCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 16px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: ${props => props.theme.shadows[1]};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.primary}10;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows[2]};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HugTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 12px;
  margin-bottom: 4px;
  text-align: center;
  color: ${props => props.theme.colors.text};
`;

const HugDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0;
`;

const IconWrapper = styled.div`
  margin-bottom: 12px;
`;

/**
 * HugGallery component showcasing different hug types with beautiful icons
 * 
 * @param {Object} props - Component props
 * @param {Array} props.hugs - List of hug types to display
 * @param {Function} props.onSelect - Callback when a hug is selected
 * @param {string} props.selectedHugId - Currently selected hug ID
 * @returns {React.ReactElement} Rendered hug gallery
 */
const HugGallery = ({ hugs, onSelect, selectedHugId }) => {
  return (
    <GalleryContainer
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {hugs.map((hug) => (
        <HugCard
          key={hug.id}
          variants={fadeIn}
          onClick={() => onSelect(hug.id)}
          style={{
            border: selectedHugId === hug.id 
              ? `2px solid ${hug.accentColor || '#5e72e4'}` 
              : '2px solid transparent'
          }}
        >
          <IconWrapper>
            <Icon 
              name={hug.iconName}
              category="hugGallery"
              size="120px"
            />
          </IconWrapper>
          <HugTitle>{hug.title}</HugTitle>
          <HugDescription>{hug.description}</HugDescription>
        </HugCard>
      ))}
    </GalleryContainer>
  );
};

HugGallery.propTypes = {
  hugs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      accentColor: PropTypes.string,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedHugId: PropTypes.string,
};

export default HugGallery;