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
  console.log("checkAuthToken: Token exists =", !!token);
  return !!token;
};

// Add utility to check token expiration
export const isTokenExpired = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return true;

    // Simple check to see if the token is a JWT with correct format
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;

    // For debugging only
    console.log("Token parts:", tokenParts.length);
    return false;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};