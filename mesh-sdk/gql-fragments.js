/**
 * GraphQL fragments for commonly used types
 */

// User fields
const USER_FRAGMENT = `
  id
  username
  email
  name
  avatarUrl
  isAnonymous
  createdAt
  updatedAt
`;

// Mood fields
const MOOD_FRAGMENT = `
  id
  mood
  intensity
  note
  isPublic
  createdAt
`;

// Hug fields
const HUG_FRAGMENT = `
  id
  type
  message
  isRead
  createdAt
`;

// Hug request fields
const HUG_REQUEST_FRAGMENT = `
  id
  message
  isCommunityRequest
  status
  createdAt
  respondedAt
`;

// Friendship fields
const FRIENDSHIP_FRAGMENT = `
  id
  requesterId
  recipientId
  status
  followsMood
  createdAt
  updatedAt
`;

// Mood streak fields
const MOOD_STREAK_FRAGMENT = `
  currentStreak
  longestStreak
  lastMoodDate
  totalMoods
`;

module.exports = {
  USER_FRAGMENT,
  MOOD_FRAGMENT,
  HUG_FRAGMENT,
  HUG_REQUEST_FRAGMENT,
  FRIENDSHIP_FRAGMENT,
  MOOD_STREAK_FRAGMENT
};