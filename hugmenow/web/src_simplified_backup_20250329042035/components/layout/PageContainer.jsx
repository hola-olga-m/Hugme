import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

/**
 * PageContainer component that provides consistent container styling
 * for page content with proper margins and responsive behavior.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render inside the container
 * @returns {JSX.Element} - PageContainer component
 */
const PageContainer = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default PageContainer;