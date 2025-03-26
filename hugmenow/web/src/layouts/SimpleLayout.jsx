import React from 'react';
import styled from 'styled-components';

/**
 * SimpleLayout Component
 * 
 * A minimal layout for static pages without authentication requirements
 * This layout doesn't include navigation bars or authenticated components
 */
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
`;

const SimpleLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default SimpleLayout;