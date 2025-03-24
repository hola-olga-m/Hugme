/**
 * Mood Analytics Service
 * Provides advanced analysis of mood data with personalized insights
 */

import { getMoodHistoryByUser } from './memoryDB';
import { sendWebSocketMessage } from './websocketService';
import { moodEmojis, moodGroups } from '../assets/moodEmojis';

/**
 * Fetch mood analytics data for a user
 * @param {WebSocket} socket - WebSocket connection
 * @param {string} userId - User ID
 * @param {Object} options - Analysis options
 * @param {number} options.timeRange - Time range in days (7, 30, 90, 365)
 * @param {boolean} options.includeCorrelations - Whether to include activity correlations
 * @returns {Promise<Object>} Mood analytics data
 */
export const fetchMoodAnalytics = async (socket, userId, options = {}) => {
  try {
    // Default options
    const timeRange = options.timeRange || 30;
    const includeCorrelations = options.includeCorrelations !== undefined ? options.includeCorrelations : true;
    
    // Request mood data analysis via WebSocket
    sendWebSocketMessage(socket, {
      type: 'fetch_data',
      data: {
        dataType: 'moodAnalytics',
        timeRange,
        includeCorrelations
      }
    });
    
    // Return a Promise that will resolve when the WebSocket response is received
    return new Promise((resolve, reject) => {
      const handleMessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          if (response.type === 'moodAnalytics' && response.data) {
            socket.removeEventListener('message', handleMessage);
            
            // Server now sends fully processed data so we can use it directly
            resolve(response.data);
          } else if (response.type === 'error' && response.dataType === 'moodAnalytics') {
            socket.removeEventListener('message', handleMessage);
            reject(new Error(response.message || 'Failed to fetch mood analytics'));
          }
        } catch (e) {
          console.error('Error processing WebSocket response:', e);
        }
      };
      
      socket.addEventListener('message', handleMessage);
      
      // Set timeout to prevent hanging
      setTimeout(() => {
        socket.removeEventListener('message', handleMessage);
        reject(new Error('Mood analytics request timed out'));
      }, 15000);
    });
  } catch (error) {
    console.error('Mood analytics error:', error);
    throw error;
  }
};

/**
 * Enhance mood analytics data with additional insights
 * @param {Object} data - Raw mood analytics data
 * @returns {Object} Enhanced mood analytics with insights
 */
const enhanceMoodAnalytics = (data) => {
  if (!data) return null;
  
  // Calculate high-level metrics
  const enhancedData = {
    ...data,
    summary: {
      dominantMoodGroup: findDominantMoodGroup(data.moodFrequency),
      moodVariability: calculateMoodVariability(data.moodEntries),
      longestStreak: data.longestStreak || 0,
      currentStreak: data.currentStreak || 0,
      improvementTrend: calculateImprovementTrend(data.moodEntries),
      averageMoodScore: calculateAverageMoodScore(data.moodEntries),
    },
    insights: generateInsights(data),
    recommendations: generateRecommendations(data),
  };
  
  return enhancedData;
};

/**
 * Find the most frequent mood group
 * @param {Object} moodFrequency - Frequency of each mood
 * @returns {string} The dominant mood group
 */
const findDominantMoodGroup = (moodFrequency) => {
  if (!moodFrequency) return 'neutral';
  
  // Create mood group frequencies
  const groupFrequency = {};
  let maxFrequency = 0;
  let dominantGroup = 'neutral';
  
  // Map moods to groups and count frequencies
  Object.entries(moodFrequency).forEach(([mood, frequency]) => {
    // Find which group this mood belongs to
    let moodGroup = 'neutral';
    Object.entries(moodGroups).forEach(([group, moods]) => {
      if (moods.includes(mood)) {
        moodGroup = group;
      }
    });
    
    // Count group frequency
    groupFrequency[moodGroup] = (groupFrequency[moodGroup] || 0) + frequency;
    
    // Track the dominant group
    if (groupFrequency[moodGroup] > maxFrequency) {
      maxFrequency = groupFrequency[moodGroup];
      dominantGroup = moodGroup;
    }
  });
  
  return dominantGroup;
};

/**
 * Calculate mood variability (how much mood fluctuates)
 * @param {Array} moodEntries - User's mood entries
 * @returns {string} Variability level (low, moderate, high)
 */
const calculateMoodVariability = (moodEntries) => {
  if (!moodEntries || moodEntries.length < 5) return 'insufficient_data';
  
  // Map mood names to numeric values for calculation
  const moodValues = moodEntries.map(entry => {
    const moodName = entry.mood;
    let moodValue = 5; // Default neutral value
    
    Object.entries(moodEmojis).forEach(([mood, data]) => {
      if (mood === moodName) {
        moodValue = data.value;
      }
    });
    
    return moodValue;
  });
  
  // Calculate standard deviation of mood values
  const mean = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
  const squaredDifferences = moodValues.map(value => Math.pow(value - mean, 2));
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / moodValues.length;
  const stdDev = Math.sqrt(variance);
  
  // Interpret standard deviation
  if (stdDev < 1.0) return 'low';
  if (stdDev < 2.0) return 'moderate';
  return 'high';
};

/**
 * Calculate improvement trend in mood
 * @param {Array} moodEntries - User's mood entries
 * @returns {string} Trend direction (improving, stable, declining)
 */
const calculateImprovementTrend = (moodEntries) => {
  if (!moodEntries || moodEntries.length < 5) return 'insufficient_data';
  
  // Sort entries by date
  const sortedEntries = [...moodEntries].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
  
  // Need at least a week of data for meaningful trend
  if (sortedEntries.length < 7) return 'insufficient_data';
  
  // Map mood names to numeric values (higher is more positive)
  const moodValues = sortedEntries.map(entry => {
    const moodName = entry.mood;
    let moodValue = 5; // Default neutral value
    
    Object.entries(moodEmojis).forEach(([mood, data]) => {
      if (mood === moodName) {
        moodValue = data.value;
      }
    });
    
    return moodValue;
  });
  
  // Calculate simple linear regression
  const n = moodValues.length;
  const xValues = Array.from({ length: n }, (_, i) => i + 1); // 1, 2, 3, ...
  
  // Calculate sums for regression formula
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = moodValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * moodValues[i], 0);
  const sumXSquared = xValues.reduce((sum, x) => sum + x * x, 0);
  
  // Calculate slope
  const slope = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);
  
  // Interpret slope
  if (slope > 0.05) return 'improving';
  if (slope < -0.05) return 'declining';
  return 'stable';
};

/**
 * Calculate average mood score
 * @param {Array} moodEntries - User's mood entries
 * @returns {number} Average mood score (1-10)
 */
const calculateAverageMoodScore = (moodEntries) => {
  if (!moodEntries || moodEntries.length === 0) return 5;
  
  // Map mood names to numeric values
  const moodValues = moodEntries.map(entry => {
    const moodName = entry.mood;
    let moodValue = 5; // Default neutral value
    
    Object.entries(moodEmojis).forEach(([mood, data]) => {
      if (mood === moodName) {
        moodValue = data.value;
      }
    });
    
    return moodValue;
  });
  
  // Calculate average
  const average = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
  
  return parseFloat(average.toFixed(1));
};

/**
 * Generate personalized insights based on mood data
 * @param {Object} data - Mood analytics data
 * @returns {Array} Array of insight objects
 */
const generateInsights = (data) => {
  if (!data || !data.moodEntries || data.moodEntries.length < 7) {
    return [{
      type: 'info',
      title: 'Keep Tracking Your Mood',
      description: 'Continue logging your mood daily to unlock personalized insights.'
    }];
  }
  
  const insights = [];
  const { moodEntries, moodByDayOfWeek, moodByTimeOfDay, correlations } = data;
  
  // Find mood patterns by day of week
  if (moodByDayOfWeek) {
    const bestDay = findExtremeDay(moodByDayOfWeek, 'best');
    const worstDay = findExtremeDay(moodByDayOfWeek, 'worst');
    
    if (bestDay) {
      insights.push({
        type: 'positive',
        title: `${bestDay.day} is Your Best Day`,
        description: `You tend to feel your best on ${bestDay.day}s. Plan special activities on this day to maximize your well-being.`,
        data: { day: bestDay.day, score: bestDay.score }
      });
    }
    
    if (worstDay) {
      insights.push({
        type: 'challenge',
        title: `${worstDay.day} is Your Most Challenging Day`,
        description: `You often experience more difficult moods on ${worstDay.day}s. Consider extra self-care on these days.`,
        data: { day: worstDay.day, score: worstDay.score }
      });
    }
  }
  
  // Find optimal time of day
  if (moodByTimeOfDay) {
    const bestTime = findExtremeTimeOfDay(moodByTimeOfDay, 'best');
    const worstTime = findExtremeTimeOfDay(moodByTimeOfDay, 'worst');
    
    if (bestTime) {
      insights.push({
        type: 'positive',
        title: `${bestTime.timeLabel} is Your Peak Time`,
        description: `You typically feel your best during the ${bestTime.timeLabel.toLowerCase()}. Schedule important activities during this time when possible.`,
        data: { timeOfDay: bestTime.timeOfDay, score: bestTime.score }
      });
    }
  }
  
  // Add insights from correlations
  if (correlations) {
    if (correlations.activities && correlations.activities.length > 0) {
      const topPositiveActivity = correlations.activities.find(a => a.impact > 0.3);
      const topNegativeActivity = correlations.activities.find(a => a.impact < -0.3);
      
      if (topPositiveActivity) {
        insights.push({
          type: 'positive',
          title: `${topPositiveActivity.activity} Boosts Your Mood`,
          description: `When you ${topPositiveActivity.activity.toLowerCase()}, your mood tends to improve. Consider making this a regular part of your routine.`,
          data: { activity: topPositiveActivity.activity, impact: topPositiveActivity.impact }
        });
      }
      
      if (topNegativeActivity) {
        insights.push({
          type: 'challenge',
          title: `${topNegativeActivity.activity} Affects Your Mood`,
          description: `You often experience mood dips after ${topNegativeActivity.activity.toLowerCase()}. Consider ways to manage or limit this activity.`,
          data: { activity: topNegativeActivity.activity, impact: topNegativeActivity.impact }
        });
      }
    }
    
    if (correlations.social && correlations.social.impact !== 0) {
      if (correlations.social.impact > 0.3) {
        insights.push({
          type: 'positive',
          title: 'Social Connection Improves Your Mood',
          description: 'Your mood data shows that social interactions have a positive effect on your wellbeing. Try to prioritize connecting with others regularly.',
          data: { impact: correlations.social.impact }
        });
      } else if (correlations.social.impact < -0.3) {
        insights.push({
          type: 'insight',
          title: 'You May Need More Alone Time',
          description: 'Your data suggests you might benefit from more personal space and alone time to process your emotions.',
          data: { impact: correlations.social.impact }
        });
      }
    }
  }
  
  // Add mood variability insight
  const variability = calculateMoodVariability(moodEntries);
  if (variability === 'high') {
    insights.push({
      type: 'insight',
      title: 'Your Moods Show Significant Fluctuation',
      description: 'Your emotional landscape is quite varied. Regular mindfulness practices might help you find more stability.',
      data: { variability }
    });
  } else if (variability === 'low') {
    insights.push({
      type: 'insight',
      title: 'Your Mood is Quite Stable',
      description: 'You maintain a consistent emotional state. This stability can be a strength, but don\'t forget to embrace the full range of emotions.',
      data: { variability }
    });
  }
  
  // Add streak insights
  if (data.currentStreak >= 7) {
    insights.push({
      type: 'achievement',
      title: 'Impressive Tracking Streak!',
      description: `You've logged your mood for ${data.currentStreak} consecutive days. Consistent tracking leads to better self-awareness.`,
      data: { streak: data.currentStreak }
    });
  }
  
  return insights;
};

/**
 * Generate personalized recommendations based on mood data
 * @param {Object} data - Mood analytics data
 * @returns {Array} Array of recommendation objects
 */
const generateRecommendations = (data) => {
  if (!data || !data.moodEntries || data.moodEntries.length < 7) {
    return [{
      type: 'general',
      title: 'Start Your Mood Journey',
      description: 'Track your mood daily to receive personalized recommendations.',
      actionLabel: 'Log Mood'
    }];
  }
  
  const dominantMoodGroup = findDominantMoodGroup(data.moodFrequency);
  const recommendations = [];
  
  // Basic recommendations based on dominant mood group
  switch (dominantMoodGroup) {
    case 'joyful':
      recommendations.push({
        type: 'connection',
        title: 'Share Your Positive Energy',
        description: 'You\'re experiencing a lot of positive emotions. Consider using this energy to connect with others who might need support.',
        actionLabel: 'Send a Hug'
      });
      break;
      
    case 'peaceful':
      recommendations.push({
        type: 'reflection',
        title: 'Deepen Your Mindfulness Practice',
        description: 'Your peaceful state is a great foundation for deeper mindfulness. Consider trying more advanced meditation techniques.',
        actionLabel: 'Explore Mindfulness'
      });
      break;
      
    case 'sad':
      recommendations.push({
        type: 'support',
        title: 'Gentle Support System',
        description: 'You\'ve been experiencing sadness lately. Consider reaching out to friends or trying mood-boosting activities like nature walks or creative expression.',
        actionLabel: 'Connect with Support'
      });
      break;
      
    case 'anxious':
      recommendations.push({
        type: 'coping',
        title: 'Anxiety Management Techniques',
        description: 'Your data shows patterns of anxiety. Try grounding exercises, deep breathing, or progressive muscle relaxation.',
        actionLabel: 'Learn Techniques'
      });
      break;
      
    case 'angry':
      recommendations.push({
        type: 'regulation',
        title: 'Healthy Expression Techniques',
        description: 'Channel your strong emotions into constructive outlets like physical exercise, journaling, or talking with a trusted friend.',
        actionLabel: 'Try Techniques'
      });
      break;
      
    default:
      recommendations.push({
        type: 'general',
        title: 'Explore Your Emotional Patterns',
        description: 'Try adding context to your mood tracking to discover deeper patterns in your emotional life.',
        actionLabel: 'Add Context'
      });
  }
  
  // Add time-based recommendations
  if (data.moodByTimeOfDay) {
    const worstTime = findExtremeTimeOfDay(data.moodByTimeOfDay, 'worst');
    if (worstTime) {
      recommendations.push({
        type: 'timing',
        title: `${worstTime.timeLabel} Support Plan`,
        description: `Your mood tends to dip during the ${worstTime.timeLabel.toLowerCase()}. Prepare for this time with mood-supporting activities.`,
        actionLabel: 'Create Plan',
        data: { timeOfDay: worstTime.timeOfDay }
      });
    }
  }
  
  // Add activity recommendations
  if (data.correlations && data.correlations.activities) {
    // Find activities with positive correlation but low frequency
    const positiveActivities = data.correlations.activities
      .filter(a => a.impact > 0.2 && a.frequency < 0.3)
      .slice(0, 2);
      
    if (positiveActivities.length > 0) {
      positiveActivities.forEach(activity => {
        recommendations.push({
          type: 'activity',
          title: `Do More ${activity.activity}`,
          description: `This activity has a positive effect on your mood but you don't do it very often.`,
          actionLabel: 'Schedule Activity',
          data: { activity: activity.activity, impact: activity.impact }
        });
      });
    }
  }
  
  // Add streak-related recommendation
  if (!data.currentStreak || data.currentStreak < 3) {
    recommendations.push({
      type: 'habit',
      title: 'Build Your Tracking Habit',
      description: 'Regular mood tracking gives you the most accurate insights. Try setting a daily reminder.',
      actionLabel: 'Set Reminder'
    });
  }
  
  // Add social recommendations
  if (data.correlations && data.correlations.social) {
    const socialImpact = data.correlations.social.impact;
    
    if (socialImpact > 0.3 && data.correlations.social.frequency < 0.4) {
      recommendations.push({
        type: 'social',
        title: 'Increase Social Connections',
        description: 'Social interactions improve your mood. Consider scheduling more time with friends or joining group activities.',
        actionLabel: 'Find Connections'
      });
    } else if (socialImpact < -0.2 && data.correlations.social.frequency > 0.6) {
      recommendations.push({
        type: 'solitude',
        title: 'Balance Social Energy',
        description: 'You might benefit from more alone time to recharge. Schedule some peaceful solitude in your week.',
        actionLabel: 'Plan Me-Time'
      });
    }
  }
  
  return recommendations;
};

/**
 * Find best or worst day based on mood scores
 * @param {Object} moodByDayOfWeek - Mood scores by day of week
 * @param {string} type - 'best' or 'worst'
 * @returns {Object|null} Day information
 */
const findExtremeDay = (moodByDayOfWeek, type) => {
  if (!moodByDayOfWeek) return null;
  
  let extremeDay = null;
  let extremeScore = type === 'best' ? -Infinity : Infinity;
  const compare = type === 'best' 
    ? (curr, extreme) => curr > extreme
    : (curr, extreme) => curr < extreme;
  
  Object.entries(moodByDayOfWeek).forEach(([day, data]) => {
    if (compare(data.averageScore, extremeScore)) {
      extremeScore = data.averageScore;
      extremeDay = {
        day,
        score: data.averageScore,
        count: data.count
      };
    }
  });
  
  // Only return if we have enough data
  return extremeDay && extremeDay.count >= 3 ? extremeDay : null;
};

/**
 * Find best or worst time of day based on mood scores
 * @param {Object} moodByTimeOfDay - Mood scores by time of day
 * @param {string} type - 'best' or 'worst'
 * @returns {Object|null} Time information
 */
const findExtremeTimeOfDay = (moodByTimeOfDay, type) => {
  if (!moodByTimeOfDay) return null;
  
  let extremeTime = null;
  let extremeScore = type === 'best' ? -Infinity : Infinity;
  const compare = type === 'best' 
    ? (curr, extreme) => curr > extreme
    : (curr, extreme) => curr < extreme;
  
  const timeLabels = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night'
  };
  
  Object.entries(moodByTimeOfDay).forEach(([timeOfDay, data]) => {
    if (compare(data.averageScore, extremeScore)) {
      extremeScore = data.averageScore;
      extremeTime = {
        timeOfDay,
        timeLabel: timeLabels[timeOfDay],
        score: data.averageScore,
        count: data.count
      };
    }
  });
  
  // Only return if we have enough data
  return extremeTime && extremeTime.count >= 3 ? extremeTime : null;
};