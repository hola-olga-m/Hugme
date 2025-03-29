import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: var(--text-color, #333);
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  color: var(--text-secondary-color, #666);
  margin: 0;
`;

/**
 * CommunityPage Component
 * Placeholder for the Community functionality
 */
const CommunityPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Community</PageTitle>
        <PageDescription>
          This page will contain the Community functionality.
        </PageDescription>
      </PageHeader>
      
      <div>
        <p>Content for Community will be implemented here.</p>
      </div>
    </PageContainer>
  );
};

export default CommunityPage;