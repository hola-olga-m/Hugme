import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import { moodEmojis } from '../../assets/moodEmojis';

const MoodHistory = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [groupBy, setGroupBy] = useState('day'); // 'day', 'week', 'month'
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadMoodHistory = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would call your API service
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock mood history based on time range
        const entries = generateMockMoodEntries(timeRange);
        setMoodEntries(entries);
      } catch (error) {
        console.error('Failed to load mood history:', error);
        setError('Failed to load your mood history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoodHistory();
  }, [timeRange, currentUser?.id]);
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };
  
  const handleGroupByChange = (grouping) => {
    setGroupBy(grouping);
  };
  
  if (isLoading) {
    return <Loading text="Loading your mood history..." />;
  }
  
  return (
    <div className="mood-history">
      <div className="mood-history-header">
        <h1>Your Mood Journey</h1>
        <p className="mood-history-subtitle">
          Explore your emotional patterns over time
        </p>
      </div>
      
      {error && (
        <div className="mood-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      <div className="mood-history-controls">
        <div className="time-range-selector">
          <button 
            className={`time-button ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('week')}
          >
            Week
          </button>
          <button 
            className={`time-button ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('month')}
          >
            Month
          </button>
          <button 
            className={`time-button ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('year')}
          >
            Year
          </button>
        </div>
        
        <div className="group-by-selector">
          <label>Group by:</label>
          <select 
            value={groupBy} 
            onChange={(e) => handleGroupByChange(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
      
      <div className="mood-visualization">
        <div className="mood-chart">
          {/* Chart visualization would be implemented with a library like Chart.js or D3.js */}
          <div className="chart-placeholder">
            <div className="chart-bars">
              {moodEntries.slice(0, 30).map((entry, index) => (
                <div 
                  key={index} 
                  className="chart-bar"
                  style={{ 
                    height: `${(entry.value / 10) * 100}%`,
                    backgroundColor: getMoodColor(entry.mood)
                  }}
                  title={`${entry.mood} (${formatDate(entry.date)})`}
                />
              ))}
            </div>
            <div className="chart-axis">
              <div className="y-axis">
                <div className="axis-label">Mood</div>
                <div className="axis-ticks">
                  <div className="axis-tick">10</div>
                  <div className="axis-tick">8</div>
                  <div className="axis-tick">6</div>
                  <div className="axis-tick">4</div>
                  <div className="axis-tick">2</div>
                  <div className="axis-tick">0</div>
                </div>
              </div>
              <div className="x-axis">
                <div className="axis-label">Time</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mood-average">
          <div className="average-card">
            <h3>Average Mood</h3>
            <div className="average-mood">
              <div className="average-emoji">
                {getMoodEmojiByValue(calculateAverageMood(moodEntries))}
              </div>
              <div className="average-value">
                {calculateAverageMood(moodEntries).toFixed(1)}
              </div>
            </div>
          </div>
          
          <div className="mood-distribution">
            <h3>Mood Distribution</h3>
            <div className="distribution-bars">
              {calculateMoodDistribution(moodEntries).map((item) => (
                <div key={item.mood} className="distribution-item">
                  <div className="distribution-label">
                    <span className="distribution-emoji">{moodEmojis[item.mood]?.emoji}</span>
                    <span className="distribution-percentage">{item.percentage}%</span>
                  </div>
                  <div className="distribution-bar-container">
                    <div 
                      className="distribution-bar"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: getMoodColor(item.mood)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mood-entries-list">
        <h2>Recent Entries</h2>
        
        {moodEntries.length === 0 ? (
          <div className="no-entries">
            <p>You haven't recorded any moods yet.</p>
            <Link to="/mood/update" className="record-mood-btn">
              Record Your First Mood
            </Link>
          </div>
        ) : (
          <div className="entries-container">
            {moodEntries.slice(0, 10).map((entry, index) => (
              <div key={index} className="mood-entry-card">
                <div className="entry-header">
                  <div className="entry-mood">
                    <div className="entry-emoji">{moodEmojis[entry.mood]?.emoji}</div>
                    <div className="entry-label">{moodEmojis[entry.mood]?.label}</div>
                  </div>
                  <div className="entry-date">{formatDate(entry.date)}</div>
                </div>
                
                {entry.note && (
                  <div className="entry-note">
                    <p>{entry.note}</p>
                  </div>
                )}
                
                <div className="entry-actions">
                  <button className="entry-action view">
                    <i className="fas fa-eye"></i> View Details
                  </button>
                  {entry.isPublic ? (
                    <div className="entry-public">
                      <i className="fas fa-globe"></i> Public
                    </div>
                  ) : (
                    <div className="entry-private">
                      <i className="fas fa-lock"></i> Private
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {moodEntries.length > 10 && (
              <div className="view-more">
                <button className="view-more-btn">
                  View More Entries
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mood-insights-cta">
        <h3>Want deeper insights?</h3>
        <p>Analyze patterns, correlations, and get personalized recommendations.</p>
        <Link to="/mood/insights" className="insights-button">
          <i className="fas fa-chart-line"></i> View Mood Insights
        </Link>
      </div>
    </div>
  );
};

// Helper functions
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getMoodColor(moodId) {
  const moodColors = {
    ecstatic: '#8e44ad',
    happy: '#3498db',
    good: '#2ecc71',
    neutral: '#f1c40f',
    down: '#e67e22',
    sad: '#e74c3c',
    upset: '#c0392b',
    terrible: '#7f8c8d'
  };
  
  return moodColors[moodId] || '#95a5a6';
}

function getMoodEmojiByValue(value) {
  // Find the closest mood emoji based on the numeric value
  const moodsSorted = Object.entries(moodEmojis)
    .map(([id, data]) => ({ id, value: data.value }))
    .sort((a, b) => Math.abs(a.value - value) - Math.abs(b.value - value));
  
  const closestMood = moodsSorted[0]?.id;
  return moodEmojis[closestMood]?.emoji || '😐';
}

function calculateAverageMood(entries) {
  if (entries.length === 0) return 5; // Neutral default
  
  const sum = entries.reduce((total, entry) => total + entry.value, 0);
  return sum / entries.length;
}

function calculateMoodDistribution(entries) {
  if (entries.length === 0) return [];
  
  // Count occurrences of each mood
  const moodCounts = entries.reduce((counts, entry) => {
    const mood = entry.mood;
    counts[mood] = (counts[mood] || 0) + 1;
    return counts;
  }, {});
  
  // Calculate percentages
  const distribution = Object.entries(moodCounts).map(([mood, count]) => {
    const percentage = Math.round((count / entries.length) * 100);
    return { mood, count, percentage };
  });
  
  // Sort by percentage (descending)
  return distribution.sort((a, b) => b.percentage - a.percentage);
}

// Mock data generation
function generateMockMoodEntries(timeRange) {
  const now = new Date();
  const entries = [];
  let daysToGenerate;
  
  switch (timeRange) {
    case 'week':
      daysToGenerate = 7;
      break;
    case 'month':
      daysToGenerate = 30;
      break;
    case 'year':
      daysToGenerate = 365;
      break;
    default:
      daysToGenerate = 7;
  }
  
  const moodKeys = Object.keys(moodEmojis);
  
  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random mood for demonstration purposes
    const randomMoodIndex = Math.floor(Math.random() * moodKeys.length);
    const mood = moodKeys[randomMoodIndex];
    const value = moodEmojis[mood].value;
    
    entries.push({
      id: `mood-${i}`,
      date: date.toISOString(),
      mood,
      value,
      note: i % 3 === 0 ? `This is a sample mood note for ${moodEmojis[mood].label}` : '',
      isPublic: i % 4 === 0
    });
  }
  
  // Sort by date (newest first)
  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default MoodHistory;