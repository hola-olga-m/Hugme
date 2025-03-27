import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FRIENDS_MOODS } from '../../graphql/queries';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiSend } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

// Styled Components
const WidgetContainer = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #6c5ce7;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`;

const MoodsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
`;

const MoodCard = styled(motion.div)`
  display: flex;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  gap: 12px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#6c5ce7'};
  color: white;
  font-weight: 600;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MoodContent = styled.div`
  flex: 1;
`;

const MoodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
`;

const MoodScore = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${props => {
    if (props.score >= 8) return '#4cd964';
    if (props.score >= 5) return '#ffcc00';
    return '#ff3b30';
  }};
  color: ${props => {
    if (props.score >= 8) return '#006400';
    if (props.score >= 5) return '#664d00';
    return '#fff';
  }};
`;

const MoodNote = styled.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MoodFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #888;
  font-size: 0.8rem;
`;

const TimeStamp = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SendHugButton = styled.button`
  background: none;
  border: none;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`;

const LoadingState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`;

// Component
const FriendMoodsWidget = () => {
  const { loading, error, data } = useQuery(GET_FRIENDS_MOODS, {
    variables: { limit: 5 },
    fetchPolicy: 'network-only',
  });
  
  const [expandedMood, setExpandedMood] = useState(null);

  // Helper functions
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (userId) => {
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff', '#55efc4'];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Render functions
  const renderMoods = () => {
    if (loading) return <LoadingState>Loading friends' moods...</LoadingState>;
    if (error) return <EmptyState>Couldn't load friends' moods. Please try again.</EmptyState>;
    if (!data || !data.friendsMoods || data.friendsMoods.length === 0) {
      return <EmptyState>No friend moods yet. Add friends to see their moods here!</EmptyState>;
    }

    return (
      <MoodsList>
        {data.friendsMoods.map(mood => (
          <MoodCard 
            key={mood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpandedMood(expandedMood === mood.id ? null : mood.id)}
          >
            <UserAvatar bgColor={getRandomColor(mood.user.id)}>
              {mood.user.avatarUrl ? (
                <img src={mood.user.avatarUrl} alt={mood.user.name} />
              ) : (
                getInitials(mood.user.name || mood.user.username)
              )}
            </UserAvatar>
            <MoodContent>
              <MoodHeader>
                <UserName>{mood.user.name || mood.user.username}</UserName>
                <MoodScore score={mood.score}>{mood.score}/10</MoodScore>
              </MoodHeader>
              <MoodNote>
                {mood.note || "No description provided."}
              </MoodNote>
              <MoodFooter>
                <TimeStamp>
                  <FiClock size={12} />
                  {formatDistanceToNow(new Date(mood.createdAt), { addSuffix: true })}
                </TimeStamp>
                <SendHugButton>
                  <FiSend size={12} />
                  Send Hug
                </SendHugButton>
              </MoodFooter>
            </MoodContent>
          </MoodCard>
        ))}
      </MoodsList>
    );
  };

  return (
    <WidgetContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <WidgetHeader>
        <Title>Friends' Moods</Title>
        <ViewAllButton>
          View All
        </ViewAllButton>
      </WidgetHeader>
      {renderMoods()}
    </WidgetContainer>
  );
};

export default FriendMoodsWidget;