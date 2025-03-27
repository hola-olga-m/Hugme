import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Styled components
const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #2a0845 0%, #6441a5 100%);
  color: white;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(to right, #cb9eff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Description = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 20px;
  line-height: 1.5;
  color: #e0c3ff;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  background: ${props => props.active ? '#9b59b6' : 'rgba(155, 89, 182, 0.3)'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #9b59b6;
    transform: scale(1.05);
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const IconCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const IconImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const IconName = styled.h3`
  font-size: 1rem;
  margin: 0;
  text-align: center;
  color: #ffffff;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-top: 5px solid #9b59b6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NothingFound = styled.div`
  padding: 40px;
  text-align: center;
  color: #e0c3ff;
  font-size: 1.2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const VariantBadge = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(155, 89, 182, 0.8);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
`;

const IconCardContainer = styled.div`
  position: relative;
`;

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 12
    }
  }
};

// Component
const PurpleHugGallery = () => {
  const [icons, setIcons] = useState([]);
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hoverState, setHoverState] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch('/assets/icons/png-icons/purple-icons-list.json');
        if (!response.ok) {
          throw new Error('Failed to fetch icons list');
        }
        
        const data = await response.json();
        console.log('Loaded icons:', data.length);
        setIcons(data);
        setFilteredIcons(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading icons:', error);
        setLoading(false);
      }
    };
    
    fetchIcons();
  }, []);
  
  // Handle filter changes
  useEffect(() => {
    if (icons.length === 0) return;
    
    let filtered = [...icons];
    
    switch(filter) {
      case 'special':
        filtered = icons.filter(icon => icon.isSpecial);
        break;
      case 'standard':
        filtered = icons.filter(icon => !icon.isSpecial);
        break;
      case 'variants':
        filtered = icons.filter(icon => icon.variant);
        break;
      case 'original':
        filtered = icons.filter(icon => !icon.variant);
        break;
      default:
        // 'all' - no filtering needed
        break;
    }
    
    setFilteredIcons(filtered);
  }, [filter, icons]);
  
  // Handle hover state for animation
  const handleMouseEnter = (iconId) => {
    setHoverState({...hoverState, [iconId]: true});
  };
  
  const handleMouseLeave = (iconId) => {
    setHoverState({...hoverState, [iconId]: false});
  };
  
  // Get appropriate image source
  const getImageSrc = (icon, isHovered) => {
    if (isHovered) {
      // Return animated version (showing frame 3 which has the scale effect)
      return `/assets/icons/png-icons/${icon.animationPrefix}3.png`;
    }
    return `/assets/icons/png-icons/${icon.filename}`;
  };
  
  return (
    <GalleryContainer>
      <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
      
      <Header>
        <Title>Purple Hug Gallery</Title>
        <Description>
          Explore our collection of purple-themed, emotionally intelligent hug icons designed to
          provide comfort and express empathy through digital interaction.
        </Description>
        
        <FilterContainer>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All Icons
          </FilterButton>
          <FilterButton 
            active={filter === 'special'} 
            onClick={() => setFilter('special')}
          >
            Special Hugs
          </FilterButton>
          <FilterButton 
            active={filter === 'standard'} 
            onClick={() => setFilter('standard')}
          >
            Standard Icons
          </FilterButton>
          <FilterButton 
            active={filter === 'variants'} 
            onClick={() => setFilter('variants')}
          >
            Variants
          </FilterButton>
          <FilterButton 
            active={filter === 'original'} 
            onClick={() => setFilter('original')}
          >
            Original Icons
          </FilterButton>
        </FilterContainer>
      </Header>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : filteredIcons.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          <GridContainer>
            {filteredIcons.map((icon, index) => {
              const iconId = `${icon.name}-${icon.variant || 'main'}-${index}`;
              const isHovered = hoverState[iconId];
              
              return (
                <IconCardContainer key={iconId}>
                  <IconCard
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => handleMouseEnter(iconId)}
                    onMouseLeave={() => handleMouseLeave(iconId)}
                  >
                    <IconImage 
                      src={getImageSrc(icon, isHovered)} 
                      alt={`${icon.name} ${icon.variant ? `(Variant ${icon.variant})` : ''}`}
                    />
                    <IconName>
                      {icon.name}
                    </IconName>
                  </IconCard>
                  {icon.variant && (
                    <VariantBadge>V{icon.variant}</VariantBadge>
                  )}
                </IconCardContainer>
              );
            })}
          </GridContainer>
        </motion.div>
      ) : (
        <NothingFound>
          No icons found matching the selected filter.
        </NothingFound>
      )}
    </GalleryContainer>
  );
};

export default PurpleHugGallery;