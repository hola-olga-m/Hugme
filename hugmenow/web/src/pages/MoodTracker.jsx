import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MOOD } from '../graphql/mutations';
import { GET_USER_MOODS, GET_MOOD_STREAK } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoadingScreen from '../components/common/LoadingScreen';

const MoodTracker = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State for new mood entry
  const [moodScore, setMoodScore] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch user moods
  const { loading: loadingMoods, data: moodData, refetch: refetchMoods } = useQuery(GET_USER_MOODS, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  // Fetch mood streak
  const { loading: loadingStreak, data: streakData, refetch: refetchStreak } = useQuery(GET_MOOD_STREAK, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  // Create mood mutation
  const [createMood] = useMutation(CREATE_MOOD);
  
  // Handle mood score selection
  const handleScoreSelect = (score) => {
    setMoodScore(score);
  };
  
  // Handle note input
  const handleNoteChange = (e) => {
    setMoodNote(e.target.value);
  };
  
  // Handle public/private toggle
  const handlePublicToggle = () => {
    setIsPublic(prev => !prev);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('error.notAuthenticated'));
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Create mood entry
      await createMood({
        variables: {
          createMoodInput: {
            score: moodScore,
            note: moodNote.trim() || null,
            isPublic
          }
        }
      });
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setMoodNote('');
      
      // Refetch mood data
      refetchMoods();
      refetchStreak();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || t('error.unknownError'));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get mood text based on score
  const getMoodText = (score) => {
    if (score >= 9) return t('moods.excellent');
    if (score >= 7) return t('moods.great');
    if (score >= 5) return t('moods.good');
    if (score >= 3) return t('moods.okay');
    return t('moods.notGood');
  };
  
  // Show loading screen if moods are loading
  if (loadingMoods || loadingStreak) {
    return (
      <AppLayout>
        <LoadingScreen message={t('moodTracker.loading')} />
      </AppLayout>
    );
  }
  
  // Extract data
  const moods = moodData?.userMoods || [];
  const streak = streakData?.moodStreak || 0;
  
  return (
    <AppLayout>
      <div className="mood-tracker-container">
        <div className="mood-tracker-header">
          <h1>{t('moodTracker.title')}</h1>
          <p>{t('moodTracker.subtitle')}</p>
        </div>
        
        <div className="mood-streak-banner">
          <div className="streak-icon">🔥</div>
          <div className="streak-text">
            <h3>{t('moodTracker.currentStreak')}</h3>
            <p>{t('moodTracker.streakCount', { count: streak })}</p>
          </div>
        </div>
        
        <div className="mood-entry-card">
          <h2>{t('moodTracker.howAreYou')}</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {t('moodTracker.moodSaved')}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mood-form">
            <div className="mood-score">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <div 
                  key={score} 
                  className={`mood-score-item ${score === moodScore ? 'selected' : ''}`}
                  onClick={() => handleScoreSelect(score)}
                >
                  <div className="mood-score-icon">
                    {score <= 2 ? '😞' : 
                     score <= 4 ? '😕' : 
                     score <= 6 ? '😐' : 
                     score <= 8 ? '🙂' : '😁'}
                  </div>
                  <div className="mood-score-number">{score}</div>
                </div>
              ))}
            </div>
            
            <div className="mood-description">
              <p>{t('moodTracker.youSelected')} <strong>{moodScore}/10</strong> - {getMoodText(moodScore)}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="moodNote">{t('moodTracker.addNote')}</label>
              <textarea
                id="moodNote"
                name="moodNote"
                value={moodNote}
                onChange={handleNoteChange}
                placeholder={t('moodTracker.notePlaceholder')}
                rows={4}
              ></textarea>
            </div>
            
            <div className="form-group mood-visibility">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={handlePublicToggle}
                />
                <span>{t('moodTracker.sharePublicly')}</span>
              </label>
              <p className="form-help-text">{t('moodTracker.shareDescription')}</p>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={submitting}
            >
              {submitting ? t('common.saving') : t('moodTracker.saveMood')}
            </button>
          </form>
        </div>
        
        <div className="mood-history">
          <h2>{t('moodTracker.recentMoods')}</h2>
          
          {moods.length === 0 ? (
            <div className="empty-state">
              <p>{t('moodTracker.noMoods')}</p>
            </div>
          ) : (
            <div className="mood-list">
              {moods.slice(0, 5).map(mood => (
                <div key={mood.id} className="mood-item">
                  <div className="mood-item-header">
                    <div className="mood-item-score">
                      <span className="score-number">{mood.score}</span>
                      <span className="score-label">{getMoodText(mood.score)}</span>
                    </div>
                    <div className="mood-item-date">
                      {new Date(mood.createdAt).toLocaleDateString()} - {new Date(mood.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {mood.note && (
                    <div className="mood-item-note">
                      <p>{mood.note}</p>
                    </div>
                  )}
                  
                  <div className="mood-item-visibility">
                    {mood.isPublic ? (
                      <span className="public-badge">{t('moodTracker.public')}</span>
                    ) : (
                      <span className="private-badge">{t('moodTracker.private')}</span>
                    )}
                  </div>
                </div>
              ))}
              
              {moods.length > 5 && (
                <div className="mood-list-more">
                  <button className="btn btn-outline">
                    {t('moodTracker.viewMore')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MoodTracker;