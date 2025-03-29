
/**
 * Utility for handling API responses and errors consistently
 */

export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, options);
    
    console.log(`[API Response] Status: ${response.status} ${response.statusText}`);
    
    // Try to get the content type from headers
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    
    // Clone the response so we can log the body and still return it
    const responseClone = response.clone();
    
    // Log the first part of the response for debugging
    try {
      const bodyText = await responseClone.text();
      console.log(`[API Response Body] ${bodyText.substring(0, 150)}${bodyText.length > 150 ? '...' : ''}`);
      
      // If we get HTML when expecting JSON, log it clearly
      if (bodyText.trim().startsWith('<!DOCTYPE') || bodyText.trim().startsWith('<html')) {
        console.error('[API Error] Received HTML instead of JSON. This usually indicates a server error or middleware issue.');
      }
    } catch (err) {
      console.error('[API Response] Failed to log response body:', err);
    }
    
    if (!response.ok) {
      let errorData;
      let errorMessage = `Request failed with status ${response.status}`;
      
      if (isJson) {
        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          console.error('Failed to parse error response as JSON:', err);
        }
      } else {
        try {
          const text = await response.text();
          
          // Check if we received HTML when we expected JSON
          if (text.includes('<!DOCTYPE html>') || text.includes('<html>')) {
            errorMessage = 'Server returned HTML instead of JSON. This typically indicates a server error.';
            console.error('[API Error] HTML Response:', text.substring(0, 200));
          } else {
            errorMessage = text || errorMessage;
          }
        } catch (err) {
          console.error('Failed to read error response as text:', err);
        }
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      error.response = response;
      throw error;
    }
    
    // If response is fine, try to parse it as JSON
    if (isJson) {
      return await response.json();
    } else {
      // For non-JSON responses, return the text
      return await response.text();
    }
  } catch (error) {
    // Handle fetch errors (network issues, etc.)
    if (!error.status) {
      console.error('[API Network Error]', error);
      error.message = `Network error: ${error.message}`;
    }
    
    throw error;
  }
};

export const handleAuthError = (error) => {
  // Check if the error is an authentication error
  if (error.status === 401 || 
      error.status === 403 || 
      (error.message && (
        error.message.includes('authentication') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('token') ||
        error.message.includes('login')
      ))) {
    
    console.error('[Auth Error] Authentication failed:', error);
    
    // Clear any stored tokens to force re-login
    localStorage.removeItem('token');
    
    // Redirect to login page
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login?error=session_expired';
    }
    
    return true;
  }
  
  return false;
};

export default fetchWithErrorHandling;
