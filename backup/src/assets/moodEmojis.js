/**
 * Mood emojis with their labels and values
 */
export const moodEmojis = {
  ecstatic: {
    emoji: '😁',
    label: 'Ecstatic',
    value: 5,
    color: '#FFC107',
    suggestedHugType: 'celebratory'
  },
  
  happy: {
    emoji: '😊',
    label: 'Happy',
    value: 4,
    color: '#8BC34A',
    suggestedHugType: 'excited'
  },
  
  neutral: {
    emoji: '😐',
    label: 'Neutral',
    value: 3,
    color: '#90A4AE',
    suggestedHugType: 'friendly'
  },
  
  sad: {
    emoji: '😔',
    label: 'Sad',
    value: 2,
    color: '#5C6BC0',
    suggestedHugType: 'comforting'
  },
  
  anxious: {
    emoji: '😰',
    label: 'Anxious',
    value: 1.5,
    color: '#42A5F5',
    suggestedHugType: 'calming'
  },
  
  stressed: {
    emoji: '😫',
    label: 'Stressed',
    value: 1,
    color: '#7E57C2',
    suggestedHugType: 'healing'
  },
  
  angry: {
    emoji: '😠',
    label: 'Angry',
    value: 0.5,
    color: '#EF5350',
    suggestedHugType: 'calming'
  }
};

// Group moods by valence (positive, neutral, negative)
export const moodGroups = {
  positive: ['ecstatic', 'happy'],
  neutral: ['neutral'],
  negative: ['sad', 'anxious', 'stressed', 'angry']
};

// Get mood suggestion based on previous mood
export const getMoodTransitionSuggestion = (previousMood, currentMood) => {
  const suggestions = {
    // Positive to negative transitions
    'happy_sad': 'Remember what made you happy before. This feeling will pass.',
    'happy_anxious': 'Take deep breaths. What changed since you were feeling good?',
    'ecstatic_stressed': 'You had great energy before. Try to channel it into addressing what's stressing you.',
    
    // Negative to positive transitions
    'sad_happy': 'Great improvement! What helped you feel better?',
    'anxious_neutral': 'Good job managing your anxiety. Keep using those techniques.',
    'stressed_happy': 'Excellent stress management! How did you turn things around?',
    
    // Consistent negative moods
    'sad_sad': 'You've been feeling down for a while. Consider reaching out for support.',
    'anxious_anxious': 'Persistent anxiety might benefit from talking to someone supportive.',
    'stressed_stressed': 'Ongoing stress can affect your health. Can you reduce some commitments?'
  };
  
  const key = `${previousMood}_${currentMood}`;
  return suggestions[key] || 'Track your mood daily to see patterns and get personalized insights.';
};

export default moodEmojis;
