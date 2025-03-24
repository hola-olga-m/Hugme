console.log('Main chunk loaded (fixed version)');

// User state management - using window object to avoid duplicate declarations
window.userState = window.userState || {
  isAuthenticated: false,
  isAnonymous: false,
  token: null,
  user: null
};

// Load saved authentication state from localStorage
function loadSavedAuthState() {
  if (window.localStorage) {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      window.userState.token = savedToken;
      window.userState.isAuthenticated = true;
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        window.userState.user = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }

    const isAnonymous = localStorage.getItem('isAnonymous');
    if (isAnonymous === 'true') {
      window.userState.isAnonymous = true;
    }
  }
}

// Initialize the application
function initializeApp() {
  loadSavedAuthState();
  
  // Wait for GraphQL service to be available with retries
  waitForGraphQLService(10, 500, 1);
}

// Helper function to wait for GraphQL service to be available
function waitForGraphQLService(retries, delay, attempt) {
  if (window.graphqlService && typeof window.graphqlService.initialize === 'function') {
    console.log('GraphQL service found, initializing connection');
    window.graphqlService.initialize();
    
    // Check if initialization was successful
    if (window.graphqlService.initialized) {
      console.log('GraphQL client initialized successfully');
      
      // Authenticate with stored token if available
      if (window.userState.isAuthenticated && window.userState.token) {
        console.log('Setting authentication token in GraphQL client');
        window.graphqlService.setAuthToken(window.userState.token);
      }
      return true;
    }
  }
  
  // If we have tries left, wait and try again
  if (attempt <= retries) {
    console.log(`Waiting for GraphQL service (attempt ${attempt}/${retries})...`);
    setTimeout(function() {
      // If service appeared, initialize it
      if (window.graphqlService && typeof window.graphqlService.initialize === 'function') {
        console.log('GraphQL service found, initializing connection');
        window.graphqlService.initialize();
        
        // Check if initialization was successful
        if (window.graphqlService.initialized) {
          console.log('GraphQL client initialized successfully');
          
          // Authenticate with stored token if available
          if (window.userState.isAuthenticated && window.userState.token) {
            console.log('Setting authentication token in GraphQL client');
            window.graphqlService.setAuthToken(window.userState.token);
          }
        } else {
          // Try again if not initialized
          waitForGraphQLService(retries, delay, attempt + 1);
        }
      } else {
        // Try again if service not found
        waitForGraphQLService(retries, delay, attempt + 1);
      }
    }, delay);
    return true;
  }
  
  // We've run out of retries
  console.error('GraphQL service not available after multiple attempts. Application requires GraphQL to function.');
  showNotification('Error', 'Could not connect to the server. Please try again later.', { type: 'error', duration: 10000 });
  return false;
}

// Helper function to show notifications
function showNotification(title, message, options = {}) {
  const notificationContainer = document.getElementById('notification-container') || createNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification ${options.type || 'info'}`;
  notification.innerHTML = `
    <div class="notification-title">${title}</div>
    <div class="notification-message">${message}</div>
    <button class="notification-close">&times;</button>
  `;
  
  notificationContainer.appendChild(notification);
  
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.add('notification-closing');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-close after duration
  const duration = options.duration || 5000;
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('notification-closing');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, duration);
  
  return notification;
}

// Helper to create notification container if it doesn't exist
function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notification-container';
  document.body.appendChild(container);
  return container;
}

// Navigation helper
function navigateTo(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    handleNavigation();
  }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing application...');
  
  // Add navigation event listener
  window.addEventListener('popstate', handleNavigation);
  
  // Add click handler for navigation links
  document.body.addEventListener('click', function(e) {
    // Find closest anchor tag
    let target = e.target;
    while (target && target !== document.body) {
      if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href')) {
        const href = target.getAttribute('href');
        
        // Skip external links and special protocols
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
          return;
        }
        
        // Prevent default and handle navigation
        e.preventDefault();
        navigateTo(href);
        return;
      }
      target = target.parentNode;
    }
  });
  
  // Initialize app
  initializeApp();
  
  // Render initial view
  handleNavigation();
});

function handleNavigation() {
  const path = window.location.pathname;
  console.log('Handling navigation to:', path);
  
  // Skip rendering if React is taking over
  if (window.reactInitialized) {
    console.log('React is handling the UI, skipping manual navigation');
    return;
  }
  
  // Get the content container
  const contentContainer = document.getElementById('content') || document.getElementById('root');
  if (!contentContainer) {
    console.error('Content container not found');
    return;
  }
  
  // Check authentication for protected routes
  const protectedRoutes = ['/dashboard', '/mood', '/hug', '/profile', '/settings', '/community'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute && !window.userState.isAuthenticated) {
    console.log('Protected route detected, redirecting to login');
    window.history.replaceState({}, '', '/login');
    contentContainer.innerHTML = getPageContent('/login');
    bindEventHandlers();
    return;
  }
  
  // Render the page content
  contentContainer.innerHTML = getPageContent(path);
  
  // Bind event handlers for the new content
  bindEventHandlers();
}

function getPageContent(path) {
  // If path is a sub-path, use the main path for routing
  const mainPath = path.split('/')[1] ? '/' + path.split('/')[1] : path;
  
  switch (mainPath) {
    case '/':
      return `
        <div class="landing-page">
          <h1>Welcome to HugMood</h1>
          <p>Track your mood and share virtual hugs with friends.</p>
          <div class="cta-buttons">
            <a href="/login" class="btn btn-primary">Log In</a>
            <a href="/register" class="btn btn-secondary">Sign Up</a>
            <button id="anonymous-login" class="btn btn-tertiary">Continue as Guest</button>
          </div>
        </div>
      `;
    case '/login':
      return `
        <div class="auth-container">
          <h2>Log In</h2>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email or Username</label>
              <input type="text" id="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" class="form-control" required>
            </div>
            <div class="form-options">
              <label>
                <input type="checkbox" id="remember-me"> Remember me
              </label>
              <a href="/forgot-password" class="forgot-password">Forgot password?</a>
            </div>
            <button type="submit" class="form-button">Log In</button>
          </form>
          <div class="auth-separator">
            <span>or</span>
          </div>
          <div class="social-login">
            <button class="social-button google">
              <span class="icon">G</span>
              <span>Continue with Google</span>
            </button>
            <button class="social-button facebook">
              <span class="icon">f</span>
              <span>Continue with Facebook</span>
            </button>
            <button class="social-button apple">
              <span class="icon">🍎</span>
              <span>Continue with Apple</span>
            </button>
          </div>
          <div class="auth-footer">
            <p>Don't have an account? <a href="/register">Sign Up</a></p>
            <p><button id="anonymous-login-alt" class="link-button">Continue as Guest</button></p>
          </div>
        </div>
      `;
    case '/register':
      return `
        <div class="auth-container">
          <h2>Create an Account</h2>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" class="form-control" required>
            </div>
            <div class="form-options">
              <label>
                <input type="checkbox" id="terms-agree" required> I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
            <button type="submit" class="form-button">Sign Up</button>
          </form>
          <div class="auth-separator">
            <span>or</span>
          </div>
          <div class="social-login">
            <button class="social-button google">
              <span class="icon">G</span>
              <span>Sign up with Google</span>
            </button>
            <button class="social-button facebook">
              <span class="icon">f</span>
              <span>Sign up with Facebook</span>
            </button>
            <button class="social-button apple">
              <span class="icon">🍎</span>
              <span>Sign up with Apple</span>
            </button>
          </div>
          <div class="auth-footer">
            <p>Already have an account? <a href="/login">Log In</a></p>
            <p><button id="anonymous-login-alt" class="link-button">Continue as Guest</button></p>
          </div>
        </div>
      `;
    // Additional routes and their HTML content can be added here
    default:
      return '<div class="error-page"><h2>Page Not Found</h2><p>Sorry, the page you are looking for does not exist.</p><a href="/" class="btn btn-primary">Go to Home</a></div>';
  }
}

function bindEventHandlers() {
  // Bind login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Bind register form handler
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
  }
  
  // Bind anonymous login handlers
  const anonymousLoginBtn = document.getElementById('anonymous-login');
  if (anonymousLoginBtn) {
    anonymousLoginBtn.addEventListener('click', startAnonymousSession);
  }
  
  const anonymousLoginAltBtn = document.getElementById('anonymous-login-alt');
  if (anonymousLoginAltBtn) {
    anonymousLoginAltBtn.addEventListener('click', startAnonymousSession);
  }
  
  // Other event handlers could be added here
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validate inputs
  if (!email || !password) {
    showNotification('Error', 'Please fill in all fields', { type: 'error' });
    return;
  }
  
  // Show loading state
  showNotification('Processing', 'Logging in...', { type: 'info', duration: 2000 });
  
  // Use GraphQL for login
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Logging in via GraphQL');
    
    const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        login(input: {email: $email, password: $password}) {
          token
          user {
            id
            username
            email
            displayName
            avatarUrl
            isAnonymous
          }
        }
      }
    `;
    
    window.graphqlService.executeMutation(loginMutation, { email, password })
      .then(data => {
        if (data && data.login) {
          console.log('GraphQL login successful');
          
          // Store the returned token and user info
          const { token, user } = data.login;
          window.userState.isAuthenticated = true;
          window.userState.user = user;
          window.userState.token = token;
          window.userState.isAnonymous = user.isAnonymous || false;
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAnonymous', user.isAnonymous || false);
          
          showNotification('Success', 'You have successfully logged in', { type: 'success' });
          navigateTo('/dashboard');
        } else {
          console.error('GraphQL login failed - no data returned');
          showNotification('Error', 'Login failed. Please check your credentials.', { type: 'error' });
        }
      })
      .catch(error => {
        console.error('GraphQL login error:', error);
        showNotification('Error', error.message || 'An error occurred during login', { type: 'error' });
      });
  } else {
    // Fallback to WebSocket if GraphQL is not available
    console.log('GraphQL not available, fallback auth not implemented');
    showNotification('Error', 'Authentication service unavailable', { type: 'error' });
  }
}

function handleRegistration(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const termsAgree = document.getElementById('terms-agree').checked;
  
  // Validate inputs
  if (!username || !email || !password || !confirmPassword) {
    showNotification('Error', 'Please fill in all fields', { type: 'error' });
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('Error', 'Passwords do not match', { type: 'error' });
    return;
  }
  
  if (!termsAgree) {
    showNotification('Error', 'You must agree to the Terms of Service and Privacy Policy', { type: 'error' });
    return;
  }
  
  // Show loading state
  showNotification('Processing', 'Creating your account...', { type: 'info', duration: 2000 });
  
  // Use GraphQL for registration
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Registering via GraphQL');
    
    const registerMutation = `
      mutation Register($username: String!, $email: String!, $password: String!) {
        register(input: {username: $username, email: $email, password: $password}) {
          token
          user {
            id
            username
            email
            displayName
            avatarUrl
            isAnonymous
          }
        }
      }
    `;
    
    window.graphqlService.executeMutation(registerMutation, { username, email, password })
      .then(data => {
        if (data && data.register) {
          console.log('GraphQL registration successful');
          
          // Store the returned token and user info
          const { token, user } = data.register;
          window.userState.isAuthenticated = true;
          window.userState.user = user;
          window.userState.token = token;
          window.userState.isAnonymous = false;
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAnonymous', 'false');
          
          showNotification('Success', 'Account created successfully!', { type: 'success' });
          navigateTo('/onboarding');
        } else {
          console.error('GraphQL registration failed - no data returned');
          showNotification('Error', 'Registration failed. Please try again.', { type: 'error' });
        }
      })
      .catch(error => {
        console.error('GraphQL registration error:', error);
        showNotification('Error', error.message || 'An error occurred during registration', { type: 'error' });
      });
  } else {
    // Fallback to WebSocket if GraphQL is not available
    console.log('GraphQL not available, fallback registration not implemented');
    showNotification('Error', 'Registration service unavailable', { type: 'error' });
  }
}

function startAnonymousSession() {
  // Use GraphQL for anonymous login
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Starting anonymous session via GraphQL');
    showNotification('Processing', 'Setting up guest access...', { type: 'info', duration: 2000 });
    
    const anonymousLoginMutation = `
      mutation AnonymousLogin($nickname: String) {
        anonymousLogin(input: {nickname: $nickname}) {
          token
          user {
            id
            username
            isAnonymous
            avatarUrl
          }
        }
      }
    `;
    
    window.graphqlService.executeMutation(anonymousLoginMutation, { nickname: 'Guest' })
      .then(data => {
        if (data && data.anonymousLogin) {
          console.log('GraphQL anonymous login successful');
          
          // Store the returned token and user info
          const { token, user } = data.anonymousLogin;
          window.userState.isAuthenticated = true;
          window.userState.user = user;
          window.userState.token = token;
          window.userState.isAnonymous = true;
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAnonymous', 'true');
          
          showNotification('Success', 'Continuing as guest', { type: 'success' });
          navigateTo('/dashboard');
        } else {
          console.error('GraphQL anonymous login failed - no data returned');
          showNotification('Error', 'Guest access failed. Please try again.', { type: 'error' });
        }
      })
      .catch(error => {
        console.error('GraphQL anonymous login error:', error);
        showNotification('Error', error.message || 'An error occurred during guest login', { type: 'error' });
      });
  } else {
    // Fallback to WebSocket if GraphQL is not available
    console.log('GraphQL not available, fallback anonymous login not implemented');
    showNotification('Error', 'Guest access service unavailable', { type: 'error' });
  }
}

// Call initializeApp when window finishes loading to ensure everything is ready
window.addEventListener('load', function() {
  // Check if React has taken over
  if (!window.reactInitialized) {
    console.log('Window fully loaded, ensuring application is initialized');
    
    // If React hasn't initialized yet, make sure our simple app is running
    if (!window.appInitialized) {
      console.log('Application not initialized yet, doing it now');
      window.appInitialized = true;
      initializeApp();
      handleNavigation();
    }
  }
});