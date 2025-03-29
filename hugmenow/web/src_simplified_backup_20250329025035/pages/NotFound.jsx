import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--gray-100);
  padding: 2rem;
  text-align: center;
`;

const NotFoundTitle = styled.h1`
  font-size: 8rem;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  color: var(--gray-800);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NotFoundText = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 500px;
`;

const NotFoundButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
      <NotFoundText>
        The page you are looking for might have been removed, had its
        name changed, or is temporarily unavailable.
      </NotFoundText>
      <NotFoundButton to="/">Return to Home</NotFoundButton>
    </NotFoundContainer>
  );
};

export default NotFound;