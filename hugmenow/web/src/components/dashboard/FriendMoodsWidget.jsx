import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FRIENDS_MOODS } from '../../graphql/queries';
import { SEND_HUG } from '../../graphql/mutations';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiClock, FiSend, FiHeart, FiAlertCircle, FiBell } from 'react-icons/fi';
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
  display: flex;
  align-items: center;
  gap: 8px;
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
  padding-right: 4px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 92, 231, 0.4);
  }
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

  ${props => props.needsSupport && `
    border: 1px solid rgba(255, 59, 48, 0.3);
    background: rgba(255, 59, 48, 0.05);
  `}
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

const NeedsSupportBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
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

  ${props => props.needsSupport && `
    color: #ff3b30;
    font-weight: 600;

    &:hover {
      background: rgba(255, 59, 48, 0.1);
    }
  `}
`;

const LoadingState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`;

const AlertBanner = styled(motion.div)`
  background-color: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #d32f2f;
    flex: 1;
  }
`;

const HugSentToast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4cd964;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'rgba(108, 92, 231, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(108, 92, 231, 0.3)' : '#eee'};
  color: ${props => props.active ? '#6c5ce7' : '#666'};
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
    border-color: rgba(108, 92, 231, 0.3);
  }
`;

// Component
const FriendMoodsWidget = () => {
  const { loading, error, data, refetch } = useQuery(GET_FRIENDS_MOODS, {
    fetchPolicy: 'network-only',
    pollInterval: 60000, // Poll every minute for updates
    onError: (error) => console.error("FriendMoods query error:", error)
  });

  const [expandedMood, setExpandedMood] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'needSupport', 'recent'
  const [showHugSentToast, setShowHugSentToast] = useState(false);
  const [hugSentToUser, setHugSentToUser] = useState(null);
  const [sendingHugTo, setSendingHugTo] = useState(null);

  // GraphQL mutation for sending hugs
  const [sendHug, { loading: sendingHug }] = useMutation(SEND_HUG);

  // Check for friends with bad moods (intensity <= 4)
  const friendsNeedingSupport = data?.publicMoods?.filter(mood => mood.intensity <= 4) || [];
  const hasFriendsNeedingSupport = friendsNeedingSupport.length > 0;

  // Effect to auto-dismiss hug sent toast
  useEffect(() => {
    if (showHugSentToast) {
      const timer = setTimeout(() => {
        setShowHugSentToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showHugSentToast]);

  // Helper functions
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase
      .substring(0, 2);
  };

  const getRandomColor = (userId) => {
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff', '#55efc4'];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Handle sending a hug to a friend
  const handleSendHug = async (event, mood) => {
    event.stopPropagation; // Prevent card expansion

    if (sendingHug) return; // Prevent multiple clicks

    setSendingHugTo(mood.user.id);

    try {
      const response = await sendHug({
        variables: {
          hugInput: {
            recipientId: mood.user.id,
            type: mood.intensity <= 4 ? 'ComfortingHug' : 'StandardHug',
            message: mood.intensity <= 4 
              ? `I noticed you're not feeling great. Sending you a comforting hug!` 
              : `Hey! Just sending a friendly hug your way!`,
          }
        }
      });

      if (response.data?.sendHug) {
        setHugSentToUser(mood.user.name || mood.user.username);
        setShowHugSentToast(true);

        // Refetch moods after a short delay to show updated state
        setTimeout(() => {
          refetch;
        }, 1000);
      }
    } catch (err) {
      console.error('Error sending hug:', err);
    } finally {
      setSendingHugTo(null);
    }
  };

  // Filter moods based on selected filter
  const getFilteredMoods = () => {
    if (!data?.publicMoods) return [];

    let moods = [...data.publicMoods];

    if (filter === 'needSupport') {
      return moods.filter(mood => mood.intensity <= 4);
    } else if (filter === 'recent') {
      return moods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return moods;
  };

  // Render functions
  const renderMoods = () => {
    if (loading) return <LoadingState>Loading friends' moods...</LoadingState>;
    if (error) return <EmptyState>Couldn't load friends' moods. Please try again.</EmptyState>;
    if (!data || !data.publicMoods || data.publicMoods.length === 0) {
      return <EmptyState>No friend moods yet. Add friends to see their moods here!</EmptyState>;
    }

    const filteredMoods = getFilteredMoods;

    if (filteredMoods.length === 0) {
      return <EmptyState>No moods match the current filter.</EmptyState>;
    }

    return (
      <MoodsList>
        {filteredMoods.map(mood => {
          const needsSupport = mood.intensity <= 4;

          return (
            <MoodCard 
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setExpandedMood(expandedMood === mood.id ? null : mood.id)}
              needsSupport={needsSupport}
            >
              {needsSupport && <NeedsSupportBadge><FiAlertCircle size={12} /></NeedsSupportBadge>}

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
                  <MoodScore score={mood.intensity}>{mood.intensity}/10</MoodScore>
                </MoodHeader>
                <MoodNote>
                  {mood.note || "No description provided."}
                </MoodNote>
                <MoodFooter>
                  <TimeStamp>
                    <FiClock size={12} />
                    {formatDistanceToNow(new Date(mood.createdAt), { addSuffix: true })}
                  </TimeStamp>
                  <SendHugButton 
                    onClick={(e) => handleSendHug(e, mood)}
                    needsSupport={needsSupport}
                    disabled={sendingHug && sendingHugTo === mood.user.id}
                  >
                    {sendingHug && sendingHugTo === mood.user.id ? (
                      'Sending...'
                    ) : (
                      <>
                        {needsSupport ? <FiHeart size={12} /> : <FiSend size={12} />}
                        {needsSupport ? 'Send Support' : 'Send Hug'}
                      </>
                    )}
                  </SendHugButton>
                </MoodFooter>
              </MoodContent>
            </MoodCard>
          );
        })}
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
        <Title>
          <FiUser size={16} />
          Friends' Moods
          {hasFriendsNeedingSupport && (
            <motion.span 
              style={{ 
                background: '#ff3b30', 
                color: 'white', 
                borderRadius: '50%', 
                width: '20px', 
                height: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              {friendsNeedingSupport.length}
            </motion.span>
          )}
        </Title>
        <ViewAllButton>
          View All
        </ViewAllButton>
      </WidgetHeader>

      {/* Alert banner for friends needing support */}
      <AnimatePresence>
        {hasFriendsNeedingSupport && (
          <AlertBanner
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          >
            <FiBell size={18} color="#d32f2f" />
            <p>
              {friendsNeedingSupport.length === 1 
                ? `${friendsNeedingSupport[0].user.name || 'Your friend'} is feeling down.` 
                : `${friendsNeedingSupport.length} friends are having a tough time.`} 
              Consider sending support!
            </p>
          </AlertBanner>
        )}
      </AnimatePresence>

      {/* Filter controls */}
      <FilterControls>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === 'needSupport'} 
          onClick={() => setFilter('needSupport')}
        >
          Needs Support {hasFriendsNeedingSupport && `(${friendsNeedingSupport.length})`}
        </FilterButton>
        <FilterButton 
          active={filter === 'recent'} 
          onClick={() => setFilter('recent')}
        >
          Recent
        </FilterButton>
      </FilterControls>

      {renderMoods}

      {/* Toast notification when hug is sent */}
      <AnimatePresence>
        {showHugSentToast && (
          <HugSentToast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiHeart size={16} />
            Hug sent to {hugSentToUser}!
          </HugSentToast>
        )}
      </AnimatePresence>
    </WidgetContainer>
  );
};

export default FriendMoodsWidget;