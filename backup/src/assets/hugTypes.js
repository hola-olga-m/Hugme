/**
 * Hug types with their metadata
 */
export const hugTypes = {
  // Standard hug types
  bear: {
    id: 'bear',
    name: 'Bear Hug',
    description: 'A strong, warm embrace that makes you feel protected',
    icon: 'fas fa-paw',
    category: 'comforting',
    intensity: 5,
    duration: 3000,
    supportsGroup: false,
    defaultAnimation: 'bear-hug-animation',
    effects: ['warmth', 'strength']
  },
  
  side: {
    id: 'side',
    name: 'Side Hug',
    description: 'A gentle sideways embrace, perfect for friends',
    icon: 'fas fa-user-friends',
    category: 'friendly',
    intensity: 2,
    duration: 2000,
    supportsGroup: false,
    defaultAnimation: 'side-hug-animation',
    effects: ['friendly', 'casual']
  },
  
  healing: {
    id: 'healing',
    name: 'Healing Hug',
    description: 'A nurturing hug to help someone feel better',
    icon: 'fas fa-hand-holding-heart',
    category: 'healing',
    intensity: 3,
    duration: 4000,
    supportsGroup: false,
    defaultAnimation: 'healing-hug-animation',
    effects: ['sparkles', 'glow', 'heartbeat']
  },
  
  group: {
    id: 'group',
    name: 'Group Hug',
    description: 'Everyone comes together for a shared embrace',
    icon: 'fas fa-users',
    category: 'celebratory',
    intensity: 4,
    duration: 4500,
    supportsGroup: true,
    defaultAnimation: 'group-hug-animation',
    effects: ['circle', 'energy', 'connection']
  },
  
  comforting: {
    id: 'comforting',
    name: 'Comforting Hug',
    description: 'A gentle, soothing embrace when someone needs comfort',
    icon: 'fas fa-cloud',
    category: 'healing',
    intensity: 3,
    duration: 5000,
    supportsGroup: false,
    defaultAnimation: 'comforting-hug-animation',
    effects: ['calming', 'softness']
  },
  
  excited: {
    id: 'excited',
    name: 'Excited Hug',
    description: 'An energetic, bouncy hug to celebrate good news',
    icon: 'fas fa-bolt',
    category: 'celebratory',
    intensity: 5,
    duration: 2500,
    supportsGroup: true,
    defaultAnimation: 'excited-hug-animation',
    effects: ['bounce', 'shake', 'stars']
  },
  
  calming: {
    id: 'calming',
    name: 'Calming Hug',
    description: 'A slow, peaceful embrace to reduce anxiety',
    icon: 'fas fa-spa',
    category: 'healing',
    intensity: 2,
    duration: 6000,
    supportsGroup: false,
    defaultAnimation: 'calming-hug-animation',
    effects: ['breathe', 'waves']
  },
  
  friendly: {
    id: 'friendly',
    name: 'Friendly Hug',
    description: 'A casual, warm greeting between friends',
    icon: 'fas fa-handshake',
    category: 'friendly',
    intensity: 3,
    duration: 2000,
    supportsGroup: true,
    defaultAnimation: 'friendly-hug-animation',
    effects: ['smile', 'brief']
  },
  
  celebratory: {
    id: 'celebratory',
    name: 'Celebration Hug',
    description: 'An enthusiastic hug to commemorate achievements',
    icon: 'fas fa-glass-cheers',
    category: 'celebratory',
    intensity: 4,
    duration: 3000,
    supportsGroup: true,
    defaultAnimation: 'celebratory-hug-animation',
    effects: ['confetti', 'fireworks']
  },
  
  // Special types
  mystery: {
    id: 'mystery',
    name: 'Mystery Hug',
    description: 'A surprise hug with random special effects',
    icon: 'fas fa-question-circle',
    category: 'special',
    intensity: 4,
    duration: 4000,
    supportsGroup: true,
    defaultAnimation: 'mystery-hug-animation',
    effects: ['random', 'surprise']
  },
  
  event: {
    id: 'event',
    name: 'Event Hug',
    description: 'Celebrate special occasions with a customized hug',
    icon: 'fas fa-calendar-day',
    category: 'special',
    intensity: 4,
    duration: 3500,
    supportsGroup: true,
    defaultAnimation: 'event-hug-animation',
    effects: ['theme', 'message']
  },
  
  ar: {
    id: 'ar',
    name: 'AR Hug',
    description: 'Experience a hug in augmented reality',
    icon: 'fas fa-vr-cardboard',
    category: 'special',
    intensity: 3,
    duration: 5000,
    supportsGroup: false,
    defaultAnimation: 'ar-hug-animation',
    effects: ['3d', 'interactive']
  }
};

// Organize hug types by category
export const hugTypesByCategory = Object.values(hugTypes).reduce((acc, hugType) => {
  if (!acc[hugType.category]) {
    acc[hugType.category] = [];
  }
  acc[hugType.category].push(hugType);
  return acc;
}, {});

export default hugTypes;
