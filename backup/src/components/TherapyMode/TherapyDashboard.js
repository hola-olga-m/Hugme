import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';
import { showNotification } from '../../utils/notifications';

// Safe, evidence-based mental health resources and coping strategies
const copingStrategies = [
  {
    id: 'breathing',
    name: 'Deep Breathing',
    description: 'Take slow, deep breaths to calm your nervous system',
    icon: 'wind',
    duration: '3 minutes',
    benefits: ['Reduces anxiety', 'Lowers stress response', 'Improves focus'],
    instructions: [
      'Find a comfortable position',
      'Breathe in deeply through your nose for 4 seconds',
      'Hold for 2 seconds',
      'Exhale slowly through your mouth for 6 seconds',
      'Repeat 10 times'
    ]
  },
  {
    id: 'gratitude',
    name: 'Gratitude Practice',
    description: 'Focus on things you\'re thankful for to shift perspective',
    icon: 'heart',
    duration: '5 minutes',
    benefits: ['Improves mood', 'Builds resilience', 'Reduces negative thinking'],
    instructions: [
      'Find a quiet space',
      'Think of 3 things you\'re grateful for today',
      'Write them down if possible',
      'Reflect on why you\'re grateful for each one',
      'Notice how you feel afterward'
    ]
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Moment',
    description: 'Focus on the present moment without judgment',
    icon: 'cloud',
    duration: '7 minutes',
    benefits: ['Reduces rumination', 'Increases self-awareness', 'Improves emotional regulation'],
    instructions: [
      'Sit comfortably with your back straight',
      'Close your eyes or maintain a soft gaze',
      'Focus on your natural breathing',
      'When your mind wanders, gently return focus to your breath',
      'Continue for 5-10 minutes'
    ]
  },
  {
    id: 'bodyMovement',
    name: 'Gentle Movement',
    description: 'Simple physical movement to shift your energy',
    icon: 'walking',
    duration: '10 minutes',
    benefits: ['Releases endorphins', 'Improves circulation', 'Reduces physical tension'],
    instructions: [
      'Choose gentle movement (walking, stretching, etc.)',
      'Focus on how your body feels as you move',
      'Move at your own pace without pushing',
      'Notice any changes in your mood after moving'
    ]
  },
  {
    id: 'thoughtChallenge',
    name: 'Thought Challenge',
    description: 'Question negative thought patterns',
    icon: 'brain',
    duration: '8 minutes',
    benefits: ['Reduces cognitive distortions', 'Builds critical thinking', 'Improves mood'],
    instructions: [
      'Identify a negative thought you\'re having',
      'Ask: Is this thought based on facts or feelings?',
      'What evidence contradicts this thought?',
      'What would you tell a friend with this thought?',
      'Create a more balanced perspective'
    ]
  }
];

// Professional resources to recommend
const professionalResources = [
  {
    id: 'crisis',
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741 for free 24/7 support',
    url: 'https://www.crisistextline.org/',
    icon: 'phone-alt'
  },
  {
    id: 'nami',
    name: 'NAMI Helpline',
    description: 'Information, resource referrals and support',
    url: 'https://www.nami.org/help',
    phone: '1-800-950-NAMI (6264)',
    icon: 'info-circle'
  },
  {
    id: 'therapy',
    name: 'Find a Therapist',
    description: 'Search for mental health professionals near you',
    url: 'https://www.psychologytoday.com/us/therapists',
    icon: 'user-md'
  }
];

const TherapyDashboard = () => {
  const [mood, setMood] = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [showCopingActivity, setShowCopingActivity] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [recommendedHugs, setRecommendedHugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useContext(UserContext);
  const { saveMood, getMoodHistory, getHugRecommendation } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          // Load previous mood data
          const moodHistory = await getMoodHistory(user.id);
          
          if (moodHistory && moodHistory.length > 0) {
            // Calculate streak
            let streak = 0;
            const today = new Date().setHours(0, 0, 0, 0);
            
            // Sort history by date, newest first
            const sortedHistory = [...moodHistory].sort((a, b) => 
              new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            // Get last check-in
            const lastEntry = sortedHistory[0];
            setLastCheckIn(lastEntry.timestamp);
            
            // Calculate streak
            let currentDate = new Date(today);
            currentDate.setDate(currentDate.getDate() - 1); // Start from yesterday
            
            for (let i = 0; i < sortedHistory.length; i++) {
              const entryDate = new Date(sortedHistory[i].timestamp).setHours(0, 0, 0, 0);
              
              if (entryDate === currentDate.setHours(0, 0, 0, 0)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
              } else if (entryDate < currentDate.setHours(0, 0, 0, 0)) {
                // There's a gap, break the streak
                break;
              }
            }
            
            setStreakCount(streak);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, getMoodHistory]);
  
  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    playHapticFeedback('selection');
    
    // Get hug recommendations based on mood
    const hugRecommendation = getHugRecommendation(selectedMood);
    setRecommendedHugs([hugRecommendation]);
  };
  
  const handleIntensityChange = (intensity) => {
    setMoodIntensity(intensity);
    playHapticFeedback('selection');
  };
  
  const handleSaveMood = async () => {
    if (!mood) return;
    
    try {
      await saveMood(user.id, mood, journalEntry);
      
      // Update streak
      const today = new Date().setHours(0, 0, 0, 0);
      const lastCheckInDate = lastCheckIn ? 
        new Date(lastCheckIn).setHours(0, 0, 0, 0) : null;
      
      if (!lastCheckInDate || lastCheckInDate !== today) {
        // This is the first check-in for today
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        if (lastCheckInDate === yesterday.getTime()) {
          // Last check-in was yesterday, increment streak
          setStreakCount(streakCount + 1);
        } else {
          // Last check-in was not yesterday, reset streak
          setStreakCount(1);
        }
      }
      
      setLastCheckIn(new Date().getTime());
      
      playHapticFeedback('success');
      showNotification('Mood Saved', 'Your mood has been recorded. Great job practicing self-awareness.');
      
      // Suggest a coping activity based on mood
      if (mood === 'sad' || mood === 'anxious' || mood === 'stressed' || mood === 'angry') {
        // For negative moods, suggest a coping activity
        const activityIndex = Math.floor(Math.random() * copingStrategies.length);
        setCurrentActivity(copingStrategies[activityIndex]);
        setShowCopingActivity(true);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };
  
  const toggleJournal = () => {
    setIsJournalOpen(!isJournalOpen);
    playHapticFeedback('selection');
  };
  
  const handleJournalChange = (e) => {
    setJournalEntry(e.target.value);
  };
  
  const closeCopingActivity = () => {
    setShowCopingActivity(false);
    setCurrentActivity(null);
    playHapticFeedback('selection');
  };
  
  // Mood mapping for UI display
  const moodEmojis = {
    sad: { emoji: '😔', label: 'Sad', color: '#5C6BC0' },
    anxious: { emoji: '😰', label: 'Anxious', color: '#42A5F5' },
    stressed: { emoji: '😫', label: 'Stressed', color: '#7E57C2' },
    angry: { emoji: '😠', label: 'Angry', color: '#EF5350' },
    neutral: { emoji: '😐', label: 'Neutral', color: '#90A4AE' },
    calm: { emoji: '😌', label: 'Calm', color: '#66BB6A' },
    happy: { emoji: '😊', label: 'Happy', color: '#8BC34A' }
  };
  
  // Render coping activity card
  const renderCopingActivity = () => {
    if (!currentActivity) return null;
    
    return (
      <div className="coping-activity-modal">
        <div className="coping-activity-content">
          <button className="close-activity-button" onClick={closeCopingActivity}>
            <i className="fas fa-times"></i>
          </button>
          
          <div className="activity-header">
            <div className="activity-icon">
              <i className={`fas fa-${currentActivity.icon}`}></i>
            </div>
            <h2>{currentActivity.name}</h2>
            <p className="activity-duration">
              <i className="fas fa-clock"></i> {currentActivity.duration}
            </p>
          </div>
          
          <p className="activity-description">{currentActivity.description}</p>
          
          <div className="activity-benefits">
            <h3>Benefits</h3>
            <ul>
              {currentActivity.benefits.map((benefit, index) => (
                <li key={index}>
                  <i className="fas fa-check"></i> {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="activity-instructions">
            <h3>How to Practice</h3>
            <ol>
              {currentActivity.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          <button className="try-activity-button">
            <i className="fas fa-play"></i> Start Guided Session
          </button>
          
          <p className="activity-footnote">
            Remember: It's okay to not feel okay. These exercises are tools to help you cope,
            not replace professional support when needed.
          </p>
        </div>
      </div>
    );
  };
  
  // Show loading screen while data loads
  if (isLoading) {
    return (
      <div className={`therapy-dashboard theme-${theme}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`therapy-dashboard theme-${theme}`}>
      <header className="therapy-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Wellness Space</h1>
        <button className="help-button">
          <i className="fas fa-question-circle"></i>
        </button>
      </header>
      
      <div className="therapy-content">
        <div className="therapy-welcome">
          <h2>How are you feeling today?</h2>
          <p>This is a safe space for reflection and support</p>
        </div>
        
        <div className="mood-check-in-card">
          <h3>Check In</h3>
          
          <div className="mood-selector">
            {Object.entries(moodEmojis).map(([moodKey, moodData]) => (
              <div 
                key={moodKey}
                className={`mood-item ${mood === moodKey ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(moodKey)}
              >
                <div className="mood-emoji">{moodData.emoji}</div>
                <div className="mood-label">{moodData.label}</div>
              </div>
            ))}
          </div>
          
          {mood && (
            <>
              <div className="mood-intensity">
                <h4>How intense is this feeling?</h4>
                <div className="intensity-slider">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <button
                      key={level}
                      className={`intensity-level ${moodIntensity === level ? 'active' : ''}`}
                      onClick={() => handleIntensityChange(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="intensity-labels">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Strong</span>
                </div>
              </div>
              
              <div className="journal-toggle">
                <button 
                  className={`journal-button ${isJournalOpen ? 'active' : ''}`}
                  onClick={toggleJournal}
                >
                  <i className={`fas fa-${isJournalOpen ? 'chevron-up' : 'chevron-down'}`}></i>
                  Add notes about how you're feeling
                </button>
              </div>
              
              {isJournalOpen && (
                <div className="journal-container">
                  <textarea
                    className="journal-input"
                    placeholder="Write a few thoughts about how you're feeling... (optional)"
                    value={journalEntry}
                    onChange={handleJournalChange}
                    rows={4}
                  />
                </div>
              )}
              
              <button
                className="save-mood-button"
                onClick={handleSaveMood}
              >
                Save Check-In
              </button>
            </>
          )}
        </div>
        
        <div className="therapy-stats-row">
          <div className="therapy-stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-value">{streakCount}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          
          <div className="therapy-stat-card">
            <div className="stat-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="stat-value">32</div>
            <div className="stat-label">Hugs Received</div>
          </div>
          
          <div className="therapy-stat-card">
            <div className="stat-icon">
              <i className="fas fa-brain"></i>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-label">Practices</div>
          </div>
        </div>
        
        <div className="therapy-tools-section">
          <h3>Coping Tools</h3>
          <div className="therapy-tools-grid">
            {copingStrategies.slice(0, 4).map(strategy => (
              <div 
                key={strategy.id}
                className="therapy-tool-card"
                onClick={() => {
                  setCurrentActivity(strategy);
                  setShowCopingActivity(true);
                  playHapticFeedback('selection');
                }}
              >
                <div className="tool-icon">
                  <i className={`fas fa-${strategy.icon}`}></i>
                </div>
                <h4>{strategy.name}</h4>
                <p>{strategy.duration}</p>
              </div>
            ))}
            
            <Link to="/therapy/all-tools" className="therapy-tool-card view-all">
              <div className="tool-icon">
                <i className="fas fa-ellipsis-h"></i>
              </div>
              <h4>View All</h4>
              <p>More tools</p>
            </Link>
          </div>
        </div>
        
        {recommendedHugs.length > 0 && (
          <div className="recommended-hugs-section">
            <h3>Recommended Hugs</h3>
            <div className="recommended-hugs-grid">
              {recommendedHugs.map((hug, index) => (
                <div 
                  key={index}
                  className="recommended-hug-card"
                  onClick={() => navigate('/send-hug', { state: { hugType: hug } })}
                >
                  <div className="hug-icon">
                    <i className={hug.icon}></i>
                  </div>
                  <div className="hug-details">
                    <h4>{hug.name}</h4>
                    <p>{hug.description}</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="professional-help-section">
          <h3>Professional Resources</h3>
          <div className="resources-disclaimer">
            <i className="fas fa-info-circle"></i>
            <p>
              In a crisis, reach out to professional support. 
              These resources are available 24/7.
            </p>
          </div>
          
          <div className="professional-resources-list">
            {professionalResources.map(resource => (
              <a 
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="professional-resource-card"
              >
                <div className="resource-icon">
                  <i className={`fas fa-${resource.icon}`}></i>
                </div>
                <div className="resource-details">
                  <h4>{resource.name}</h4>
                  <p>{resource.description}</p>
                  {resource.phone && (
                    <p className="resource-phone">{resource.phone}</p>
                  )}
                </div>
                <i className="fas fa-external-link-alt"></i>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {showCopingActivity && renderCopingActivity()}
    </div>
  );
};

export default TherapyDashboard;