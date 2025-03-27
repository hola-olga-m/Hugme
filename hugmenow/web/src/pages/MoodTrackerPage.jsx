import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import MainLayout from '../layouts/MainLayout';
import { CREATE_MOOD } from '../graphql/mutations';
import { GET_USER_MOODS } from '../graphql/queries';

function MoodTrackerPage {
  const [moodScore, setMoodScore] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [todaysMood, setTodaysMood] = useState(null);
  const navigate = useNavigate;

  // Fetch user's moods
  const { data: moodsData, loading: moodsLoading } = useQuery(GET_USER_MOODS, {
    fetchPolicy: 'network-only'
  });

  // Create mood mutation
  const [createMood] = useMutation(CREATE_MOOD, {
    refetchQueries: [
      { query: GET_USER_MOODS, variables: { limit: 1 } }
    ]
  });

  // Check if user already logged a mood today
  useEffect(() => {
    if (moodsData && moodsData.userMoods && moodsData.userMoods.length > 0) {
      const latestMood = moodsData.userMoods[0];
      const moodDate = new Date(latestMood.createdAt);
      const today = new Date;
      
      if (
        moodDate.getDate === today.getDate &&
        moodDate.getMonth === today.getMonth &&
        moodDate.getFullYear === today.getFullYear
      ) {
        setTodaysMood(latestMood);
      }
    }
  }, [moodsData]);

  const handleMoodSubmit = async (e) => {
    e.preventDefault;
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      await createMood({
        variables: {
          createMoodInput: {
            score: moodScore,
            note: moodNote.trim || undefined,
            isPublic
          }
        }
      });
      
      setSuccess(true);
      // Reset form after successful submission
      setMoodNote('');
      // Wait 2 seconds before redirecting to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to save your mood. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoodChange = (value) => {
    setMoodScore(parseInt(value, 10));
  };

  const getMoodLabel = (score) => {
    if (score <= 2) return 'Very Low';
    if (score <= 4) return 'Low';
    if (score <= 6) return 'Neutral';
    if (score <= 8) return 'Good';
    return 'Excellent';
  };

  const getMoodEmoji = (score) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😔';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😁';
  };

  const getMoodColor = (score) => {
    if (score <= 2) return '#dc3545';  // red
    if (score <= 4) return '#fd7e14';  // orange
    if (score <= 6) return '#ffc107';  // yellow
    if (score <= 8) return '#20c997';  // teal
    return '#28a745';  // green
  };

  return (
    <MainLayout>
      <div className="mood-tracker-page">
        <div className="mood-tracker-header">
          <h1>Mood Tracker</h1>
          <p>Track how you're feeling today and keep your mood streak going.</p>
        </div>

        {moodsLoading ? (
          <div className="loading-spinner centered" />
        ) : todaysMood ? (
          <div className="mood-already-logged">
            <div className="mood-info">
              <div className="mood-emoji-large">{getMoodEmoji(todaysMood.score)}</div>
              <h2>You've already logged your mood today</h2>
              <div className="mood-details">
                <p className="mood-score">
                  Score: <span style={{ color: getMoodColor(todaysMood.score) }}>{todaysMood.score}/10</span> 
                  <span className="mood-label"> - {getMoodLabel(todaysMood.score)}</span>
                </p>
                {todaysMood.note && (
                  <blockquote className="mood-note">"{todaysMood.note}"</blockquote>
                )}
                <p className="mood-timestamp">
                  Logged at {new Date(todaysMood.createdAt).toLocaleTimeString}
                </p>
              </div>
            </div>
            <div className="mood-actions">
              <button onClick={() => navigate('/mood-history')} className="btn btn-primary">
                View Mood History
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="mood-tracker-card">
            <form onSubmit={handleMoodSubmit}>
              {error && (
                <div className="alert alert-error">
                  <div className="alert-content">
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <div className="alert-content">
                    <span>Your mood has been logged successfully! Redirecting to dashboard...</span>
                  </div>
                </div>
              )}

              <div className="mood-tracker-content">
                <div className="mood-slider-container">
                  <div className="mood-emoji-display" style={{ color: getMoodColor(moodScore) }}>
                    {getMoodEmoji(moodScore)}
                  </div>
                  <div className="mood-label-display">
                    {getMoodLabel(moodScore)} <span className="mood-score-display">({moodScore}/10)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodScore}
                    onChange={(e) => handleMoodChange(e.target.value)}
                    className="mood-slider"
                    style={{ 
                      '--track-color': getMoodColor(moodScore),
                      '--thumb-color': getMoodColor(moodScore)
                    }}
                  />
                  <div className="mood-range-labels">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="moodNote">
                    Add a note about how you're feeling (optional)
                  </label>
                  <textarea
                    id="moodNote"
                    className="form-textarea"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What's on your mind today?"
                    maxLength={500}
                  ></textarea>
                  <div className="textarea-counter">
                    {moodNote.length}/500 characters
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      Share this mood entry publicly
                    </span>
                  </div>
                  <div className="form-hint">
                    Public moods are visible to other users in the community feed.
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="btn-loader"></span> Saving...
                      </>
                    ) : (
                      'Save Today\'s Mood'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MoodTrackerPage;