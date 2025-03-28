import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_MOODS } from '../../graphql/queries';

const FeedContainer = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const FeedTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .title-icon {
    color: var(--primary-color);
  }
`;

const EmptyFeed = styled.div`
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
  }
`;

const MoodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MoodCard = styled.div`
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  background-color: var(--gray-50);
  box-shadow: var(--shadow-xs);
  transition: var(--transition-base);

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const MoodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 1rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
  color: var(--gray-800);
`;

const MoodDate = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`;

const MoodScore = styled.div`
  font-size: 1.75rem;
`;

const MoodContent = styled.div`
  margin-top: 1rem;
  color: var(--gray-700);
  font-size: 0.95rem;
  line-height: 1.5;

  .quote {
    margin: 0.5rem 0;
    padding-left: 1rem;
    border-left: 3px solid var(--primary-light);
    font-style: italic;
  }
`;

const MoodActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
  padding-top: 1rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-base);

  &:hover {
    background-color: var(--gray-100);
    color: var(--primary-color);
  }

  .button-icon {
    font-size: 1.2rem;
  }
`;

const FriendMoodFeed = ({ friendsOnly = true }) => {
  const { loading, error, data } = useQuery(GET_PUBLIC_MOODS);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase
      .substring(0, 2);
  };

  const getEmojiForScore = (intensity) => {
    const score = Math.min(Math.ceil(intensity / 2), 5);
    switch (score) {
      case 5: return '😄';
      case 4: return '😊';
      case 3: return '😐';
      case 2: return '😔';
      case 1: return '😢';
      default: return '❓';
    }
  };

  const filterMoods = (moods) => {
    if (!friendsOnly) return moods;
    // In a real implementation, this would filter by friend connections
    // For now, we're showing all public moods
    return moods;
  };

  if (loading) {
    return (
      <FeedContainer>
        <FeedTitle>
          <span className="title-icon">🧠</span>
          {friendsOnly ? 'Friends\' Mood Feed' : 'Community Mood Feed'}
        </FeedTitle>
        <EmptyFeed>
          <div className="empty-text">Loading moods...</div>
        </EmptyFeed>
      </FeedContainer>
    );
  }

  if (error) {
    return (
      <FeedContainer>
        <FeedTitle>
          <span className="title-icon">🧠</span>
          {friendsOnly ? 'Friends\' Mood Feed' : 'Community Mood Feed'}
        </FeedTitle>
        <EmptyFeed>
          <div className="empty-icon">⚠️</div>
          <div className="empty-text">Couldn't load mood feed</div>
        </EmptyFeed>
      </FeedContainer>
    );
  }

  const moods = data?.publicMoods || [];
  const filteredMoods = filterMoods(moods);

  return (
    <FeedContainer>
      <FeedTitle>
        <span className="title-icon">🧠</span>
        {friendsOnly ? 'Friends\' Mood Feed' : 'Community Mood Feed'}
      </FeedTitle>

      {filteredMoods.length === 0 ? (
        <EmptyFeed>
          <div className="empty-icon">🌱</div>
          <div className="empty-text">No mood updates yet</div>
        </EmptyFeed>
      ) : (
        <MoodList>
          {filteredMoods.map(mood => (
            <MoodCard key={mood.id}>
              <MoodHeader>
                <UserInfo>
                  <Avatar>
                    {mood.user?.avatarUrl ? (
                      <img src={mood.user.avatarUrl} alt={mood.user.name} />
                    ) : (
                      getInitials(mood.user?.name || mood.user?.username)
                    )}
                  </Avatar>
                  <UserDetails>
                    <UserName>{mood.user?.name || mood.user?.username}</UserName>
                    <MoodDate>{formatDate(mood.createdAt)}</MoodDate>
                  </UserDetails>
                </UserInfo>
                <MoodScore>{getEmojiForScore(mood.intensity)}</MoodScore>
              </MoodHeader>

              {mood.note && (
                <MoodContent>
                  <div className="quote">{mood.note}</div>
                </MoodContent>
              )}

              <MoodActions>
                <ActionButton>
                  <span className="button-icon">🤗</span>
                  Send a Hug
                </ActionButton>
                <ActionButton>
                  <span className="button-icon">💬</span>
                  Comment
                </ActionButton>
              </MoodActions>
            </MoodCard>
          ))}
        </MoodList>
      )}
    </FeedContainer>
  );
};

export default FriendMoodFeed;