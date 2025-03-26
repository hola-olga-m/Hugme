import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_MOODS } from '../graphql/queries';
import styled from 'styled-components';

const MoodListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const MoodCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    transition: all 0.2s ease;
  }
`;

const MoodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const MoodScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: ${props => {
    // Color based on mood score
    if (props.score >= 8) return '#2ecc71'; // Happy
    if (props.score >= 5) return '#f39c12'; // Okay
    if (props.score >= 3) return '#e67e22'; // Not great
    return '#e74c3c'; // Sad
  }};
`;

const MoodNote = styled.p`
  margin: 0.5rem 0;
  color: #333;
`;

const MoodDate = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-align: right;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: #666;
`;

const Error = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background-color: #fadbd8;
  border-radius: 8px;
`;

// Emoji mapping for mood scores
const getMoodEmoji = (score) => {
  if (score >= 8) return '😄';
  if (score >= 5) return '🙂';
  if (score >= 3) return '😐';
  return '😞';
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PublicMoodList = () => {
  const { loading, error, data } = useQuery(GET_PUBLIC_MOODS);

  if (loading) return <Loading>Loading moods...</Loading>;
  
  if (error) return <Error>Error loading moods: {error.message}</Error>;

  return (
    <MoodListWrapper>
      <h2>Community Moods</h2>
      {data.publicMoods.map(mood => (
        <MoodCard key={mood.id}>
          <MoodHeader>
            <Avatar 
              src={mood.user.avatarUrl || 'https://via.placeholder.com/36'} 
              alt={mood.user.name}
            />
            <UserName>{mood.user.name}</UserName>
          </MoodHeader>
          
          <MoodScore score={mood.score}>
            {getMoodEmoji(mood.score)} Mood: {mood.score}/10
          </MoodScore>
          
          {mood.note && <MoodNote>"{mood.note}"</MoodNote>}
          
          <MoodDate>{formatDate(mood.createdAt)}</MoodDate>
        </MoodCard>
      ))}
      
      {data.publicMoods.length === 0 && (
        <p>No public moods have been shared yet.</p>
      )}
    </MoodListWrapper>
  );
};

export default PublicMoodList;