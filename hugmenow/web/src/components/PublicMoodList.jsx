import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_MOODS } from '../graphql/queries';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

// Styled components
const PublicMoodsContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`;

const MoodsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MoodsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MoodCard = styled.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`;

const MoodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MoodScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 1.5rem;
  }
  
  .label {
    font-weight: 500;
    color: var(--gray-800);
  }
`;

const MoodDate = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`;

const MoodNote = styled.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--gray-600);
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.7rem;
    margin-right: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`;

// Helper functions
const getMoodEmoji = (intensity) => {
  const emojis = ['😢', '😟', '😐', '🙂', '😄'];
  return emojis[Math.min(Math.floor(intensity/2) - 1, 4)];
};

const getMoodLabel = (intensity) => {
  const labels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
  return labels[Math.min(Math.floor(intensity/2) - 1, 4)];
};

const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const PublicMoodList = () => {
  const { loading, error, data, refetch } = useQuery(GET_PUBLIC_MOODS);
  
  if (loading) return <LoadingSpinner text="Loading public moods..." />;
  
  if (error) return <ErrorMessage error={error} />;
  
  // Extract moods from the nested structure in the GraphQL response
  const publicMoods = data?.allMoods?.nodes || [];
  
  if (publicMoods.length === 0) {
    return (
      <PublicMoodsContainer>
        <MoodsHeader>
          <h2>Community Moods</h2>
          <RefreshButton onClick={() => refetch()}>
            <span>Refresh</span>
          </RefreshButton>
        </MoodsHeader>
        <EmptyState>
          <p>No public moods have been shared yet.</p>
          <p>The community mood board will populate as users share their feelings.</p>
        </EmptyState>
      </PublicMoodsContainer>
    );
  }
  
  return (
    <PublicMoodsContainer>
      <MoodsHeader>
        <h2>Community Moods</h2>
        <RefreshButton onClick={() => refetch()}>
          <span>Refresh</span>
        </RefreshButton>
      </MoodsHeader>
      
      <MoodsList>
        {publicMoods.map((mood) => (
          <MoodCard key={mood.id}>
            <MoodHeader>
              <MoodScore>
                <span className="emoji">{getMoodEmoji(mood.intensity)}</span>
                <span className="label">{getMoodLabel(mood.intensity)}</span>
              </MoodScore>
              <MoodDate>{getFormattedDate(mood.createdAt)}</MoodDate>
            </MoodHeader>
            
            {mood.note && <MoodNote>{mood.note}</MoodNote>}
            
            <UserInfo>
              <div className="avatar">{getInitials(mood.userByUserId?.name)}</div>
              <span>{mood.userByUserId?.name || 'Anonymous User'}</span>
            </UserInfo>
          </MoodCard>
        ))}
      </MoodsList>
    </PublicMoodsContainer>
  );
};

export default PublicMoodList;