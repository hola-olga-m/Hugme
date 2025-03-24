import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnlocked, setShowUnlocked] = useState(true); // true: show unlocked, false: show locked
  
  const { user } = useContext(UserContext);
  const { getUserAchievements } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadAchievements = async () => {
      setIsLoading(true);
      try {
        const userAchievements = await getUserAchievements(user.id);
        setAchievements(userAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, [user.id, getUserAchievements]);
  
  // All possible achievements
  const allAchievements = [
    {
      id: 'first_hug',
      title: 'First Hug',
      description: 'Send your first virtual hug',
      icon: 'fas fa-heart',
      category: 'beginner'
    },
    {
      id: 'hug_streak_3',
      title: 'Hug Streak: 3 Days',
      description: 'Send hugs for 3 consecutive days',
      icon: 'fas fa-fire',
      category: 'progress'
    },
    {
      id: 'hug_streak_7',
      title: 'Hug Streak: 7 Days',
      description: 'Send hugs for 7 consecutive days',
      icon: 'fas fa-fire-alt',
      category: 'progress'
    },
    {
      id: 'hug_variety',
      title: 'Hug Variety',
      description: 'Send 5 different types of hugs',
      icon: 'fas fa-gift',
      category: 'explorer'
    },
    {
      id: 'mood_tracker',
      title: 'Mood Tracker',
      description: 'Log your mood for 7 consecutive days',
      icon: 'fas fa-smile',
      category: 'wellbeing'
    },
    {
      id: 'group_hug',
      title: 'Group Hugger',
      description: 'Create your first group hug',
      icon: 'fas fa-users',
      category: 'social'
    },
    {
      id: 'healing_hug',
      title: 'Healing Touch',
      description: 'Send a healing hug to someone in need',
      icon: 'fas fa-hand-holding-medical',
      category: 'kindness'
    },
    {
      id: 'mystery_hug',
      title: 'Mystery Lover',
      description: 'Send 3 mystery hugs',
      icon: 'fas fa-question-circle',
      category: 'explorer'
    },
    {
      id: 'ar_experience',
      title: 'AR Explorer',
      description: 'Experience your first AR hug',
      icon: 'fas fa-vr-cardboard',
      category: 'tech'
    },
    {
      id: 'hug_master',
      title: 'Hug Master',
      description: 'Send a total of 50 hugs',
      icon: 'fas fa-crown',
      category: 'master'
    },
  ];
  
  // Filter and merge achievements
  const processedAchievements = allAchievements.map(achievement => {
    const unlockedAchievement = achievements.find(a => a.id === achievement.id);
    return {
      ...achievement,
      unlocked: !!unlockedAchievement,
      unlockedAt: unlockedAchievement?.unlockedAt
    };
  });
  
  // Filter based on current view
  const filteredAchievements = processedAchievements.filter(
    achievement => achievement.unlocked === showUnlocked
  );
  
  // Group achievements by category
  const groupedAchievements = filteredAchievements.reduce((groups, achievement) => {
    const { category } = achievement;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {});
  
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (achievements.length / allAchievements.length) * 100
  );
  
  const toggleView = () => {
    setShowUnlocked(!showUnlocked);
    playHapticFeedback('selection');
  };
  
  return (
    <div className={`achievements-container theme-${theme}`}>
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Achievements</h1>
      </header>
      
      <div className="achievements-progress">
        <div className="progress-circle">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${progressPercentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{progressPercentage}%</text>
          </svg>
        </div>
        <div className="progress-text">
          <h2>Achievement Progress</h2>
          <p>{achievements.length} of {allAchievements.length} unlocked</p>
        </div>
      </div>
      
      <div className="view-toggle">
        <button 
          className={`toggle-button ${showUnlocked ? 'active' : ''}`}
          onClick={() => showUnlocked || toggleView()}
        >
          <i className="fas fa-unlock"></i> Unlocked
        </button>
        <button 
          className={`toggle-button ${!showUnlocked ? 'active' : ''}`}
          onClick={() => showUnlocked && toggleView()}
        >
          <i className="fas fa-lock"></i> Locked
        </button>
      </div>
      
      <div className="achievements-content">
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : filteredAchievements.length === 0 ? (
          <div className="no-achievements-message">
            <i className={`fas ${showUnlocked ? 'fa-trophy' : 'fa-lock'}`}></i>
            <p>
              {showUnlocked 
                ? "You haven't unlocked any achievements yet"
                : "No locked achievements to display"}
            </p>
            {showUnlocked && (
              <button className="view-locked-button" onClick={toggleView}>
                View Available Achievements
              </button>
            )}
          </div>
        ) : (
          Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <div key={category} className="achievement-category">
              <h2 className="category-title">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              
              <div className="achievements-grid">
                {categoryAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon">
                      <i className={achievement.icon}></i>
                    </div>
                    <div className="achievement-details">
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                      
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="unlock-date">
                          Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;
