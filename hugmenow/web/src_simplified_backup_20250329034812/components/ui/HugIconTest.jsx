import React from 'react';
import styled from 'styled-components';

// Import the IconComponent to test its PNG rendering capability
import { Icon } from './IconComponent';

const TestWrapper = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.2rem;
    color: #333;
  }
  
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
  }
  
  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    
    .icon-name {
      margin-top: 8px;
      font-size: 0.85rem;
      text-align: center;
    }
  }
`;

const HugIconTest = () => {
  const hugTypes = [
    'ComfortingHug',
    'EnthusiasticHug',
    'GroupHug',
    'StandardHug',
    'SupportiveHug',
    'VirtualHug'
  ];
  
  return (
    <TestWrapper>
      <h2>Hug Icon Tester</h2>
      <div className="icon-grid">
        {hugTypes.map(type => (
          <div key={type} className="icon-item">
            <Icon type={type} size={48} />
            <div className="icon-name">{type}</div>
          </div>
        ))}
      </div>
    </TestWrapper>
  );
};

export default HugIconTest;