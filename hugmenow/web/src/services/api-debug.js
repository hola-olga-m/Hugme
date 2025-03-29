
/**
 * API Debug Utility
 * Helps with debugging API and GraphQL requests
 */

export const logApiRequest = (endpoint, data) => {
  console.log(`[API Request] ${endpoint}:`, data);
};

export const logApiResponse = (endpoint, response, error = null) => {
  if (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    return;
  }
  console.log(`[API Response] ${endpoint}:`, response);
};

export const debugGraphQLError = (error) => {
  console.error('[GraphQL Error]', {
    message: error.message,
    networkError: error.networkError ? {
      statusCode: error.networkError.statusCode,
      message: error.networkError.message
    } : null,
    graphQLErrors: error.graphQLErrors
  });
  
  // Return user-friendly error message
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message;
  } else if (error.networkError) {
    return "Network error occurred. Please check your connection.";
  }
  return error.message || "An unknown error occurred";
};
