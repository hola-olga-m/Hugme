import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryContainer = styled.div`
  margin: 2rem 0;
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  overflow: hidden;
`;

const GalleryTitle = styled.h2`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 2rem;
  }
`;

const GalleryDescription = styled.p`
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
`;

const HugCard = styled(motion.div)`
  background: ${props => props.bgColor || 'var(--background-color, #f8f9fa)'};
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
`;

const HugImage = styled.div`
  height: 180px;
  width: 100%;
  background: ${props => props.bgColor || 'var(--primary-light)'};
  display: flex;
  justify-content: center;
  align-items: center;
  
  .hug-emoji {
    font-size: 5rem;
    margin-bottom: 0.5rem;
  }
  
  .hug-animation {
    position: relative;
    
    .emoji-left, .emoji-right {
      font-size: 3rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .emoji-left {
      right: 115%;
    }
    
    .emoji-right {
      left: 115%;
    }
  }
`;

const HugInfo = styled.div`
  padding: 1.25rem;
  background: white;
`;

const HugTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const HugDescription = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const HugStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--gray-500);
`;

const HugIcon = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius-lg);
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: var(--primary-color);
  color: white;
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  
  .hug-large-emoji {
    font-size: 6rem;
    text-align: center;
    margin: 1rem 0;
    display: block;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: var(--gray-700);
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: center;
`;

const CloseButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background: var(--primary-dark);
  }
`;

// Cute hug data with emojis
const hugTypes = [
  {
    id: 1,
    title: "Warm Embrace",
    emoji: "🤗",
    leftEmoji: "💫",
    rightEmoji: "✨",
    description: "A heartfelt hug that brings warmth and comfort",
    message: "Sending you warm thoughts and a gentle embrace to make your day brighter!",
    color: "#FFE9C8"
  },
  {
    id: 2,
    title: "Supportive Squeeze",
    emoji: "🫂",
    leftEmoji: "💪",
    rightEmoji: "🌈",
    description: "A supportive hug to help you through tough times",
    message: "You're not alone! This supportive hug comes with the strength you need to keep going.",
    color: "#D4F5FF"
  },
  {
    id: 3,
    title: "Bear Hug",
    emoji: "🧸",
    leftEmoji: "🌟",
    rightEmoji: "✨",
    description: "A big, strong hug that surrounds you completely",
    message: "Wrapping you in a big bear hug! Feel the comfort and know that you're cherished.",
    color: "#FFD1DC"
  },
  {
    id: 4,
    title: "Butterfly Hug",
    emoji: "🦋",
    leftEmoji: "🌼",
    rightEmoji: "🌸",
    description: "A gentle, light hug like butterfly wings",
    message: "Like the gentle flutter of butterfly wings, this soft hug brings peace and calm to your heart.",
    color: "#E0F4FF"
  },
  {
    id: 5,
    title: "Healing Hug",
    emoji: "💖",
    leftEmoji: "✨",
    rightEmoji: "🌟",
    description: "A restorative hug with healing energy",
    message: "This healing hug carries positive energy to help restore your spirit and soothe your soul.",
    color: "#D9F2D9"
  },
  {
    id: 6,
    title: "Celebration Hug",
    emoji: "🎉",
    leftEmoji: "🥳",
    rightEmoji: "🎊",
    description: "A joyful hug to celebrate your achievements",
    message: "Congratulations! This hug celebrates you and all your wonderful accomplishments!",
    color: "#FFE8D6"
  }
];

const CuteHugsGallery = () => {
  const { colorPalette } = useTheme();
  const [selectedHug, setSelectedHug] = useState(null);
  const [shuffledHugs, setShuffledHugs] = useState([]);
  
  // Shuffle the hugs array initially and when the theme changes
  useEffect(() => {
    const shuffled = [...hugTypes].sort(() => Math.random() - 0.5);
    setShuffledHugs(shuffled);
  }, [colorPalette.id]);
  
  const openHugDetail = (hug) => {
    setSelectedHug(hug);
  };
  
  const closeHugDetail = () => {
    setSelectedHug(null);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <GalleryContainer>
      <GalleryTitle>
        <span className="emoji">🤗</span>
        Cute Hugs Gallery
        <span className="emoji">💕</span>
      </GalleryTitle>
      
      <GalleryDescription>
        Express your feelings with these adorable themed hugs. Each hug carries a special 
        meaning and energy to brighten someone's day or provide comfort when needed.
      </GalleryDescription>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <GalleryGrid>
          {shuffledHugs.map((hug) => (
            <HugCard 
              key={hug.id} 
              bgColor={hug.color}
              onClick={() => openHugDetail(hug)}
              variants={itemVariants}
            >
              <HugImage bgColor={hug.color}>
                <div className="hug-animation">
                  <span className="emoji-left">{hug.leftEmoji}</span>
                  <span className="hug-emoji">{hug.emoji}</span>
                  <span className="emoji-right">{hug.rightEmoji}</span>
                </div>
              </HugImage>
              <HugInfo>
                <HugTitle>{hug.title}</HugTitle>
                <HugDescription>{hug.description}</HugDescription>
                <HugStats>
                  <HugIcon>
                    <span>💌</span> Send this hug
                  </HugIcon>
                  <HugIcon>
                    <span>💝</span> Perfect match
                  </HugIcon>
                </HugStats>
              </HugInfo>
            </HugCard>
          ))}
        </GalleryGrid>
      </motion.div>
      
      <AnimatePresence>
        {selectedHug && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeHugDetail}
          >
            <ModalContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>{selectedHug.title}</h3>
              </ModalHeader>
              <ModalBody>
                <span className="hug-large-emoji">{selectedHug.emoji}</span>
                <p>{selectedHug.message}</p>
                <p>
                  Perfect for: moments when you want to share {selectedHug.title.toLowerCase()} with
                  someone who needs it. This style of hug is especially helpful for expressing
                  your care and support in a gentle, meaningful way.
                </p>
              </ModalBody>
              <ModalFooter>
                <CloseButton onClick={closeHugDetail}>
                  Send This Hug
                </CloseButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
};

export default CuteHugsGallery;