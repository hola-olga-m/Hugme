export default {
  // Common
  app: {
    name: 'HugMeNow',
    tagline: 'Your Emotional Wellness Platform',
    loading: 'Loading...',
    error: 'An error occurred. Please try again.',
    success: 'Success!',
    goBack: 'Go Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    retry: 'Retry',
    actions: 'Actions',
    more: 'More',
    close: 'Close',
    comingSoon: 'Coming Soon!'
  },

  // Auth
  auth: {
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    username: 'Username',
    name: 'Full Name',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful!',
    logoutSuccess: 'Logged out successfully',
    anonymousLogin: 'Continue as Guest',
    nickname: 'Nickname',
    anonymousWelcome: 'Welcome, Guest!',
    createAccount: 'Create Account',
    passwordRequirements: 'Password must be at least 8 characters',
    orContinueWith: 'or continue with'
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome, {{name}}!',
    yourMoods: 'Your Mood History',
    yourHugs: 'Your Hugs',
    yourRequests: 'Your Hug Requests',
    stats: 'Stats & Streaks',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    community: 'Community',
    settings: 'Settings',
    newHug: 'Send New Hug',
    trackMood: 'Track Mood',
    viewAll: 'View All',
    todaysMood: 'Today\'s Mood',
    moodStreak: 'Mood Tracking Streak: {{count}} days'
  },

  // Mood
  mood: {
    track: 'Track Your Mood',
    how: 'How are you feeling?',
    note: 'Add a note (optional)',
    share: 'Share with community',
    private: 'Keep private',
    history: 'Mood History',
    noMoods: 'No moods tracked yet',
    startTracking: 'Start tracking your mood',
    todayAlready: 'You already tracked your mood today',
    update: 'Update mood',
    delete: 'Delete mood',
    excellent: 'Excellent',
    good: 'Good',
    neutral: 'Neutral',
    meh: 'Meh',
    bad: 'Bad',
    terrible: 'Terrible',
    trackSuccess: 'Mood tracked successfully!',
    successStreak: 'Your streak: {{count}} days!'
  },

  // Hugs
  hugs: {
    send: 'Send Hug',
    received: 'Hugs Received',
    sent: 'Hugs Sent',
    new: 'New Hug',
    to: 'To',
    from: 'From',
    type: 'Hug Type',
    message: 'Message (optional)',
    noReceived: 'You haven\'t received any hugs yet',
    noSent: 'You haven\'t sent any hugs yet',
    markRead: 'Mark as Read',
    request: 'Request a Hug',
    response: 'Respond to Request',
    accept: 'Accept',
    decline: 'Decline',
    cancel: 'Cancel Request',
    community: 'Community Requests',
    allRequests: 'All Requests',
    pendingRequests: 'Pending Requests',
    myRequests: 'My Requests',
    noRequests: 'No hug requests',
    createRequest: 'Create a new request',
    requestSuccess: 'Hug request created!',
    respondSuccess: 'Response sent!',
    hugSentSuccess: 'Hug sent successfully!',
    hugTypes: {
      quick: 'Quick Hug',
      warm: 'Warm Hug',
      supportive: 'Supportive Hug',
      comforting: 'Comforting Hug',
      encouraging: 'Encouraging Hug',
      celebratory: 'Celebratory Hug'
    }
  },

  // Profile
  profile: {
    myProfile: 'My Profile',
    editProfile: 'Edit Profile',
    changeAvatar: 'Change Avatar',
    changePassword: 'Change Password',
    preferences: 'Preferences',
    notification: 'Notification Settings',
    language: 'Language',
    theme: 'Theme',
    privacy: 'Privacy Settings',
    delete: 'Delete Account',
    deleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
    saveSuccess: 'Profile updated successfully!'
  },

  // Validation
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {{count}} characters',
    maxLength: 'Must be at most {{count}} characters',
    passwordMatch: 'Passwords must match',
    usernameFormat: 'Username can only contain letters, numbers, and underscores',
    selectOption: 'Please select an option'
  },

  // Errors
  errors: {
    general: 'Something went wrong. Please try again.',
    login: 'Invalid email or password',
    register: 'Registration failed. Email or username might be already in use.',
    network: 'Network error. Please check your connection.',
    unauthorized: 'You must be logged in to access this page',
    notFound: 'Page not found',
    server: 'Server error. Please try again later.'
  }
};