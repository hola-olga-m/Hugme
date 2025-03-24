/**
 * Media-inspired hugs from popular movies, TV shows, and cartoons
 * These are special hug types that users can send with animations and quotes
 * inspired by famous scenes from media
 */

// Collection of media hugs organized by category
export const mediaHugs = {
  movies: [
    {
      id: "movie_forrest_gump",
      title: "Running Hug",
      source: "Forrest Gump",
      character: "Forrest & Jenny",
      year: 1994,
      description: "A heartfelt reunion hug after being apart for a long time",
      quote: "I may not be a smart man, but I know what love is.",
      icon: "fa-running",
      accentColor: "#86C3D7",
      moods: ["love", "nostalgia", "happiness"],
      premium: false,
      animation: "running_reunion"
    },
    {
      id: "movie_titanic",
      title: "I'm Flying Hug",
      source: "Titanic",
      character: "Jack & Rose",
      year: 1997,
      description: "An embrace that makes you feel like you're flying",
      quote: "I'm flying, Jack!",
      icon: "fa-ship",
      accentColor: "#2B65EC",
      moods: ["love", "freedom", "trust"],
      premium: false,
      animation: "flying_embrace"
    },
    {
      id: "movie_notebook",
      title: "Rain Kiss Hug",
      source: "The Notebook",
      character: "Noah & Allie",
      year: 2004,
      description: "A passionate embrace that defies all obstacles",
      quote: "It wasn't over. It still isn't over!",
      icon: "fa-umbrella",
      accentColor: "#6A5ACD",
      moods: ["passion", "love", "longing"],
      premium: true,
      animation: "rain_embrace"
    },
    {
      id: "movie_star_wars",
      title: "Solo Hug",
      source: "Star Wars",
      character: "Han & Leia",
      year: 1980,
      description: "A stubborn but loving embrace between two strong-willed people",
      quote: "I love you. I know.",
      icon: "fa-space-shuttle",
      accentColor: "#000000",
      moods: ["courage", "love", "determination"],
      premium: false,
      animation: "space_embrace"
    }
  ],
  animation: [
    {
      id: "anim_frozen",
      title: "Warm Hug",
      source: "Frozen",
      character: "Olaf",
      year: 2013,
      description: "A warm hug from someone who likes warm hugs",
      quote: "Hi, I'm Olaf and I like warm hugs!",
      icon: "fa-snowflake",
      accentColor: "#A5F2F3",
      moods: ["happiness", "friendship", "comfort"],
      premium: false,
      animation: "warm_hug"
    },
    {
      id: "anim_lilo_stitch",
      title: "Ohana Hug",
      source: "Lilo & Stitch",
      character: "Lilo & Stitch",
      year: 2002,
      description: "A hug that reminds you that family means nobody gets left behind",
      quote: "Ohana means family. Family means nobody gets left behind or forgotten.",
      icon: "fa-paw",
      accentColor: "#4B0082",
      moods: ["family", "belonging", "acceptance"],
      premium: false,
      animation: "ohana_hug"
    },
    {
      id: "anim_inside_out",
      title: "Core Memory Hug",
      source: "Inside Out",
      character: "Joy & Sadness",
      year: 2015,
      description: "A hug that acknowledges all emotions are important",
      quote: "I just wanted Riley to be happy.",
      icon: "fa-brain",
      accentColor: "#FDD023",
      moods: ["empathy", "growth", "understanding"],
      premium: true,
      animation: "emotional_hug"
    },
    {
      id: "anim_up",
      title: "Adventure Hug",
      source: "Up",
      character: "Carl & Russell",
      year: 2009,
      description: "A hug that celebrates new friendships and adventures",
      quote: "Thanks for the adventure. Now go have a new one!",
      icon: "fa-house",
      accentColor: "#FF7F50",
      moods: ["adventure", "friendship", "courage"],
      premium: false,
      animation: "balloon_hug"
    }
  ],
  superhero: [
    {
      id: "hero_spiderman",
      title: "Spider Hug",
      source: "Spider-Man",
      character: "Peter & MJ",
      year: 2002,
      description: "A hug that defies gravity and catches you when you fall",
      quote: "Go get 'em, tiger.",
      icon: "fa-spider",
      accentColor: "#E23636",
      moods: ["protection", "love", "surprise"],
      premium: false,
      animation: "swinging_hug"
    },
    {
      id: "hero_superman",
      title: "Flying Rescue Hug",
      source: "Superman",
      character: "Superman & Lois",
      year: 1978,
      description: "A powerful hug that lifts you up when you need it most",
      quote: "You've got me? Who's got you?!",
      icon: "fa-shield",
      accentColor: "#0066CC",
      moods: ["strength", "safety", "courage"],
      premium: true,
      animation: "flying_rescue"
    }
  ],
  fantasy: [
    {
      id: "fantasy_lotr",
      title: "Fellowship Hug",
      source: "Lord of the Rings",
      character: "Sam & Frodo",
      year: 2001,
      description: "A loyal hug that reminds you you're never alone on your journey",
      quote: "I can't carry it for you, but I can carry you!",
      icon: "fa-ring",
      accentColor: "#C5B358",
      moods: ["loyalty", "friendship", "courage"],
      premium: false,
      animation: "mountain_hug"
    },
    {
      id: "fantasy_harry_potter",
      title: "Magical Hug",
      source: "Harry Potter",
      character: "Molly & Harry",
      year: 2011,
      description: "A motherly hug filled with love and protection",
      quote: "Not my daughter, you b****!",
      icon: "fa-wand",
      accentColor: "#7F0909",
      moods: ["protection", "family", "comfort"],
      premium: false,
      animation: "magical_embrace"
    }
  ],
  classic: [
    {
      id: "classic_et",
      title: "Goodbye Hug",
      source: "E.T.",
      character: "Elliott & E.T.",
      year: 1982,
      description: "A hug that connects hearts even across galaxies",
      quote: "I'll be right here.",
      icon: "fa-finger",
      accentColor: "#BBA14F",
      moods: ["friendship", "farewell", "connection"],
      premium: false,
      animation: "glowing_finger_hug"
    },
    {
      id: "classic_wizard_oz",
      title: "Ruby Slipper Hug",
      source: "The Wizard of Oz",
      character: "Dorothy & friends",
      year: 1939,
      description: "A hug that reminds you there's no place like home",
      quote: "There's no place like home.",
      icon: "fa-house",
      accentColor: "#DB0073",
      moods: ["nostalgia", "friendship", "hope"],
      premium: false,
      animation: "rainbow_hug"
    }
  ],
  scifi: [
    {
      id: "scifi_interstellar",
      title: "Tesseract Hug",
      source: "Interstellar",
      character: "Cooper & Murph",
      year: 2014,
      description: "A hug that transcends time and space",
      quote: "Love is the one thing that transcends time and space.",
      icon: "fa-cube",
      accentColor: "#07004D",
      moods: ["love", "connection", "timelessness"],
      premium: true,
      animation: "time_transcending_hug"
    },
    {
      id: "scifi_matrix",
      title: "Reality Bend Hug",
      source: "The Matrix",
      character: "Neo & Trinity",
      year: 1999,
      description: "A hug that bends the rules of reality",
      quote: "There is no spoon.",
      icon: "fa-tablet",
      accentColor: "#004000",
      moods: ["courage", "truth", "awakening"],
      premium: true,
      animation: "bullet_time_hug"
    }
  ]
};

// Group media hugs by mood for easy filtering
export const mediaHugsByMood = Object.entries(mediaHugs).reduce((moodMap, [category, categoryHugs]) => {
  categoryHugs.forEach(hug => {
    if (hug.moods && hug.moods.length > 0) {
      hug.moods.forEach(mood => {
        if (!moodMap[mood]) {
          moodMap[mood] = [];
        }
        moodMap[mood].push(hug);
      });
    }
  });
  return moodMap;
}, {});

// Flatten all media hugs for easy search
export const allMediaHugs = Object.entries(mediaHugs).reduce((all, [category, categoryHugs]) => {
  all[category] = categoryHugs;
  return all;
}, {});

/**
 * Get a selection of featured media hugs
 * @param {number} count - Number of hugs to return
 * @returns {Array} Array of featured media hugs
 */
export const getFeaturedMediaHugs = (count = 5) => {
  // For now, just get random hugs
  const allHugs = Object.values(mediaHugs).flat();
  const shuffled = [...allHugs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get media hugs filtered by mood
 * @param {string} mood - Mood to filter by
 * @returns {Array} Media hugs matching the mood
 */
export const getMediaHugsByMood = (mood) => {
  if (!mood) return Object.values(mediaHugs).flat();
  return mediaHugsByMood[mood] || [];
};

/**
 * Get the most popular media hugs
 * @param {number} count - Number of hugs to return
 * @returns {Array} Array of popular media hugs
 */
export const getPopularMediaHugs = (count = 3) => {
  // For this demo, we're just returning some hand-picked popular ones
  return [
    mediaHugs.animation[0], // Warm Hug from Frozen
    mediaHugs.movies[0],    // Running Hug from Forrest Gump
    mediaHugs.fantasy[0]    // Fellowship Hug from Lord of the Rings
  ].slice(0, count);
};