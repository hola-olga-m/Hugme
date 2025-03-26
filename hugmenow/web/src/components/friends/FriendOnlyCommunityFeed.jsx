import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_COMMUNITY_HUG_REQUESTS } from '../../graphql/queries';
import CommunityHugRequestCard from '../hug/CommunityHugRequestCard';

const Container = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
`;

const FilterToggle = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--gray-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--gray-600)'};
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--gray-200)'};
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--gray-100);
  }
  
  .refresh-icon {
    font-size: 1.1rem;
  }
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--gray-500);
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }
  
  .empty-text {
    font-style: italic;
    margin-bottom: 1rem;
  }
`;

const LoadingState = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--gray-500);
`;

const ErrorState = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: var(--danger-color);
  background-color: var(--danger-light);
  border-radius: var(--border-radius-md);
  
  .error-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .error-text {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
`;

const FriendOnlyCommunityFeed = () => {
  const [friendsOnly, setFriendsOnly] = useState(true);
  
  const { loading, error, data, refetch } = useQuery(GET_COMMUNITY_HUG_REQUESTS);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const toggleFilter = (filter) => {
    setFriendsOnly(filter === 'friends');
  };
  
  // This function would filter requests based on whether they're from friends
  // In a real implementation, this would check against a friends list
  const filterRequests = (requests) => {
    if (!friendsOnly) return requests;
    
    // For demonstration purposes, we'd filter based on friend status
    // Currently we're just returning all requests since there's no friend relationship yet
    // In a real implementation, you'd check against a friends list in the user context
    return requests;
  };
  
  if (loading) {
    return (
      <Container>
        <Title>
          <span className="title-icon">💕</span>
          Community Hug Requests
        </Title>
        <LoadingState>Loading community requests...</LoadingState>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Title>
          <span className="title-icon">💕</span>
          Community Hug Requests
        </Title>
        <ErrorState>
          <div className="error-icon">⚠️</div>
          <div className="error-text">Couldn't load community requests</div>
          <div>Please try refreshing or check your connection.</div>
        </ErrorState>
      </Container>
    );
  }
  
  const communityRequests = data?.communityHugRequests || [];
  const filteredRequests = filterRequests(communityRequests);
  
  return (
    <Container>
      <Title>
        <span className="title-icon">💕</span>
        Community Hug Requests
      </Title>
      
      <FilterBar>
        <FilterToggle>
          <FilterButton 
            active={friendsOnly}
            onClick={() => toggleFilter('friends')}
          >
            Friends
          </FilterButton>
          <FilterButton 
            active={!friendsOnly}
            onClick={() => toggleFilter('all')}
          >
            Everyone
          </FilterButton>
        </FilterToggle>
        
        <RefreshButton onClick={handleRefresh}>
          <span className="refresh-icon">🔄</span>
          Refresh
        </RefreshButton>
      </FilterBar>
      
      {filteredRequests.length === 0 ? (
        <EmptyState>
          <div className="empty-icon">🌸</div>
          <div className="empty-text">
            {friendsOnly 
              ? "No community hug requests from friends right now"
              : "No community hug requests right now"}
          </div>
          <div>
            Why not be the first to request a hug from the community?
          </div>
        </EmptyState>
      ) : (
        <RequestsList>
          {filteredRequests.map(request => (
            <CommunityHugRequestCard 
              key={request.id} 
              request={request}
              onSuccess={handleRefresh}
            />
          ))}
        </RequestsList>
      )}
    </Container>
  );
};

export default FriendOnlyCommunityFeed;