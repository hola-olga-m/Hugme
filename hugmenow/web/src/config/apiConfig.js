
/**
 * API Configuration
 */

// Detect environment and set API URL
const getBaseApiUrl = () => {
  // For local development using the API server
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Default: Same origin (works in production)
  return '';
};

export const API_BASE_URL = getBaseApiUrl();
export const API_TIMEOUT = 15000; // 15 seconds

export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  ME: '/api/me',
  
  // User
  USERS: '/api/users',
  USER: (id) => `/api/user?id=${id}`,
  UPDATE_PROFILE: '/api/update-profile',
  
  // Moods
  MOODS: (userId) => `/api/moods?userId=${userId}`,
  CREATE_MOOD: '/api/createMoodEntry',
  
  // Hugs
  HUGS: (userId) => `/api/hugs?userId=${userId}`,
  SEND_HUG: '/api/sendHug',
  RECEIVE_HUG: '/api/receiveHug',
  
  // Health check
  HEALTH: '/api/health',
};

export const getFullUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  ENDPOINTS,
  getFullUrl,
};
