import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL operations
const GET_USER_MOODS = gql`
  query GetUserMoods {
    userMoods {
      id
      score
      note
      isPublic
      createdAt
    }
    moodStreak
  }
`;

const CREATE_MOOD = gql`
  mutation CreateMood($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      isPublic
      createdAt
    }
  }
`;

const MoodTracker = () => {
  const { loading, error, data, refetch } = useQuery(GET_USER_MOODS);
  const [createMood] = useMutation(CREATE_MOOD);
  
  const [moods, setMoods] = useState([]);
  const [moodStreak, setMoodStreak] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    score: 3,
    note: '',
    isPublic: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  // Update state when data changes
  useEffect(() => {
    if (data) {
      const sortedMoods = [...data.userMoods].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMoods(sortedMoods);
      setMoodStreak(data.moodStreak);
      
      // Check if mood was recorded today
      const today = new Date().toISOString().split('T')[0];
      const recordedToday = sortedMoods.some(mood => 
        new Date(mood.createdAt).toISOString().split('T')[0] === today
      );
      
      // Hide form if mood already recorded today
      setShowForm(!recordedToday);
    }
  }, [data]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: newValue });
    
    // Clear errors when user makes changes
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const handleMoodScoreChange = (score) => {
    setFormData({ ...formData, score });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.score) {
      errors.score = 'Please select a mood score';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data } = await createMood({
        variables: {
          createMoodInput: {
            score: parseInt(formData.score, 10),
            note: formData.note.trim() || null,
            isPublic: formData.isPublic,
          },
        },
      });
      
      if (data.createMood) {
        // Reset form
        setFormData({
          score: 3,
          note: '',
          isPublic: false,
        });
        
        // Show success message
        setSuccessMessage('Mood recorded successfully!');
        
        // Refetch data to update mood history and streak
        refetch();
        
        // Hide form after submission
        setShowForm(false);
      }
    } catch (error) {
      setFormErrors({ submit: error.message || 'Failed to record mood. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getMoodEmoji = (score) => {
    if (score >= 4) return '😄';
    if (score === 3) return '🙂';
    if (score === 2) return '😐';
    if (score === 1) return '😔';
    return '😢';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };
  
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  if (loading) return <div className="loading">Loading mood tracker...</div>;
  
  if (error) return <div className="error">Error loading mood data: {error.message}</div>;
  
  return (
    <div className="mood-tracker-page">
      <div className="container">
        <h1 className="page-title">Mood Tracker</h1>
        
        <div className="mood-streak-banner">
          <div className="streak-count">
            <span className="streak-value">{moodStreak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
          <div className="streak-message">
            {moodStreak > 0
              ? `You've been tracking your mood for ${moodStreak} days in a row!`
              : 'Start your mood tracking streak today!'}
          </div>
        </div>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {formErrors.submit && (
          <div className="error-message">{formErrors.submit}</div>
        )}
        
        {showForm ? (
          <div className="mood-form-card">
            <h2>How are you feeling today?</h2>
            
            <form onSubmit={handleSubmit} className="mood-form">
              <div className="mood-score-selector">
                <div className="form-group">
                  <label>Select your mood:</label>
                  
                  <div className="mood-score-options">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        className={`mood-score-option ${parseInt(formData.score, 10) === score ? 'selected' : ''}`}
                        onClick={() => handleMoodScoreChange(score)}
                      >
                        <span className="mood-emoji">{getMoodEmoji(score)}</span>
                        <span className="mood-label">
                          {score === 1 && 'Very Low'}
                          {score === 2 && 'Low'}
                          {score === 3 && 'Neutral'}
                          {score === 4 && 'Good'}
                          {score === 5 && 'Excellent'}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {formErrors.score && <div className="field-error">{formErrors.score}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="note">Add a note (optional):</label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="What's on your mind today?"
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  Share this mood with the community
                </label>
                <div className="field-help">
                  When enabled, your mood will be visible to other users (without your personal information)
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Recording...' : 'Record Mood'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mood-recorded-card">
            <h2>Today's Mood Recorded</h2>
            <p>You've already recorded your mood for today. Come back tomorrow!</p>
            
            {moods.length > 0 && (
              <div className="today-mood">
                <div className="mood-emoji large-emoji">{getMoodEmoji(moods[0].score)}</div>
                <div className="mood-details">
                  <p>Score: <strong>{moods[0].score}/5</strong></p>
                  {moods[0].note && <p className="mood-note">"{moods[0].note}"</p>}
                  <p className="mood-time">Recorded: {formatDate(moods[0].createdAt)}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mood-history-section">
          <h2 className="section-title">
            <button 
              className="toggle-history-btn"
              onClick={toggleHistory}
            >
              Mood History {showHistory ? '▲' : '▼'}
            </button>
          </h2>
          
          {showHistory && (
            <div className="mood-history">
              {moods.length > 0 ? (
                <div className="mood-history-list">
                  {moods.map(mood => (
                    <div key={mood.id} className="mood-history-item">
                      <div className="mood-date">
                        {formatDate(mood.createdAt)}
                        {mood.isPublic && <span className="public-tag">Public</span>}
                      </div>
                      <div className="mood-content">
                        <div className="mood-emoji">{getMoodEmoji(mood.score)}</div>
                        <div className="mood-info">
                          <div className="mood-score">Score: {mood.score}/5</div>
                          {mood.note && <div className="mood-note">"{mood.note}"</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No mood history yet. Start tracking your mood today!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;