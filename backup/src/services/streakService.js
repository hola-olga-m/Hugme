/**
 * Streak Service
 * Manages user wellness streaks and rewards
 */

// Helper function to check if dates are consecutive
const areDatesConsecutive = (date1, date2) => {
  const day1 = new Date(date1).setHours(0, 0, 0, 0);
  const day2 = new Date(date2).setHours(0, 0, 0, 0);
  
  // Check if days are 1 day apart (86400000 ms = 1 day)
  return Math.abs(day1 - day2) === 86400000;
};

// Helper function to check if a date is today
const isToday = (date) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const checkDate = new Date(date).setHours(0, 0, 0, 0);
  return today === checkDate;
};

/**
 * Calculate the current streak for a user
 * @param {Array} activities - User's wellness activities sorted by date (newest first)
 * @returns {Object} Streak information
 */
const calculateCurrentStreak = (activities) => {
  if (!activities || activities.length === 0) {
    return { count: 0, lastActivity: null };
  }

  // Sort activities by date (newest first)
  const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp);

  // Check if the most recent activity was today
  const mostRecent = sortedActivities[0].timestamp;
  const isActiveToday = isToday(mostRecent);
  
  // If user hasn't done anything today, streak might have been broken
  if (!isActiveToday) {
    // Check if the most recent activity was yesterday (streak still valid but not active today)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const isActiveYesterday = new Date(mostRecent).setHours(0, 0, 0, 0) === yesterday.getTime();
    
    if (!isActiveYesterday) {
      // Streak is broken - most recent activity was not yesterday or today
      return { count: 0, lastActivity: mostRecent, needsActivity: true };
    }
  }

  let currentStreak = 1; // Start with 1 (counting the most recent day)
  let prevDate = new Date(mostRecent).setHours(0, 0, 0, 0);

  // Group activities by day to avoid counting multiple activities on same day
  const activityDays = new Set();
  activityDays.add(prevDate);

  for (let i = 1; i < sortedActivities.length; i++) {
    const currentDate = new Date(sortedActivities[i].timestamp).setHours(0, 0, 0, 0);
    
    // Skip if we already counted an activity for this day
    if (activityDays.has(currentDate)) {
      continue;
    }
    
    // Check if dates are consecutive
    const expectedPrevDate = new Date(currentDate);
    expectedPrevDate.setDate(expectedPrevDate.getDate() + 1);
    const expectedPrevTimestamp = expectedPrevDate.setHours(0, 0, 0, 0);
    
    if (prevDate === expectedPrevTimestamp) {
      currentStreak++;
      activityDays.add(currentDate);
      prevDate = currentDate;
    } else {
      // Found a gap in the streak
      break;
    }
  }

  return { 
    count: currentStreak, 
    lastActivity: mostRecent, 
    needsActivity: !isActiveToday,
    activeToday: isActiveToday
  };
};

/**
 * Calculate the longest streak for a user
 * @param {Array} activities - User's wellness activities
 * @returns {number} The longest streak
 */
const calculateLongestStreak = (activities) => {
  if (!activities || activities.length === 0) {
    return 0;
  }

  // Sort activities by date (oldest first to build streaks chronologically)
  const sortedActivities = [...activities].sort((a, b) => a.timestamp - b.timestamp);
  
  // Group activities by day to avoid counting multiple activities on same day
  const activityDayMap = new Map();
  
  for (const activity of sortedActivities) {
    const dayTimestamp = new Date(activity.timestamp).setHours(0, 0, 0, 0);
    activityDayMap.set(dayTimestamp, true);
  }
  
  // Convert to array of timestamps sorted chronologically
  const activityDays = Array.from(activityDayMap.keys()).sort();
  
  let currentStreak = 1;
  let longestStreak = 1;
  
  for (let i = 1; i < activityDays.length; i++) {
    if (areDatesConsecutive(activityDays[i-1], activityDays[i])) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
};

/**
 * Get rewards for a specific streak milestone
 * @param {number} streakCount - The streak count
 * @returns {Array} Array of rewards for the streak milestone
 */
const getStreakRewards = (streakCount) => {
  // Define milestone rewards
  const milestones = [
    { days: 3, rewards: [{ type: 'badge', id: 'streak_3', name: 'Getting Started', description: '3 day wellness streak' }] },
    { days: 7, rewards: [
      { type: 'badge', id: 'streak_7', name: 'Wellness Week', description: '7 day wellness streak' },
      { type: 'points', amount: 50, description: 'Completed 7 day streak' }
    ]},
    { days: 14, rewards: [
      { type: 'badge', id: 'streak_14', name: 'Fortnight of Feeling', description: '14 day wellness streak' },
      { type: 'points', amount: 100, description: 'Completed 14 day streak' }
    ]},
    { days: 21, rewards: [
      { type: 'badge', id: 'streak_21', name: 'Three Week Triumph', description: '21 day wellness streak' },
      { type: 'points', amount: 150, description: 'Completed 21 day streak' },
      { type: 'hugType', id: 'special_21day', name: 'Triumph Hug', description: 'Special hug unlocked for 21 day streak' }
    ]},
    { days: 30, rewards: [
      { type: 'badge', id: 'streak_30', name: 'Monthly Mastery', description: '30 day wellness streak' },
      { type: 'points', amount: 250, description: 'Completed 30 day streak' },
      { type: 'hugType', id: 'special_30day', name: 'Mastery Hug', description: 'Special hug unlocked for 30 day streak' }
    ]},
    { days: 60, rewards: [
      { type: 'badge', id: 'streak_60', name: 'Habitual Wellness', description: '60 day wellness streak' },
      { type: 'points', amount: 500, description: 'Completed 60 day streak' }
    ]},
    { days: 90, rewards: [
      { type: 'badge', id: 'streak_90', name: 'Wellness Warrior', description: '90 day wellness streak' },
      { type: 'points', amount: 750, description: 'Completed 90 day streak' },
      { type: 'theme', id: 'warrior_theme', name: 'Wellness Warrior Theme', description: 'Special app theme unlocked for 90 day streak' }
    ]},
    { days: 180, rewards: [
      { type: 'badge', id: 'streak_180', name: 'Wellness Sage', description: '180 day wellness streak' },
      { type: 'points', amount: 1500, description: 'Completed 180 day streak' },
      { type: 'avatarItem', id: 'sage_glow', name: 'Sage Glow', description: 'Special avatar effect for 180 day streak' }
    ]},
    { days: 365, rewards: [
      { type: 'badge', id: 'streak_365', name: 'Wellness Legend', description: 'Full year wellness streak' },
      { type: 'points', amount: 5000, description: 'Completed 365 day streak' },
      { type: 'theme', id: 'legend_theme', name: 'Legend Theme', description: 'Exclusive app theme unlocked for 365 day streak' },
      { type: 'avatarItem', id: 'legend_aura', name: 'Legend Aura', description: 'Special avatar effect for 365 day streak' }
    ]}
  ];

  // Find milestone that matches the streak count exactly
  const exactMilestone = milestones.find(m => m.days === streakCount);
  if (exactMilestone) {
    return exactMilestone.rewards;
  }
  
  return [];
};

/**
 * Get the next milestone for a user's current streak
 * @param {number} currentStreak - The current streak count
 * @returns {Object|null} The next milestone or null if no more milestones
 */
const getNextMilestone = (currentStreak) => {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365];
  
  for (const milestone of milestones) {
    if (milestone > currentStreak) {
      return {
        days: milestone,
        daysRemaining: milestone - currentStreak
      };
    }
  }
  
  return null; // No more milestones
};

/**
 * Check if user has reached a new streak milestone
 * @param {number} oldStreak - Previous streak count
 * @param {number} newStreak - New streak count
 * @returns {Array|null} Rewards for reached milestone or null
 */
const checkStreakMilestone = (oldStreak, newStreak) => {
  if (newStreak <= oldStreak) {
    return null;
  }
  
  const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365];
  
  for (const milestone of milestones) {
    if (oldStreak < milestone && newStreak >= milestone) {
      return getStreakRewards(milestone);
    }
  }
  
  return null;
};

/**
 * Format a streak summary message for the user
 * @param {Object} streakInfo - The streak information
 * @returns {string} Formatted message
 */
const formatStreakMessage = (streakInfo) => {
  const { count, activeToday, needsActivity } = streakInfo;
  
  if (count === 0) {
    return "You haven't started a wellness streak yet. Log your first mood or send a hug today to begin!";
  }
  
  let message = `Your current wellness streak: ${count} day${count !== 1 ? 's' : ''}`;
  
  if (needsActivity) {
    message += "\n⚠️ Log your mood or send a hug today to keep your streak going!";
  } else if (activeToday) {
    message += "\n✅ You've already maintained your streak today!";
  }
  
  const nextMilestone = getNextMilestone(count);
  if (nextMilestone) {
    message += `\n\nNext milestone: ${nextMilestone.days} days (${nextMilestone.daysRemaining} day${nextMilestone.daysRemaining !== 1 ? 's' : ''} to go)`;
  } else {
    message += "\n\nCongratulations! You've reached all streak milestones. Keep the streak going!";
  }
  
  return message;
};

// Export all functions
module.exports = {
  calculateCurrentStreak,
  calculateLongestStreak,
  getStreakRewards,
  getNextMilestone,
  checkStreakMilestone,
  formatStreakMessage
};