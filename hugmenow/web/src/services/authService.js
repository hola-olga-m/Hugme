
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Configure axios with a longer timeout for authentication requests
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increase timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Auth API error:', error);
    
    // Add more detailed error logging
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    }
    
    return Promise.reject(error);
  }
);

import { retry } from '../utils/apiRetry';

export const registerUser = async (userData) => {
  try {
    console.log('Registering user with data:', { ...userData, password: '[REDACTED]' });
    
    // Use retry utility for the registration request
    const response = await retry(() => authAxios.post('/api/auth/register', userData), {
      maxRetries: 3,
      initialDelay: 1000,
      shouldRetry: (error) => {
        // Retry on timeout and server errors
        return (
          error.code === 'ECONNABORTED' || 
          !error.response || 
          (error.response && error.response.status >= 500)
        );
      }
    });
    
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await authAxios.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }
    
    const response = await authAxios.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // Don't throw error on 401/403 - just means user isn't authenticated
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return null;
    }
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { isValid: false };
    }
    
    const response = await authAxios.post('/api/auth/verify-token');
    return { isValid: true, user: response.data };
  } catch (error) {
    console.error('Token verification error:', error);
    return { isValid: false };
  }
};
