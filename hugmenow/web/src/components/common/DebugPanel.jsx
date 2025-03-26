import React, { useState } from 'react';
import styled from 'styled-components';
import AuthStatus from '../AuthStatus';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(250, 250, 250, 0.95);
  border-radius: 8px 0 0 0;
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  box-shadow: -2px -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(calc(100% - 40px))'};
  max-height: 80vh;
  overflow-y: auto;
`;

const DebugHeader = styled.div`
  padding: 10px 15px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DebugTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: #555;
`;

const DebugContent = styled.div`
  padding: 15px;
  min-width: 300px;
`;

/**
 * Debug panel component that can be toggled open/closed
 * Contains debugging information for developers
 */
const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <DebugContainer $isOpen={isOpen}>
      <DebugHeader onClick={togglePanel}>
        <DebugTitle>Debug Panel {isOpen ? '▼' : '▲'}</DebugTitle>
      </DebugHeader>
      
      {isOpen && (
        <DebugContent>
          <AuthStatus />
        </DebugContent>
      )}
    </DebugContainer>
  );
};

export default DebugPanel;