import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    color: #6a4c93;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .reference-image {
    display: block;
    max-width: 100%;
    margin: 0 auto 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const IconCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    margin: 10px 0;
    color: #495057;
    text-align: center;
  }
  
  img {
    width: 120px;
    height: 120px;
  }
  
  .animation-container {
    width: 120px;
    height: 120px;
    position: relative;
    overflow: hidden;
  }
  
  .animation-frame {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.2s ease;
    
    &.active {
      opacity: 1;
    }
  }
`;

const AnimationControls = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  
  button {
    padding: 5px 10px;
    background: #6a4c93;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
      background: #563d7c;
    }
    
    &:disabled {
      background: #adb5bd;
      cursor: not-allowed;
    }
  }
`;

const TopControls = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const HumanHugGallery = () => {
  const [hugTypes, setHugTypes] = useState([
    'BearHug', 'Supporting', 'Comforting', 'Loving', 'Celebrating', 'Festive',
    'Caring', 'Teasing', 'Teasing2', 'Inviting', 'Inviting2', 'Moody'
  ]);
  const [activeAnimations, setActiveAnimations] = useState({});
  const [isPlaying, setIsPlaying] = useState({});
  
  // Function to handle animation playback
  const handleAnimation = (hugType, action) => {
    if (action === 'play') {
      setIsPlaying(prev => ({ ...prev, [hugType]: true }));
    } else if (action === 'pause') {
      setIsPlaying(prev => ({ ...prev, [hugType]: false }));
    }
  };
  
  // Animation frames management
  useEffect(() => {
    const animationIntervals = {};
    
    Object.entries(isPlaying).forEach(([hugType, playing]) => {
      if (playing) {
        let frameIndex = 0;
        
        animationIntervals[hugType] = setInterval(() => {
          frameIndex = (frameIndex + 1) % 6; // 6 frames per animation
          setActiveAnimations(prev => ({
            ...prev,
            [hugType]: frameIndex + 1 // Frame indices start at 1
          }));
        }, 150); // Frame rate
      } else if (animationIntervals[hugType]) {
        clearInterval(animationIntervals[hugType]);
        delete animationIntervals[hugType];
      }
    });
    
    return () => {
      // Clean up all intervals
      Object.values(animationIntervals).forEach(interval => clearInterval(interval));
    };
  }, [isPlaying]);
  
  // Play/pause all animations
  const handleAllAnimations = (action) => {
    const newState = {};
    hugTypes.forEach(type => {
      newState[type] = action === 'play';
    });
    setIsPlaying(newState);
  };
  
  return (
    <GalleryContainer>
      <h1>Human Hug Icons Gallery</h1>
      
      <img 
        className="reference-image" 
        src="/images/reference-human-hugs.png" 
        alt="Human hug icons reference grid" 
      />
      
      <TopControls>
        <button onClick={() => handleAllAnimations('play')}>
          Play All Animations
        </button>
        <button onClick={() => handleAllAnimations('pause')}>
          Pause All Animations
        </button>
      </TopControls>
      
      <IconsGrid>
        {hugTypes.map(hugType => (
          <IconCard key={hugType}>
            <h3>{hugType}</h3>
            
            {isPlaying[hugType] ? (
              <div className="animation-container">
                {[1, 2, 3, 4, 5, 6].map(frame => (
                  <img
                    key={`${hugType}-frame-${frame}`}
                    src={`/assets/icons/png-icons/human-${hugType}-animated_frame${frame}.png`}
                    alt={`${hugType} animation frame ${frame}`}
                    className={`animation-frame ${activeAnimations[hugType] === frame ? 'active' : ''}`}
                  />
                ))}
              </div>
            ) : (
              <img
                src={`/assets/icons/png-icons/human-${hugType}.png`}
                alt={`${hugType} icon`}
              />
            )}
            
            <AnimationControls>
              <button 
                onClick={() => handleAnimation(hugType, 'play')}
                disabled={isPlaying[hugType]}
              >
                Play
              </button>
              <button 
                onClick={() => handleAnimation(hugType, 'pause')}
                disabled={!isPlaying[hugType]}
              >
                Pause
              </button>
            </AnimationControls>
          </IconCard>
        ))}
      </IconsGrid>
    </GalleryContainer>
  );
};

export default HumanHugGallery;