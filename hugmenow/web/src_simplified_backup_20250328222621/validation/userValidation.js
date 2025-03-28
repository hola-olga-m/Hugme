/**
 * User validation utility functions
 * These functions validate user input before submission
 */

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const isValidUsername = (username) => {
  // Username must be 3-20 characters, alphanumeric + underscore, no spaces
  // Must not be an email address (cannot contain @ symbol)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username) && !username.includes('@');
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const isValidEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Object with validation results
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      length: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false
    };
  }
  
  const validations = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  
  const isValid = Object.values(validations).every(v => v);
  
  return {
    ...validations,
    isValid
  };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const isValidName = (name) => {
  // Name must be at least 2 characters
  return name && name.trim().length >= 2;
};

/**
 * Get specific error message for validation failure
 * @param {string} field - Field that failed validation
 * @param {any} value - Value that failed validation
 * @returns {string} Error message
 */
export const getValidationErrorMessage = (field, value) => {
  switch (field) {
    case 'username':
      if (!value) return 'Username is required';
      if (value.length < 3) return 'Username must be at least 3 characters';
      if (value.length > 20) return 'Username must be at most 20 characters';
      if (value.includes('@')) return 'Username cannot be an email address (no @ symbol allowed)';
      return 'Username can only contain letters, numbers, and underscores';
      
    case 'email':
      if (!value) return 'Email is required';
      return 'Please enter a valid email address';
      
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Password must include at least one uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must include at least one lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must include at least one number';
      return 'Password does not meet requirements';
      
    case 'name':
      if (!value) return 'Name is required';
      return 'Name must be at least 2 characters';
      
    default:
      return 'Invalid input';
  }
};