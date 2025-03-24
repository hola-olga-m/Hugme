import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';
import { moodEmojis } from '../../assets/moodEmojis';

const MoodTracker = () => {
  const { currentUser } = useAuth();
  const { setCurrentMood } = useTheme();
  const navigate = useNavigate();
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  
  // Get the available mood emojis from the imported module
  const moodList = Object.entries(moodEmojis).map(([key, data]) => ({
    id: key,
    label: data.label,
    emoji: data.emoji,
    value: data.value
  }));
  
  useEffect(() => {
    // Reset saved state when mood changes
    if (isSaved) setIsSaved(false);
    
    // Reset error when mood changes
    if (error) setError('');
  }, [selectedMood, moodNote, isPublic]);
  
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    playHapticFeedback('selection');
  };
  
  const handleNoteChange = (e) => {
    setMoodNote(e.target.value);
  };
  
  const handlePublicToggle = () => {
    setIsPublic(!isPublic);
    playHapticFeedback('selection');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMood) {
      setError('Please select a mood before saving');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update theme context with the new mood
      setCurrentMood(selectedMood.id);
      
      // Play success haptic feedback
      playHapticFeedback('success');
      
      // Set saved state
      setIsSaved(true);
      
      // Reset form after a delay
      setTimeout(() => {
        // Redirect to mood insights or dashboard
        navigate('/mood/insights');
      }, 1500);
    } catch (error) {
      console.error('Failed to save mood:', error);
      setError('Failed to save your mood. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mood-tracker">
      <div className="mood-tracker-header">
        <h1>How are you feeling today?</h1>
        <p className="mood-tracker-subtitle">
          Track your mood to gain insights into your emotional patterns
        </p>
      </div>
      
      {error && (
        <div className="mood-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      <form className="mood-form" onSubmit={handleSubmit}>
        <div className="mood-selector">
          {moodList.map((mood) => (
            <div 
              key={mood.id}
              className={`mood-option ${selectedMood?.id === mood.id ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood)}
            >
              <div className="mood-emoji">{mood.emoji}</div>
              <div className="mood-label">{mood.label}</div>
            </div>
          ))}
        </div>
        
        <div className="mood-note-container">
          <label htmlFor="moodNote">Add a note (optional)</label>
          <textarea
            id="moodNote"
            name="moodNote"
            value={moodNote}
            onChange={handleNoteChange}
            placeholder="What's contributing to your mood today?"
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <div className="mood-settings">
          <div className="public-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handlePublicToggle}
                disabled={isLoading}
              />
              <span className="toggle-switch"></span>
              <span>Share with community</span>
            </label>
            <div className="toggle-description">
              Your mood will be visible to other users in the community feed
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="save-mood-button"
          disabled={isLoading || isSaved}
        >
          {isLoading ? (
            <Loading type="spinner" size="small" text="Saving..." />
          ) : isSaved ? (
            <>
              <i className="fas fa-check"></i> Mood Saved!
            </>
          ) : (
            'Save Mood'
          )}
        </button>
      </form>
      
      {selectedMood && (
        <div className="mood-preview">
          <div className="mood-reflection">
            <h3>Reflection for {selectedMood.label} mood:</h3>
            <p className="reflection-text">
              {getMoodReflection(selectedMood.id)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get a reflection message based on mood
function getMoodReflection(moodId) {
  const reflections = {
    ecstatic: "You're feeling amazing! Take a moment to appreciate this feeling and consider what brought you to this high point. How can you carry this energy forward?",
    happy: "Happiness is a wonderful state to be in. What specific things are making you feel happy today? Acknowledging them helps create more happiness in the future.",
    good: "You're doing well today. This stable positive energy is great for productivity and connection. What would make today even better?",
    neutral: "You're feeling balanced and even. This neutral state is a good time for mindfulness and reflection. What small thing might shift your mood upward?",
    down: "You're feeling a bit low today. Remember that all feelings are temporary and valid. What small act of self-care might help you feel a little better?",
    sad: "Sadness is a natural emotion that helps us process life's challenges. Is there someone you could reach out to or something gentle you could do for yourself today?",
    upset: "You're feeling upset. It's okay to have these emotions - they're providing you important information. Once you've acknowledged them, what might help you find some calm?",
    terrible: "You're having a really difficult time right now. Please be gentle with yourself. Consider reaching out to someone you trust or a professional if these feelings persist."
  };
  
  return reflections[moodId] || "Take a moment to reflect on this feeling and what it might be trying to tell you.";
}

export default MoodTracker;