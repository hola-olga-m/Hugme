console.log('Main chunk loaded');

// User state management
const userState = {
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
      userState.token = savedToken;
      userState.isAuthenticated = true;
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        userState.user = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }

    const isAnonymous = localStorage.getItem('isAnonymous');
    if (isAnonymous === 'true') {
      userState.isAnonymous = true;
    }
  }
}

// Initialize the application
function initializeApp() {
  loadSavedAuthState();
  
  // Wait for GraphQL service to be available with retries
  waitForGraphQLService(10, 300); // Try 10 times with 300ms delay
}

// Wait for GraphQL service to be available
function waitForGraphQLService(retries = 10, delay = 300, attempt = 1) {
  // If GraphQL service is already available and initialized
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('GraphQL client initialized successfully');
    
    // Authenticate with stored token if available
    if (userState.isAuthenticated && userState.token) {
      console.log('Setting authentication token in GraphQL client');
      window.graphqlService.setAuthToken(userState.token);
    }
    return true;
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
          if (userState.isAuthenticated && userState.token) {
            console.log('Setting authentication token in GraphQL client');
            window.graphqlService.setAuthToken(userState.token);
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

// Handle authentication response
function handleAuthResponse(message) {
  console.log('Auth response received:', message);
  
  if (message.success) {
    userState.isAuthenticated = true;
    userState.user = message.user;
    userState.token = message.token;
    userState.isAnonymous = message.user.isAnonymous || false;
    
    // Save to localStorage
    localStorage.setItem('token', message.token);
    localStorage.setItem('user', JSON.stringify(message.user));
    localStorage.setItem('isAnonymous', userState.isAnonymous ? 'true' : 'false');
    
    // Set token in GraphQL service
    if (window.graphqlService) {
      window.graphqlService.setAuthToken(message.token);
    }
    
    showNotification('Success', 'You are now logged in!', { type: 'success' });

    // Update navigation if needed
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
      navigateTo('/mood');
    } else {
      // Refresh current page content
      document.getElementById('page-content').innerHTML = getCurrentPage();
      setupPageEventHandlers(); // Ensure event handlers are set up after page change
    }
  } else {
    showNotification('Authentication Failed', message.error || 'Unknown error occurred', { type: 'error' });
  }
}

// Basic notification system
function showNotification(title, message, options = {}) {
  const notificationContainer = document.getElementById('notification-container') || 
    createNotificationContainer();

  const notification = document.createElement('div');
  notification.className = `notification ${options.type || 'info'}`;
  notification.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
  `;

  notificationContainer.appendChild(notification);

  // Auto-remove after a delay
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notificationContainer.removeChild(notification);
    }, 500);
  }, options.duration || 5000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notification-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  `;
  document.body.appendChild(container);
  return container;
}

// Authentication functions
function login(email, password) {
  if (!email || !password) {
    showNotification('Validation Error', 'Please fill in all fields', { type: 'error' });
    return;
  }

  // Use GraphQL for login
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Sending GraphQL login request');
    showNotification('Processing', 'Logging in...', { type: 'info', duration: 2000 });
    
    // Use GraphQL mutation to login
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
          userState.isAuthenticated = true;
          userState.user = user;
          userState.token = token;
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          showNotification('Success', 'You are now logged in!', { type: 'success' });
          
          // Update navigation if needed
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            navigateTo('/mood');
          }
        }
      })
      .catch(error => {
        console.error('GraphQL login error:', error);
        showNotification('Login Failed', error.message || 'Unknown error occurred', { type: 'error' });
      });
    
    return;
  } else {
    showNotification('Connection Error', 'GraphQL client not initialized, cannot log in', { type: 'error' });
  }
}

function register(username, email, password, confirmPassword) {
  if (!username || !email || !password || !confirmPassword) {
    showNotification('Validation Error', 'Please fill in all fields', { type: 'error' });
    return;
  }

  if (password !== confirmPassword) {
    showNotification('Validation Error', 'Passwords do not match', { type: 'error' });
    return;
  }

  // Add basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Validation Error', 'Please enter a valid email address', { type: 'error' });
    return;
  }

  // Add password strength validation
  if (password.length < 8) {
    showNotification('Validation Error', 'Password must be at least 8 characters long', { type: 'error' });
    return;
  }

  // Use GraphQL for registration
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Sending GraphQL registration request');
    showNotification('Processing', 'Creating your account...', { type: 'info', duration: 2000 });
    
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
          userState.isAuthenticated = true;
          userState.user = user;
          userState.token = token;
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          showNotification('Success', 'Your account has been created!', { type: 'success' });
          
          // Navigate to mood page
          navigateTo('/mood');
        }
      })
      .catch(error => {
        console.error('GraphQL registration error:', error);
        showNotification('Registration Failed', error.message || 'Unknown error occurred', { type: 'error' });
      });
  } else {
    showNotification('Connection Error', 'GraphQL client not initialized, cannot register', { type: 'error' });
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAnonymous');
  userState.isAuthenticated = false;
  userState.user = null;
  userState.token = null;
  userState.isAnonymous = false;

  // Clear GraphQL auth token
  if (window.graphqlService) {
    window.graphqlService.clearAuthToken();
  }

  showNotification('Logged Out', 'You have been successfully logged out', { type: 'info' });
  navigateTo('/');
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
          userState.isAuthenticated = true;
          userState.user = user;
          userState.token = token;
          userState.isAnonymous = true;
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAnonymous', 'true');
          
          showNotification('Success', 'You are now using the app as a guest!', { type: 'success' });
          
          // Navigate to mood page
          navigateTo('/mood');
        }
      })
      .catch(error => {
        console.error('GraphQL anonymous login error:', error);
        showNotification('Anonymous Login Failed', error.message || 'Unknown error occurred', { type: 'error' });
      });
  } else {
    showNotification('Connection Error', 'GraphQL client not initialized, cannot create anonymous session', { type: 'error' });
  }
}

// Mood tracking functions
function submitMood(moodData) {
  if (!userState.isAuthenticated) {
    showNotification('Authentication Required', 'Please log in to track your mood', { type: 'warning' });
    return;
  }

  // Use GraphQL to submit mood
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Submitting mood via GraphQL:', moodData);
    
    const createMoodMutation = `
      mutation CreateMoodEntry($input: MoodInput!) {
        createMoodEntry(input: $input) {
          id
          userId
          mood
          value
          note
          createdAt
        }
      }
    `;
    
    window.graphqlService.executeMutation(createMoodMutation, { input: moodData })
      .then(data => {
        if (data && data.createMoodEntry) {
          console.log('Mood submitted successfully:', data.createMoodEntry);
          showNotification('Success', 'Your mood has been recorded!', { type: 'success' });
          
          // Refresh the current page to show the new mood
          if (window.location.pathname === '/mood') {
            document.getElementById('page-content').innerHTML = getCurrentPage();
            setupPageEventHandlers();
          }
        }
      })
      .catch(error => {
        console.error('Error submitting mood:', error);
        showNotification('Error', 'Failed to submit your mood. Please try again.', { type: 'error' });
      });
  } else {
    showNotification('Connection Error', 'GraphQL client not initialized, cannot submit mood', { type: 'error' });
  }
}

// Hug functions
function sendHug(hugData) {
  if (!userState.isAuthenticated) {
    showNotification('Authentication Required', 'Please log in to send hugs', { type: 'warning' });
    return;
  }

  // Use GraphQL to send hug
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('Sending hug via GraphQL:', hugData);
    
    const sendHugMutation = `
      mutation SendHug($input: HugInput!) {
        sendHug(input: $input) {
          id
          senderId
          recipientId
          hugType
          message
          createdAt
        }
      }
    `;
    
    window.graphqlService.executeMutation(sendHugMutation, { input: hugData })
      .then(data => {
        if (data && data.sendHug) {
          console.log('Hug sent successfully:', data.sendHug);
          showNotification('Success', 'Your hug has been sent!', { type: 'success' });
        }
      })
      .catch(error => {
        console.error('Error sending hug:', error);
        showNotification('Error', 'Failed to send your hug. Please try again.', { type: 'error' });
      });
  } else {
    showNotification('Connection Error', 'GraphQL client not initialized, cannot send hug', { type: 'error' });
  }
}

// Page rendering
function getCurrentPage() {
  const path = window.location.pathname;

  // Redirect to login if attempting to access authenticated routes
  const authenticatedRoutes = ['/mood', '/hugs', '/profile', '/settings'];
  if (authenticatedRoutes.includes(path) && !userState.isAuthenticated) {
    navigateTo('/login');
    return `<p>Redirecting to login...</p>`;
  }

  switch(path) {
    case '/login':
      return `
        <h2>Login to Your Account</h2>
        <div class="form-container">
          <div class="form-group">
            <label for="email">Email or Username</label>
            <input type="text" id="email" class="form-control" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <button id="login-button" class="form-button">Login</button>

          <div class="form-divider">
            <span>OR</span>
          </div>

          <button id="anonymous-button" class="form-button secondary">Continue as Guest</button>

          <p class="form-footer">
            Don't have an account? <a href="/register" class="link">Register Now</a>
          </p>
        </div>
      `;
    case '/register':
      return `
        <h2>Create a New Account</h2>
        <div class="form-container">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" class="form-control" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" class="form-control" />
          </div>
          <button id="register-button" class="form-button">Register</button>

          <p class="form-footer">
            Already have an account? <a href="/login" class="link">Login</a>
          </p>
        </div>
      `;
    case '/mood':
      return `
        <h2>How Are You Feeling Today?</h2>
        <div class="mood-container">
          <div class="mood-selector">
            <div class="mood-option" data-mood="great">
              <div class="mood-emoji">😀</div>
              <div class="mood-label">Great</div>
            </div>
            <div class="mood-option" data-mood="good">
              <div class="mood-emoji">🙂</div>
              <div class="mood-label">Good</div>
            </div>
            <div class="mood-option" data-mood="okay">
              <div class="mood-emoji">😐</div>
              <div class="mood-label">Okay</div>
            </div>
            <div class="mood-option" data-mood="sad">
              <div class="mood-emoji">😔</div>
              <div class="mood-label">Sad</div>
            </div>
            <div class="mood-option" data-mood="awful">
              <div class="mood-emoji">😞</div>
              <div class="mood-label">Awful</div>
            </div>
          </div>
          
          <div class="mood-note">
            <textarea id="mood-note" placeholder="Add a note about how you're feeling (optional)..."></textarea>
          </div>
          
          <div class="mood-actions">
            <button id="submit-mood-button" class="form-button">Submit</button>
          </div>
        </div>
        
        <div class="mood-history">
          <h3>Your Mood History</h3>
          <div id="mood-history-content">
            Loading your mood history...
          </div>
        </div>
      `;
    case '/hugs':
      return `
        <h2>Send a Virtual Hug</h2>
        <div class="hug-container">
          <div class="hug-tabs">
            <div class="hug-tab active" data-tab="send-hug">Send Hug</div>
            <div class="hug-tab" data-tab="hug-requests">Hug Requests</div>
            <div class="hug-tab" data-tab="received-hugs">Received Hugs</div>
          </div>
          
          <div class="hug-tab-content active" id="send-hug">
            <div class="form-container">
              <div class="form-group">
                <label for="recipient">Recipient Username</label>
                <input type="text" id="recipient" class="form-control" />
              </div>
              
              <div class="form-group">
                <label>Hug Type</label>
                <div class="hug-type-selector">
                  <div class="hug-type-option selected" data-hug-type="friendly">
                    <div class="hug-emoji">🤗</div>
                    <div class="hug-label">Friendly</div>
                  </div>
                  <div class="hug-type-option" data-hug-type="supportive">
                    <div class="hug-emoji">💪</div>
                    <div class="hug-label">Supportive</div>
                  </div>
                  <div class="hug-type-option" data-hug-type="comforting">
                    <div class="hug-emoji">❤️</div>
                    <div class="hug-label">Comforting</div>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="hug-message">Message (Optional)</label>
                <textarea id="hug-message" class="form-control" placeholder="Add a personal message..."></textarea>
              </div>
              
              <button id="send-hug-button" class="form-button">Send Hug</button>
            </div>
          </div>
          
          <div class="hug-tab-content" id="hug-requests">
            <div class="hug-requests-list">
              Loading hug requests...
            </div>
          </div>
          
          <div class="hug-tab-content" id="received-hugs">
            <div class="received-hugs-list">
              Loading received hugs...
            </div>
          </div>
        </div>
      `;
    case '/profile':
      return `
        <h2>Your Profile</h2>
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-avatar">
              <img src="${userState.user?.avatarUrl || '/images/default-avatar.png'}" alt="Avatar" />
            </div>
            <div class="profile-info">
              <h3>${userState.user?.displayName || userState.user?.username || 'User'}</h3>
              <p>${userState.isAnonymous ? 'Anonymous User' : userState.user?.username || ''}</p>
            </div>
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-value" id="streak-count">0</div>
                <div class="stat-label">Day Streak</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="hugs-count">0</div>
                <div class="stat-label">Hugs</div>
              </div>
            </div>
          </div>
          
          <div class="profile-badges">
            <h3>Your Badges</h3>
            <div class="badges-container" id="badges-list">
              Loading badges...
            </div>
          </div>
          
          <div class="profile-mood-summary">
            <h3>Mood Summary</h3>
            <div class="mood-summary-container" id="mood-summary">
              Loading mood summary...
            </div>
          </div>
        </div>
      `;
    case '/settings':
      return `
        <h2>Settings</h2>
        <div class="settings-container">
          <div class="settings-section">
            <h3>Profile Settings</h3>
            <div class="form-group">
              <label for="display-name">Display Name</label>
              <input type="text" id="display-name" class="form-control" value="${userState.user?.displayName || ''}" />
            </div>
            <div class="form-group">
              <label for="avatar-url">Avatar URL</label>
              <input type="text" id="avatar-url" class="form-control" value="${userState.user?.avatarUrl || ''}" />
            </div>
            <button id="save-profile-button" class="form-button">Save Profile</button>
          </div>
          
          <div class="settings-section">
            <h3>Notification Settings</h3>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="enable-notifications" />
                Enable Push Notifications
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="hug-notifications" />
                Hug Notifications
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="streak-notifications" />
                Streak Notifications
              </label>
            </div>
            <button id="save-notifications-button" class="form-button">Save Notification Settings</button>
          </div>
          
          <div class="settings-section">
            <h3>Account Settings</h3>
            <button id="change-password-button" class="form-button secondary">Change Password</button>
            <button id="logout-button" class="form-button secondary">Logout</button>
            ${userState.isAnonymous ? 
              '<button id="convert-account-button" class="form-button accent">Convert to Regular Account</button>' : 
              '<button id="delete-account-button" class="form-button danger">Delete Account</button>'
            }
          </div>
        </div>
      `;
    default:
      return `
        <div class="home-container">
          <div class="hero-section">
            <h1>Welcome to HugMood</h1>
            <p>Track your emotional wellbeing and connect with others through virtual hugs</p>
            ${userState.isAuthenticated ?
              `<a href="/mood" class="cta-button">Track Your Mood</a>` :
              `<div class="cta-buttons">
                <a href="/login" class="cta-button">Login</a>
                <a href="/register" class="cta-button secondary">Register</a>
              </div>`
            }
          </div>
          
          <div class="features-section">
            <div class="feature-item">
              <img src="/screenshots/mood.png" alt="Mood Tracking" />
              <h3>Track Your Mood</h3>
              <p>Log your daily emotions and see patterns over time</p>
            </div>
            <div class="feature-item">
              <img src="/screenshots/hug.png" alt="Send Hugs" />
              <h3>Send Virtual Hugs</h3>
              <p>Support friends and receive comfort from others</p>
            </div>
            <div class="feature-item">
              <img src="/screenshots/home.png" alt="Streaks" />
              <h3>Build Streaks</h3>
              <p>Maintain your wellbeing streak and earn rewards</p>
            </div>
          </div>
        </div>
      `;
  }
}

function setupPageEventHandlers() {
  // Set up event listeners based on current page
  const path = window.location.pathname;
  
  switch(path) {
    case '/login':
      document.getElementById('login-button')?.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
      });
      
      document.getElementById('anonymous-button')?.addEventListener('click', () => {
        startAnonymousSession();
      });
      break;
    case '/register':
      document.getElementById('register-button')?.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        register(username, email, password, confirmPassword);
      });
      break;
    case '/mood':
      // Set up mood selection
      const moodOptions = document.querySelectorAll('.mood-option');
      moodOptions.forEach(option => {
        option.addEventListener('click', () => {
          // Remove selected class from all options
          moodOptions.forEach(o => o.classList.remove('selected'));
          // Add selected class to clicked option
          option.classList.add('selected');
        });
      });
      
      // Set up mood submission
      document.getElementById('submit-mood-button')?.addEventListener('click', () => {
        const selectedMood = document.querySelector('.mood-option.selected');
        if (!selectedMood) {
          showNotification('Error', 'Please select a mood', { type: 'error' });
          return;
        }
        
        const mood = selectedMood.getAttribute('data-mood');
        const note = document.getElementById('mood-note').value;
        
        // Map mood to numeric value
        const moodValues = {
          'great': 5,
          'good': 4,
          'okay': 3,
          'sad': 2,
          'awful': 1
        };
        
        submitMood({
          mood: mood,
          value: moodValues[mood],
          note: note,
          isPublic: false
        });
      });
      
      // Load mood history
      if (userState.isAuthenticated) {
        loadMoodHistory();
      }
      break;
    case '/hugs':
      // Set up hug tabs
      const hugTabs = document.querySelectorAll('.hug-tab');
      hugTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Hide all tab content
          document.querySelectorAll('.hug-tab-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Remove active class from all tabs
          hugTabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Show selected tab content
          const tabId = tab.getAttribute('data-tab');
          document.getElementById(tabId).classList.add('active');
        });
      });
      
      // Set up hug type selection
      const hugTypeOptions = document.querySelectorAll('.hug-type-option');
      hugTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
          // Remove selected class from all options
          hugTypeOptions.forEach(o => o.classList.remove('selected'));
          // Add selected class to clicked option
          option.classList.add('selected');
        });
      });
      
      // Set up send hug button
      document.getElementById('send-hug-button')?.addEventListener('click', () => {
        const recipient = document.getElementById('recipient').value;
        const selectedHugType = document.querySelector('.hug-type-option.selected');
        const message = document.getElementById('hug-message').value;
        
        if (!recipient) {
          showNotification('Error', 'Please enter a recipient username', { type: 'error' });
          return;
        }
        
        if (!selectedHugType) {
          showNotification('Error', 'Please select a hug type', { type: 'error' });
          return;
        }
        
        const hugType = selectedHugType.getAttribute('data-hug-type');
        
        sendHug({
          recipientUsername: recipient,
          hugType: hugType,
          message: message
        });
      });
      
      // Load hug data
      if (userState.isAuthenticated) {
        loadHugRequests();
        loadReceivedHugs();
      }
      break;
    case '/settings':
      // Set up logout button
      document.getElementById('logout-button')?.addEventListener('click', () => {
        logout();
      });
      
      // Set up profile save button
      document.getElementById('save-profile-button')?.addEventListener('click', () => {
        saveProfileSettings();
      });
      
      // Set up notification settings save button
      document.getElementById('save-notifications-button')?.addEventListener('click', () => {
        saveNotificationSettings();
      });
      
      // Load current settings
      loadCurrentSettings();
      break;
  }
}

function loadMoodHistory() {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const historyContainer = document.getElementById('mood-history-content');
  if (!historyContainer) return;
  
  historyContainer.innerHTML = 'Loading your mood history...';
  
  const query = `
    query GetMoodHistory {
      moodHistory {
        id
        mood
        value
        note
        createdAt
      }
    }
  `;
  
  window.graphqlService.executeQuery(query)
    .then(data => {
      if (data && data.moodHistory && data.moodHistory.length > 0) {
        const moodHistoryHTML = data.moodHistory.map(entry => {
          const date = new Date(entry.createdAt);
          const formattedDate = date.toLocaleDateString();
          
          // Map mood value to emoji
          const moodEmojis = {
            'great': '😀',
            'good': '🙂',
            'okay': '😐',
            'sad': '😔',
            'awful': '😞'
          };
          
          const emoji = moodEmojis[entry.mood] || '😐';
          
          return `
            <div class="mood-history-item">
              <div class="mood-history-emoji">${emoji}</div>
              <div class="mood-history-details">
                <div class="mood-history-date">${formattedDate}</div>
                <div class="mood-history-mood">${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</div>
                ${entry.note ? `<div class="mood-history-note">${entry.note}</div>` : ''}
              </div>
            </div>
          `;
        }).join('');
        
        historyContainer.innerHTML = moodHistoryHTML;
      } else {
        historyContainer.innerHTML = '<p>No mood entries yet. Start tracking your mood today!</p>';
      }
    })
    .catch(error => {
      console.error('Error loading mood history:', error);
      historyContainer.innerHTML = '<p>Failed to load mood history. Please try again later.</p>';
    });
}

function loadHugRequests() {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const requestsContainer = document.querySelector('.hug-requests-list');
  if (!requestsContainer) return;
  
  requestsContainer.innerHTML = 'Loading hug requests...';
  
  const query = `
    query GetHugRequests {
      hugRequests {
        id
        senderId
        sender {
          username
          displayName
          avatarUrl
        }
        message
        status
        createdAt
      }
    }
  `;
  
  window.graphqlService.executeQuery(query)
    .then(data => {
      if (data && data.hugRequests && data.hugRequests.length > 0) {
        const requestsHTML = data.hugRequests.map(request => {
          const date = new Date(request.createdAt);
          const formattedDate = date.toLocaleDateString();
          
          return `
            <div class="hug-request-item">
              <div class="hug-request-avatar">
                <img src="${request.sender.avatarUrl || '/images/default-avatar.png'}" alt="Avatar" />
              </div>
              <div class="hug-request-details">
                <div class="hug-request-sender">${request.sender.displayName || request.sender.username}</div>
                <div class="hug-request-message">${request.message || 'No message'}</div>
                <div class="hug-request-date">${formattedDate}</div>
              </div>
              <div class="hug-request-actions">
                <button class="respond-hug-button accept" data-request-id="${request.id}" data-response="accept">Accept</button>
                <button class="respond-hug-button decline" data-request-id="${request.id}" data-response="decline">Decline</button>
              </div>
            </div>
          `;
        }).join('');
        
        requestsContainer.innerHTML = requestsHTML;
        
        // Set up response buttons
        document.querySelectorAll('.respond-hug-button').forEach(button => {
          button.addEventListener('click', () => {
            const requestId = button.getAttribute('data-request-id');
            const response = button.getAttribute('data-response');
            respondToHugRequest(requestId, response);
          });
        });
      } else {
        requestsContainer.innerHTML = '<p>No hug requests at the moment.</p>';
      }
    })
    .catch(error => {
      console.error('Error loading hug requests:', error);
      requestsContainer.innerHTML = '<p>Failed to load hug requests. Please try again later.</p>';
    });
}

function loadReceivedHugs() {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const hugsContainer = document.querySelector('.received-hugs-list');
  if (!hugsContainer) return;
  
  hugsContainer.innerHTML = 'Loading received hugs...';
  
  const query = `
    query GetReceivedHugs {
      receivedHugs {
        id
        senderId
        sender {
          username
          displayName
          avatarUrl
        }
        hugType
        message
        createdAt
      }
    }
  `;
  
  window.graphqlService.executeQuery(query)
    .then(data => {
      if (data && data.receivedHugs && data.receivedHugs.length > 0) {
        const hugsHTML = data.receivedHugs.map(hug => {
          const date = new Date(hug.createdAt);
          const formattedDate = date.toLocaleDateString();
          
          // Map hug type to emoji
          const hugEmojis = {
            'friendly': '🤗',
            'supportive': '💪',
            'comforting': '❤️'
          };
          
          const emoji = hugEmojis[hug.hugType] || '🤗';
          
          return `
            <div class="received-hug-item">
              <div class="received-hug-avatar">
                <img src="${hug.sender.avatarUrl || '/images/default-avatar.png'}" alt="Avatar" />
              </div>
              <div class="received-hug-details">
                <div class="received-hug-sender">${hug.sender.displayName || hug.sender.username}</div>
                <div class="received-hug-emoji">${emoji}</div>
                <div class="received-hug-type">${hug.hugType.charAt(0).toUpperCase() + hug.hugType.slice(1)} Hug</div>
                ${hug.message ? `<div class="received-hug-message">${hug.message}</div>` : ''}
                <div class="received-hug-date">${formattedDate}</div>
              </div>
              <div class="received-hug-actions">
                <button class="hug-back-button" data-user-id="${hug.senderId}">Hug Back</button>
              </div>
            </div>
          `;
        }).join('');
        
        hugsContainer.innerHTML = hugsHTML;
        
        // Set up hug back buttons
        document.querySelectorAll('.hug-back-button').forEach(button => {
          button.addEventListener('click', () => {
            const userId = button.getAttribute('data-user-id');
            navigateTo('/hugs'); // Navigate to hugs page
            // Pre-fill recipient field with the sender's username
            // This would require additional code to find the input and set its value
          });
        });
      } else {
        hugsContainer.innerHTML = '<p>No hugs received yet.</p>';
      }
    })
    .catch(error => {
      console.error('Error loading received hugs:', error);
      hugsContainer.innerHTML = '<p>Failed to load received hugs. Please try again later.</p>';
    });
}

function respondToHugRequest(requestId, response) {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const mutation = `
    mutation RespondToHugRequest($input: HugResponseInput!) {
      respondToHugRequest(input: $input) {
        id
        status
      }
    }
  `;
  
  window.graphqlService.executeMutation(mutation, {
    input: {
      requestId: requestId,
      response: response,
      message: response === 'accept' ? 'Sending a hug back!' : 'Maybe next time.'
    }
  })
    .then(data => {
      if (data && data.respondToHugRequest) {
        showNotification('Success', 
          response === 'accept' ? 'Hug request accepted!' : 'Hug request declined', 
          { type: response === 'accept' ? 'success' : 'info' }
        );
        
        // Reload the hug requests
        loadHugRequests();
      }
    })
    .catch(error => {
      console.error('Error responding to hug request:', error);
      showNotification('Error', 'Failed to respond to hug request. Please try again.', { type: 'error' });
    });
}

function saveProfileSettings() {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const displayName = document.getElementById('display-name').value;
  const avatarUrl = document.getElementById('avatar-url').value;
  
  const mutation = `
    mutation UpdateProfile($input: ProfileUpdateInput!) {
      updateProfile(input: $input) {
        id
        username
        displayName
        avatarUrl
      }
    }
  `;
  
  window.graphqlService.executeMutation(mutation, {
    input: {
      displayName: displayName,
      avatarUrl: avatarUrl
    }
  })
    .then(data => {
      if (data && data.updateProfile) {
        // Update user state
        userState.user = {
          ...userState.user,
          displayName: data.updateProfile.displayName,
          avatarUrl: data.updateProfile.avatarUrl
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(userState.user));
        
        showNotification('Success', 'Profile updated successfully!', { type: 'success' });
      }
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      showNotification('Error', 'Failed to update profile. Please try again.', { type: 'error' });
    });
}

function saveNotificationSettings() {
  const enableNotifications = document.getElementById('enable-notifications').checked;
  const hugNotifications = document.getElementById('hug-notifications').checked;
  const streakNotifications = document.getElementById('streak-notifications').checked;
  
  // Request permission for notifications if needed
  if (enableNotifications && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        saveNotificationSettingsToServer(enableNotifications, hugNotifications, streakNotifications);
      } else {
        showNotification('Permission Denied', 'Notification permission denied. Please enable notifications in your browser settings.', { type: 'warning' });
      }
    });
  } else {
    saveNotificationSettingsToServer(enableNotifications, hugNotifications, streakNotifications);
  }
}

function saveNotificationSettingsToServer(enableNotifications, hugNotifications, streakNotifications) {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const mutation = `
    mutation UpdateNotificationSettings($input: NotificationSettingsInput!) {
      updateNotificationSettings(input: $input) {
        enableNotifications
        hugNotifications
        streakNotifications
      }
    }
  `;
  
  window.graphqlService.executeMutation(mutation, {
    input: {
      enableNotifications,
      hugNotifications,
      streakNotifications
    }
  })
    .then(data => {
      if (data && data.updateNotificationSettings) {
        showNotification('Success', 'Notification settings updated!', { type: 'success' });
      }
    })
    .catch(error => {
      console.error('Error updating notification settings:', error);
      showNotification('Error', 'Failed to update notification settings. Please try again.', { type: 'error' });
    });
}

function loadCurrentSettings() {
  if (!userState.isAuthenticated || !window.graphqlService) {
    return;
  }
  
  const query = `
    query GetUserSettings {
      userSettings {
        enableNotifications
        hugNotifications
        streakNotifications
      }
    }
  `;
  
  window.graphqlService.executeQuery(query)
    .then(data => {
      if (data && data.userSettings) {
        document.getElementById('enable-notifications').checked = data.userSettings.enableNotifications;
        document.getElementById('hug-notifications').checked = data.userSettings.hugNotifications;
        document.getElementById('streak-notifications').checked = data.userSettings.streakNotifications;
      }
    })
    .catch(error => {
      console.error('Error loading user settings:', error);
    });
}

// Helper for page navigation
function navigateTo(path) {
  history.pushState(null, null, path);
  document.getElementById('page-content').innerHTML = getCurrentPage();
  setupPageEventHandlers();
}

// Set up initial page and event handlers
document.addEventListener('DOMContentLoaded', function() {
  // Check if GraphQL service is ready
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('GraphQL service already available, initializing app');
    initializeApp();
  } else {
    // Wait for GraphQL service to be ready
    console.log('Waiting for GraphQL service to be ready...');
    window.addEventListener('graphqlReady', function() {
      console.log('GraphQL service is now ready, initializing app');
      initializeApp();
    });
  }
  
  // Add event listeners for navigation links
  document.body.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.startsWith(window.location.origin)) {
      e.preventDefault();
      navigateTo(new URL(e.target.href).pathname);
    }
  });
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    document.getElementById('page-content').innerHTML = getCurrentPage();
    setupPageEventHandlers();
  });
  
  // Render the initial page
  document.getElementById('page-content').innerHTML = getCurrentPage();
  setupPageEventHandlers();
});