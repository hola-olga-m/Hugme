import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GET_USER_MOODS, GET_MOOD_STREAK } from '../graphql/queries';
import { CREATE_MOOD, UPDATE_MOOD, REMOVE_MOOD } from '../graphql/mutations';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorMessage from '../components/common/ErrorMessage';

// Styled components
const MoodTrackerContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const MoodTrackerHeader = styled.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`;

const MoodTrackerContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
`;

const MoodEntryCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`;

const MoodSlider = styled.div`
  margin: 2rem 0;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gray-700);
  }
  
  .slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .emoji-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  input[type="range"] {
    width: 100%;
    margin: 1rem 0;
  }
  
  .mood-label {
    font-weight: 500;
    margin-top: 0.5rem;
    color: var(--primary-color);
  }
`;

const MoodNote = styled.div`
  margin: 1.5rem 0;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gray-700);
  }
  
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    resize: vertical;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const MoodPrivacy = styled.div`
  margin: 1.5rem 0;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gray-700);
  }
  
  .toggle-container {
    display: flex;
    align-items: center;
  }
  
  .toggle {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
    margin-right: 1rem;
    
    input {
      opacity: 0;
      width: 0;
      height: 0;
      
      &:checked + .slider {
        background-color: var(--primary-color);
      }
      
      &:checked + .slider:before {
        transform: translateX(24px);
      }
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--gray-300);
      transition: .4s;
      border-radius: 34px;
      
      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
    }
  }
  
  .toggle-label {
    color: var(--gray-700);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const MoodHistorySection = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
`;

const MoodHistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
  
  .streak {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    font-weight: 500;
    
    span {
      margin-left: 0.5rem;
    }
  }
`;

const MoodHistoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const MoodHistoryItem = styled.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

const MoodItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MoodItemDate = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`;

const MoodItemContent = styled.div`
  display: flex;
  align-items: flex-start;
  
  .emoji {
    font-size: 2rem;
    margin-right: 1rem;
  }
  
  .mood-details {
    flex: 1;
  }
  
  .mood-score {
    font-weight: 500;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
  }
  
  .mood-note {
    font-size: 0.9rem;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
  }
  
  .is-public {
    font-size: 0.8rem;
    color: var(--primary-color);
  }
`;

const MoodItemActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  
  button {
    background: none;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .edit-btn {
    color: var(--primary-color);
  }
  
  .delete-btn {
    color: var(--danger-color);
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
const getMoodEmoji = (score) => {
  const emojis = ['😢', '😟', '😐', '🙂', '😄'];
  return emojis[Math.min(Math.floor(score) - 1, 4)];
};

const getMoodLabel = (score) => {
  const labels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
  return labels[Math.min(Math.floor(score) - 1, 4)];
};

const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MoodTracker = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moodScore, setMoodScore] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [editingMood, setEditingMood] = useState(null);
  
  // GraphQL queries and mutations
  const { data: moodsData, loading: moodsLoading, error: moodsError, refetch: refetchMoods } = useQuery(GET_USER_MOODS);
  const { data: streakData, loading: streakLoading, error: streakError, refetch: refetchStreak } = useQuery(GET_MOOD_STREAK);
  
  const [createMood, { loading: createLoading }] = useMutation(CREATE_MOOD, {
    onCompleted: () => {
      resetForm();
      refetchMoods();
      refetchStreak();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [updateMood, { loading: updateLoading }] = useMutation(UPDATE_MOOD, {
    onCompleted: () => {
      resetForm();
      refetchMoods();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [removeMood, { loading: removeLoading }] = useMutation(REMOVE_MOOD, {
    onCompleted: () => {
      refetchMoods();
      refetchStreak();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  useEffect(() => {
    // Set loading state based on all query statuses
    setLoading(moodsLoading || streakLoading);
    
    // Set error if any query has an error
    if (moodsError) setError(moodsError.message);
    if (streakError) setError(streakError.message);
  }, [moodsLoading, streakLoading, moodsError, streakError]);
  
  const resetForm = () => {
    setMoodScore(3);
    setMoodNote('');
    setIsPublic(true);
    setEditingMood(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingMood) {
      await updateMood({
        variables: {
          updateMoodInput: {
            id: editingMood.id,
            score: moodScore,
            note: moodNote,
            isPublic
          }
        }
      });
    } else {
      await createMood({
        variables: {
          createMoodInput: {
            score: moodScore,
            note: moodNote,
            isPublic
          }
        }
      });
    }
  };
  
  const handleEditMood = (mood) => {
    setEditingMood(mood);
    setMoodScore(mood.score);
    setMoodNote(mood.note || '');
    setIsPublic(mood.isPublic);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleDeleteMood = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      await removeMood({
        variables: { id }
      });
    }
  };
  
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <LoadingScreen text="Loading mood tracker..." />;
  }
  
  const userMoods = moodsData?.userMoods || [];
  const moodStreak = streakData?.moodStreak || 0;
  
  return (
    <MoodTrackerContainer>
      <MoodTrackerHeader>
        <Logo onClick={navigateToDashboard}>HugMeNow</Logo>
      </MoodTrackerHeader>
      
      <MoodTrackerContent>
        <PageTitle>Mood Tracker</PageTitle>
        
        {error && <ErrorMessage error={error} />}
        
        <MoodEntryCard>
          <h2>{editingMood ? 'Edit Mood Entry' : 'How Are You Feeling Today?'}</h2>
          
          <form onSubmit={handleSubmit}>
            <MoodSlider>
              <h3>Your Mood</h3>
              <div className="slider-container">
                <div className="emoji-container">
                  <span>😢</span>
                  <span>😟</span>
                  <span>😐</span>
                  <span>🙂</span>
                  <span>😄</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={moodScore}
                  onChange={(e) => setMoodScore(parseInt(e.target.value))}
                />
                <div className="mood-label">
                  {getMoodEmoji(moodScore)} {getMoodLabel(moodScore)}
                </div>
              </div>
            </MoodSlider>
            
            <MoodNote>
              <h3>Add a Note (Optional)</h3>
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="What's making you feel this way?"
                maxLength={500}
              />
            </MoodNote>
            
            <MoodPrivacy>
              <h3>Privacy</h3>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                  />
                  <span className="slider"></span>
                </label>
                <span className="toggle-label">
                  {isPublic ? 'Share with community' : 'Keep private'}
                </span>
              </div>
            </MoodPrivacy>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <SubmitButton
                type="submit"
                disabled={createLoading || updateLoading}
              >
                {editingMood ? 'Update' : 'Save'} Mood
              </SubmitButton>
              
              {editingMood && (
                <SubmitButton
                  type="button"
                  onClick={resetForm}
                  style={{ backgroundColor: 'var(--gray-500)' }}
                >
                  Cancel
                </SubmitButton>
              )}
            </div>
          </form>
        </MoodEntryCard>
        
        <MoodHistorySection>
          <MoodHistoryHeader>
            <h2>Your Mood History</h2>
            <div className="streak">
              <span>🔥 {moodStreak} Day Streak</span>
            </div>
          </MoodHistoryHeader>
          
          {userMoods.length === 0 ? (
            <EmptyState>
              <p>You haven't tracked any moods yet.</p>
              <p>Use the form above to record your first mood entry!</p>
            </EmptyState>
          ) : (
            <MoodHistoryList>
              {userMoods.map((mood) => (
                <MoodHistoryItem key={mood.id}>
                  <MoodItemHeader>
                    <MoodItemDate>{getFormattedDate(mood.createdAt)}</MoodItemDate>
                  </MoodItemHeader>
                  
                  <MoodItemContent>
                    <div className="emoji">{getMoodEmoji(mood.score)}</div>
                    <div className="mood-details">
                      <div className="mood-score">{getMoodLabel(mood.score)}</div>
                      {mood.note && <div className="mood-note">{mood.note}</div>}
                      <div className="is-public">
                        {mood.isPublic ? 'Shared with community' : 'Private'}
                      </div>
                    </div>
                  </MoodItemContent>
                  
                  <MoodItemActions>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditMood(mood)}
                      disabled={removeLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMood(mood.id)}
                      disabled={removeLoading}
                    >
                      Delete
                    </button>
                  </MoodItemActions>
                </MoodHistoryItem>
              ))}
            </MoodHistoryList>
          )}
        </MoodHistorySection>
      </MoodTrackerContent>
    </MoodTrackerContainer>
  );
};

export default MoodTracker;