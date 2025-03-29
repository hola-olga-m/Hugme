
/**
 * Auth debugging utility
 * Use this to log detailed authentication flow information
 */

export const logAuthStatus = (location, status) => {
  console.log(`[Auth Debug] ${location}:`, status);
  
  // Add to browser console for visual distinction
  console.group('Auth Debug Details:');
  console.log('Current location:', window.location.href);
  console.log('Status:', status);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
  
  return status;
};

export const checkAuthToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('[Auth Debug] Token exists:', !!token);
  if (token) {
    console.log('[Auth Debug] Token first 10 chars:', token.substring(0, 10) + '...');
  }
  return !!token;
};
