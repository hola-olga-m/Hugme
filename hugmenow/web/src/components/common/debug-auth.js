
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
  console.log("[Auth Debug] Token exists:", !!token);
  return !!token;
};

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error("[Auth Debug] Error parsing user from storage:", error);
    return null;
  }
};

export const isTokenExpired = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return true;
    
    // For JWT tokens, we could check expiration by decoding
    // For this simplified version, we'll just check if token exists
    return false;
  } catch (error) {
    console.error("[Auth Debug] Error checking token expiration:", error);
    return true;
  }
};
