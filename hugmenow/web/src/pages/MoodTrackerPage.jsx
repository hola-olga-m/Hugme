import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_MOOD } from '../graphql/mutations';

const MoodTrackerPage = () => {
  const [moodScore, setMoodScore] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [createMood, { loading }] = useMutation(CREATE_MOOD, {
    onCompleted: () => {
      navigate('/dashboard', { 
        state: { notification: 'Mood tracked successfully!' } 
      });
    },
    onError: (error) => {
      console.error('Error creating mood:', error);
      setError('Failed to save your mood. Please try again.');
    }
  });

  const handleMoodChange = (e) => {
    setMoodScore(parseInt(e.target.value, 10));
  };

  const handleNoteChange = (e) => {
    setMoodNote(e.target.value);
  };

  const handleIsPublicChange = (e) => {
    setIsPublic(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await createMood({
        variables: {
          createMoodInput: {
            score: moodScore,
            note: moodNote,
            isPublic
          }
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const getMoodLabel = (score) => {
    const labels = {
      1: 'Very Bad',
      2: 'Bad',
      3: 'Not Good',
      4: 'Okay',
      5: 'Neutral',
      6: 'Decent',
      7: 'Good',
      8: 'Very Good',
      9: 'Great',
      10: 'Excellent'
    };
    return labels[score] || '';
  };

  const getMoodEmoji = (score) => {
    const emojis = {
      1: '😭',
      2: '😢',
      3: '😟',
      4: '😕',
      5: '😐',
      6: '🙂',
      7: '😊',
      8: '😃',
      9: '😁',
      10: '🤩'
    };
    return emojis[score] || '';
  };

  return (
    <div className="mood-tracker-page">
      <div className="mood-tracker-container">
        <h1 className="page-title">How are you feeling today?</h1>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-content">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mood-form">
          <div className="mood-slider-container">
            <div className="mood-display">
              <span className="mood-emoji">{getMoodEmoji(moodScore)}</span>
              <span className="mood-label">{getMoodLabel(moodScore)}</span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={handleMoodChange}
              className="mood-slider"
            />
            
            <div className="mood-scale-labels">
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
            <label htmlFor="moodNote" className="form-label">
              Add a note about how you're feeling (optional)
            </label>
            <textarea
              id="moodNote"
              value={moodNote}
              onChange={handleNoteChange}
              className="form-textarea"
              placeholder="What's making you feel this way?"
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-group form-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleIsPublicChange}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Share this mood publicly (anonymously)</span>
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-loader"></span>
                  Saving...
                </>
              ) : 'Save Mood'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodTrackerPage;