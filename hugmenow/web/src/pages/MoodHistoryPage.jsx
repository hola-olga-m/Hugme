import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_USER_MOODS } from '../graphql/queries';
import { UPDATE_MOOD, REMOVE_MOOD } from '../graphql/mutations';

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    score: 5,
    note: '',
    isPublic: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  const { data, loading, refetch } = useQuery(GET_USER_MOODS);
  
  const [updateMood, { loading: updating }] = useMutation(UPDATE_MOOD, {
    onCompleted: () => {
      setSuccess('Mood updated successfully!');
      setShowEditModal(false);
      refetch();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error updating mood:', error);
      setError('Failed to update mood. Please try again.');
    }
  });
  
  const [removeMood, { loading: removing }] = useMutation(REMOVE_MOOD, {
    onCompleted: () => {
      setSuccess('Mood deleted successfully!');
      setShowDeleteModal(false);
      refetch();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error deleting mood:', error);
      setError('Failed to delete mood. Please try again.');
    }
  });

  useEffect(() => {
    if (data && data.userMoods) {
      // Sort moods by date (newest first)
      const sortedMoods = [...data.userMoods].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMoods(sortedMoods);
    }
  }, [data]);

  const handleEditMood = (mood) => {
    setCurrentMood(mood);
    setEditFormData({
      score: mood.score,
      note: mood.note || '',
      isPublic: mood.isPublic
    });
    setShowEditModal(true);
  };

  const handleDeleteMood = (mood) => {
    setCurrentMood(mood);
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.type === 'number' ? parseInt(value, 10) : value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!currentMood) return;
    
    try {
      await updateMood({
        variables: {
          updateMoodInput: {
            id: currentMood.id,
            score: editFormData.score,
            note: editFormData.note,
            isPublic: editFormData.isPublic
          }
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentMood) return;
    
    try {
      await removeMood({
        variables: {
          id: currentMood.id
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
    return labels[score] || 'Unknown';
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

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const renderMoodList = () => {
    if (moods.length === 0) {
      return (
        <div className="empty-state">
          <p>You haven't tracked any moods yet.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/mood-tracker')}
          >
            Track Your First Mood
          </button>
        </div>
      );
    }
    
    return (
      <div className="mood-list">
        {moods.map(mood => (
          <div key={mood.id} className="mood-card">
            <div className="mood-header">
              <div className="mood-score">
                <span className="mood-emoji">{getMoodEmoji(mood.score)}</span>
                <span className="mood-label">{getMoodLabel(mood.score)}</span>
              </div>
              <div className="mood-date">
                {getFormattedDate(mood.createdAt)}
              </div>
            </div>
            
            {mood.note && (
              <div className="mood-note">
                <p>{mood.note}</p>
              </div>
            )}
            
            <div className="mood-footer">
              <div className="mood-visibility">
                {mood.isPublic ? 'Public' : 'Private'}
              </div>
              <div className="mood-actions">
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => handleEditMood(mood)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteMood(mood)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEditModal = () => {
    if (!currentMood) return null;
    
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Mood</h3>
            <button 
              className="modal-close"
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit} className="edit-mood-form">
            <div className="form-group">
              <label htmlFor="score" className="form-label">Mood Score</label>
              <div className="mood-slider-container">
                <div className="mood-display">
                  <span className="mood-emoji">{getMoodEmoji(editFormData.score)}</span>
                  <span className="mood-label">{getMoodLabel(editFormData.score)}</span>
                </div>
                
                <input
                  type="range"
                  id="score"
                  name="score"
                  min="1"
                  max="10"
                  value={editFormData.score}
                  onChange={handleEditFormChange}
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
            </div>
            
            <div className="form-group">
              <label htmlFor="note" className="form-label">Note</label>
              <textarea
                id="note"
                name="note"
                value={editFormData.note}
                onChange={handleEditFormChange}
                className="form-textarea"
                placeholder="How are you feeling?"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group form-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={editFormData.isPublic}
                  onChange={handleEditFormChange}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Share this mood publicly (anonymously)</span>
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    if (!currentMood) return null;
    
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Delete Mood</h3>
            <button 
              className="modal-close"
              onClick={() => setShowDeleteModal(false)}
            >
              &times;
            </button>
          </div>
          
          <div className="modal-body">
            <p>Are you sure you want to delete this mood record?</p>
            <p className="mood-summary">
              <span className="mood-emoji">{getMoodEmoji(currentMood.score)}</span>
              <span className="mood-label">{getMoodLabel(currentMood.score)}</span>
              <span className="mood-date">
                from {getFormattedDate(currentMood.createdAt)}
              </span>
            </p>
            {currentMood.note && (
              <div className="mood-note">
                <p>{currentMood.note}</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn btn-danger"
              onClick={handleDeleteSubmit}
              disabled={removing}
            >
              {removing ? 'Deleting...' : 'Delete Mood'}
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={removing}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mood-history-page">
      <div className="page-header">
        <h1>Your Mood History</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/mood-tracker')}
        >
          Track New Mood
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-content">
            <p>{error}</p>
            <button onClick={() => setError('')} className="alert-close">&times;</button>
          </div>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <div className="alert-content">
            <p>{success}</p>
            <button onClick={() => setSuccess('')} className="alert-close">&times;</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner centered">Loading mood history...</div>
      ) : (
        renderMoodList()
      )}

      {showEditModal && renderEditModal()}
      {showDeleteModal && renderDeleteModal()}
    </div>
  );
};

export default MoodHistoryPage;