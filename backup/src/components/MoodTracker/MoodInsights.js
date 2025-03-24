import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const MoodInsights = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [insightsData, setInsightsData] = useState(null);
  const [timeRange, setTimeRange] = useState(30); // Days
  const [includeCorrelations, setIncludeCorrelations] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would call your API service
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock insights data
        const data = generateMockInsights(timeRange, includeCorrelations);
        setInsightsData(data);
      } catch (error) {
        console.error('Failed to load mood insights:', error);
        setError('Failed to load your mood insights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInsights();
  }, [timeRange, includeCorrelations, currentUser?.id]);
  
  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };
  
  const handleCorrelationsToggle = () => {
    setIncludeCorrelations(!includeCorrelations);
  };
  
  if (isLoading) {
    return <Loading text="Analyzing your mood patterns..." />;
  }
  
  if (!insightsData) {
    return (
      <div className="no-insights">
        <h2>Not Enough Data</h2>
        <p>We need more mood entries to generate insights. Keep tracking your moods regularly!</p>
        <Link to="/mood/update" className="record-mood-btn">
          Record Your Mood
        </Link>
      </div>
    );
  }
  
  return (
    <div className="mood-insights">
      <div className="insights-header">
        <h1>Your Mood Insights</h1>
        <p className="insights-subtitle">
          Personalized analysis of your emotional patterns
        </p>
      </div>
      
      {error && (
        <div className="insights-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      <div className="insights-controls">
        <div className="time-range-selector">
          <button 
            className={`time-button ${timeRange === 7 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(7)}
          >
            7 Days
          </button>
          <button 
            className={`time-button ${timeRange === 30 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(30)}
          >
            30 Days
          </button>
          <button 
            className={`time-button ${timeRange === 90 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(90)}
          >
            90 Days
          </button>
          <button 
            className={`time-button ${timeRange === 365 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(365)}
          >
            Year
          </button>
        </div>
        
        <div className="correlations-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={includeCorrelations}
              onChange={handleCorrelationsToggle}
            />
            <span className="toggle-switch"></span>
            <span>Include Correlations</span>
          </label>
        </div>
      </div>
      
      <div className="insights-summary">
        <div className="summary-card mood-trend">
          <h3>Overall Trend</h3>
          <div className="trend-content">
            <div className={`trend-icon ${insightsData.trend.direction}`}>
              <i className={`fas fa-${getTrendIcon(insightsData.trend.direction)}`}></i>
            </div>
            <div className="trend-info">
              <div className="trend-label">{getTrendLabel(insightsData.trend.direction)}</div>
              <div className="trend-value">{insightsData.trend.value}%</div>
              <div className="trend-period">over {timeRange} days</div>
            </div>
          </div>
        </div>
        
        <div className="summary-card dominant-mood">
          <h3>Dominant Mood</h3>
          <div className="dominant-mood-content">
            <div className="dominant-emoji">{insightsData.dominantMood.emoji}</div>
            <div className="dominant-info">
              <div className="dominant-label">{insightsData.dominantMood.label}</div>
              <div className="dominant-percentage">{insightsData.dominantMood.percentage}% of entries</div>
            </div>
          </div>
        </div>
        
        <div className="summary-card mood-variability">
          <h3>Mood Variability</h3>
          <div className="variability-content">
            <div className={`variability-level ${insightsData.variability.level}`}>
              {insightsData.variability.level}
            </div>
            <div className="variability-description">
              {getVariabilityDescription(insightsData.variability.level)}
            </div>
          </div>
        </div>
        
        <div className="summary-card current-streak">
          <h3>Tracking Streak</h3>
          <div className="streak-content">
            <div className="streak-icon">
              <i className="fas fa-fire"></i>
            </div>
            <div className="streak-info">
              <div className="streak-value">{insightsData.streak.current} days</div>
              <div className="streak-label">Current Streak</div>
              <div className="streak-best">Best: {insightsData.streak.best} days</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="insights-patterns">
        <h2>Mood Patterns</h2>
        
        <div className="patterns-grid">
          <div className="pattern-card day-of-week">
            <h3>Day of Week Patterns</h3>
            <div className="pattern-content">
              <div className="best-worst-days">
                <div className="best-day">
                  <h4>Best Day</h4>
                  <div className="day-content">
                    <div className="day-name">{insightsData.patterns.dayOfWeek.best.day}</div>
                    <div className="day-emoji">{insightsData.patterns.dayOfWeek.best.emoji}</div>
                    <div className="day-score">{insightsData.patterns.dayOfWeek.best.score.toFixed(1)}</div>
                  </div>
                </div>
                
                <div className="worst-day">
                  <h4>Most Challenging Day</h4>
                  <div className="day-content">
                    <div className="day-name">{insightsData.patterns.dayOfWeek.worst.day}</div>
                    <div className="day-emoji">{insightsData.patterns.dayOfWeek.worst.emoji}</div>
                    <div className="day-score">{insightsData.patterns.dayOfWeek.worst.score.toFixed(1)}</div>
                  </div>
                </div>
              </div>
              
              <div className="day-chart">
                {/* Day of week chart - in real app use a proper chart library */}
                <div className="simple-chart">
                  {insightsData.patterns.dayOfWeek.all.map((day) => (
                    <div key={day.day} className="chart-item">
                      <div 
                        className="chart-bar"
                        style={{ 
                          height: `${(day.score / 10) * 100}%`,
                          backgroundColor: day.color
                        }}
                      ></div>
                      <div className="chart-label">{day.day.substring(0, 1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pattern-card time-of-day">
            <h3>Time of Day Patterns</h3>
            <div className="pattern-content">
              <div className="best-worst-times">
                <div className="best-time">
                  <h4>Best Time</h4>
                  <div className="time-content">
                    <div className="time-name">{insightsData.patterns.timeOfDay.best.period}</div>
                    <div className="time-emoji">{insightsData.patterns.timeOfDay.best.emoji}</div>
                    <div className="time-score">{insightsData.patterns.timeOfDay.best.score.toFixed(1)}</div>
                  </div>
                </div>
                
                <div className="worst-time">
                  <h4>Most Challenging Time</h4>
                  <div className="time-content">
                    <div className="time-name">{insightsData.patterns.timeOfDay.worst.period}</div>
                    <div className="time-emoji">{insightsData.patterns.timeOfDay.worst.emoji}</div>
                    <div className="time-score">{insightsData.patterns.timeOfDay.worst.score.toFixed(1)}</div>
                  </div>
                </div>
              </div>
              
              <div className="time-chart">
                {/* Time of day chart - in real app use a proper chart library */}
                <div className="simple-chart">
                  {insightsData.patterns.timeOfDay.all.map((time) => (
                    <div key={time.period} className="chart-item">
                      <div 
                        className="chart-bar"
                        style={{ 
                          height: `${(time.score / 10) * 100}%`,
                          backgroundColor: time.color
                        }}
                      ></div>
                      <div className="chart-label">{time.period.substring(0, 1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {includeCorrelations && insightsData.correlations && (
        <div className="insights-correlations">
          <h2>Mood Correlations</h2>
          <p className="correlations-description">
            Factors that appear to influence your mood based on your entries
          </p>
          
          <div className="correlations-grid">
            {insightsData.correlations.map((correlation, index) => (
              <div key={index} className={`correlation-card ${correlation.strength}`}>
                <div className="correlation-header">
                  <div className="correlation-icon">
                    <i className={`fas fa-${correlation.icon}`}></i>
                  </div>
                  <h3>{correlation.factor}</h3>
                </div>
                
                <div className="correlation-content">
                  <div className="correlation-strength">
                    <div className="strength-label">Correlation Strength</div>
                    <div className="strength-value">{correlation.strengthValue}%</div>
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ width: `${correlation.strengthValue}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="correlation-direction">
                    <div className="direction-label">Impact</div>
                    <div className="direction-value">
                      <i className={`fas fa-${correlation.direction === 'positive' ? 'arrow-up' : 'arrow-down'}`}></i>
                      {correlation.direction === 'positive' ? 'Positive' : 'Negative'}
                    </div>
                  </div>
                  
                  <div className="correlation-description">
                    {correlation.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="insights-recommendations">
        <h2>Personalized Recommendations</h2>
        
        <div className="recommendations-list">
          {insightsData.recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-icon">
                <i className={`fas fa-${recommendation.icon}`}></i>
              </div>
              <div className="recommendation-content">
                <h3>{recommendation.title}</h3>
                <p>{recommendation.description}</p>
                {recommendation.actionable && (
                  <button className="recommendation-action">
                    {recommendation.actionText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="insights-cta">
        <div className="cta-card share-insights">
          <h3>Share Your Insights</h3>
          <p>Share a summary of your mood journey with friends or on social media</p>
          <div className="share-buttons">
            <button className="share-button">
              <i className="fas fa-share-alt"></i> Share Insights
            </button>
          </div>
        </div>
        
        <div className="cta-card update-mood">
          <h3>Keep Your Streak Going</h3>
          <p>Continue tracking your mood for more accurate insights</p>
          <Link to="/mood/update" className="update-button">
            <i className="fas fa-plus"></i> Record Today's Mood
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getTrendIcon(direction) {
  switch (direction) {
    case 'improving':
      return 'arrow-up';
    case 'declining':
      return 'arrow-down';
    default:
      return 'equals';
  }
}

function getTrendLabel(direction) {
  switch (direction) {
    case 'improving':
      return 'Improving';
    case 'declining':
      return 'Declining';
    default:
      return 'Stable';
  }
}

function getVariabilityDescription(level) {
  switch (level) {
    case 'high':
      return 'Your moods change significantly from day to day';
    case 'moderate':
      return 'Your moods show some variation over time';
    case 'low':
      return 'Your moods tend to be relatively stable';
    default:
      return 'Not enough data to determine mood variability';
  }
}

// Mock data generation
function generateMockInsights(timeRange, includeCorrelations) {
  // This would be replaced with real data from your API
  return {
    trend: {
      direction: Math.random() > 0.5 ? 'improving' : Math.random() > 0.7 ? 'declining' : 'stable',
      value: Math.floor(Math.random() * 10 + 5) // 5-15%
    },
    dominantMood: {
      label: 'Good',
      emoji: '😊',
      percentage: Math.floor(Math.random() * 30 + 40) // 40-70%
    },
    variability: {
      level: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
      score: Math.random() * 5
    },
    streak: {
      current: Math.floor(Math.random() * 10) + 1,
      best: Math.floor(Math.random() * 30) + 10
    },
    patterns: {
      dayOfWeek: {
        best: {
          day: 'Saturday',
          score: Math.random() * 2 + 7, // 7-9
          emoji: '😊'
        },
        worst: {
          day: 'Monday',
          score: Math.random() * 2 + 4, // 4-6
          emoji: '😐'
        },
        all: [
          { day: 'Monday', score: 4.5, color: '#e74c3c' },
          { day: 'Tuesday', score: 5.2, color: '#e67e22' },
          { day: 'Wednesday', score: 6.1, color: '#f1c40f' },
          { day: 'Thursday', score: 6.5, color: '#2ecc71' },
          { day: 'Friday', score: 7.2, color: '#3498db' },
          { day: 'Saturday', score: 8.3, color: '#9b59b6' },
          { day: 'Sunday', score: 7.8, color: '#8e44ad' }
        ]
      },
      timeOfDay: {
        best: {
          period: 'Evening',
          score: Math.random() * 2 + 7, // 7-9
          emoji: '😊'
        },
        worst: {
          period: 'Morning',
          score: Math.random() * 2 + 4, // 4-6
          emoji: '😐'
        },
        all: [
          { period: 'Morning', score: 5.4, color: '#e67e22' },
          { period: 'Afternoon', score: 6.7, color: '#2ecc71' },
          { period: 'Evening', score: 7.9, color: '#3498db' },
          { period: 'Night', score: 6.2, color: '#8e44ad' }
        ]
      }
    },
    correlations: includeCorrelations ? [
      {
        factor: 'Sleep Quality',
        icon: 'bed',
        strength: 'strong',
        strengthValue: 78,
        direction: 'positive',
        description: 'Your mood tends to be better on days following good sleep.'
      },
      {
        factor: 'Physical Activity',
        icon: 'running',
        strength: 'moderate',
        strengthValue: 62,
        direction: 'positive',
        description: 'Days with exercise correlate with improved mood scores.'
      },
      {
        factor: 'Social Interaction',
        icon: 'users',
        strength: 'moderate',
        strengthValue: 58,
        direction: 'positive',
        description: 'Socializing appears to have a positive effect on your mood.'
      },
      {
        factor: 'Work Stress',
        icon: 'briefcase',
        strength: 'moderate',
        strengthValue: 54,
        direction: 'negative',
        description: 'Your mood tends to be lower during high-stress workdays.'
      }
    ] : null,
    recommendations: [
      {
        title: 'Prioritize weekend activities you enjoy',
        description: 'Your mood is consistently higher on weekends. Try to identify what specifically makes these days better and incorporate those elements into your weekdays.',
        icon: 'calendar-day',
        actionable: false
      },
      {
        title: 'Establish a consistent sleep schedule',
        description: 'Your mood correlates strongly with sleep quality. Aim for 7-8 hours of sleep and maintain consistent sleep and wake times.',
        icon: 'moon',
        actionable: true,
        actionText: 'Set Sleep Reminders'
      },
      {
        title: 'Add short walks to your morning routine',
        description: 'Morning is your most challenging time of day. Light physical activity might help improve your mood during this period.',
        icon: 'walking',
        actionable: true,
        actionText: 'Set Morning Walk Reminders'
      },
      {
        title: 'Practice mindfulness during afternoon slumps',
        description: 'Your mood typically dips in the afternoon. A short mindfulness session might help you maintain emotional balance.',
        icon: 'brain',
        actionable: true,
        actionText: 'Try Guided Meditation'
      }
    ]
  };
}

export default MoodInsights;