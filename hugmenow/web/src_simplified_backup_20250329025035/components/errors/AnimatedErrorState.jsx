import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #e53935;
`;

const ErrorDescription = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  color: #616161;
`;

const ErrorGraphic = styled(motion.div)`
  margin-bottom: 2rem;
  max-width: 300px;
  svg {
    width: 100%;
    height: auto;
  }
`;

const ActionButton = styled(motion.button)`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 0.5rem;

  &:hover {
    background-color: #1976d2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3
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
      damping: 12,
      stiffness: 100
    }
  }
};

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// SVG Path animations
const pathVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut"
    }
  }
};

const AnimatedErrorState = ({ 
  title = "Route Error", 
  description = "The page you're looking for might be unavailable or doesn't exist.",
  errorType = "route", // 'route', 'network', 'auth', 'data'
  actionText = "Go Home",
  actionLink = "/",
  secondaryAction = null
}) => {
  
  // Different graphics based on error type
  const errorGraphics = {
    route: (
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <motion.circle cx="250" cy="250" r="150" fill="none" stroke="#e53935" strokeWidth="8" 
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M150 150L350 350" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M350 150L150 350" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    ),
    network: (
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <motion.path d="M100 250 H400" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M250 100 V400" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M175 175 L325 325" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M325 175 L175 325" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.circle cx="250" cy="250" r="120" fill="none" stroke="#e53935" strokeWidth="8" 
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    ),
    auth: (
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <motion.rect x="150" y="200" width="200" height="150" rx="10" fill="none" stroke="#e53935" strokeWidth="8"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M200 200 V150 C200 120 300 120 300 150 V200" fill="none" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.circle cx="250" cy="275" r="25" fill="#e53935"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
      </svg>
    ),
    data: (
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <motion.path d="M150 150 H350 V350 H150 Z" fill="none" stroke="#e53935" strokeWidth="8"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M175 200 H325" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M175 250 H325" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path d="M175 300 H325" stroke="#e53935" strokeWidth="8" strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    )
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ErrorContainer>
        <ErrorGraphic 
          variants={floatVariants}
          animate="animate"
        >
          {errorGraphics[errorType] || errorGraphics.route}
        </ErrorGraphic>
        
        <ErrorTitle variants={itemVariants}>
          {title}
        </ErrorTitle>
        
        <ErrorDescription variants={itemVariants}>
          {description}
        </ErrorDescription>
        
        <div>
          <StyledLink to={actionLink}>
            <ActionButton 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {actionText}
            </ActionButton>
          </StyledLink>
          
          {secondaryAction && (
            <ActionButton 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={secondaryAction.onClick}
              style={{ backgroundColor: '#757575' }}
            >
              {secondaryAction.text}
            </ActionButton>
          )}
        </div>
      </ErrorContainer>
    </motion.div>
  );
};

export default AnimatedErrorState;