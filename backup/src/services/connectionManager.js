/**
 * ConnectionManager
 * 
 * Manages network connection state and provides different communication
 * strategies based on connection quality and availability.
 * Updated to work with GraphQL using both HTTP and WebSocket protocols.
 */

import { getToken } from './authService';
import * as graphqlService from './graphqlService';

class ConnectionManager {
  constructor() {
    // Connection state
    this.isOnline = navigator.onLine;
    this.isGraphQLConnected = false;
    this.isWebSocketConnected = false;
    this.connectionQuality = 'unknown'; // 'excellent', 'good', 'poor', 'unknown'
    this.listeners = [];
    this.pollInterval = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.offlineQueue = [];
    
    // API URLs
    this.graphqlHttpUrl = '/graphql';
    this.graphqlWsUrl = `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${window.location.hostname}:4000/graphql`;
    this.restApiUrl = '/api';
    
    // Legacy WebSocket URL - will be removed when migration is complete
    this.websocketUrl = `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${window.location.host}/ws`;
    
    // Bind listeners
    window.addEventListener('online', () => this.handleConnectionChange(true));
    window.addEventListener('offline', () => this.handleConnectionChange(false));
  }
  
  /**
   * Initialize connection manager
   * @param {Object} options - Configuration options
   */
  initialize(options = {}) {
    console.log('Initializing ConnectionManager');
    this.setupConnectionQualityCheck();
    
    // Initialize GraphQL client
    this.initializeGraphQL(options);
    
    if (this.isOnline) {
      // Use legacy WebSocket as fallback if specified
      if (options.useLegacyWebSocket) {
        this.connectWebSocket();
      }
    } else {
      console.log('Device is offline, will use offline mode');
      this.enableOfflineMode();
    }
    
    return this;
  }
  
  /**
   * Initialize GraphQL client
   * @param {Object} options - Configuration options
   */
  initializeGraphQL(options = {}) {
    try {
      console.log('Initializing GraphQL client');
      
      // Initialize GraphQL service
      graphqlService.initialize({
        httpUrl: this.graphqlHttpUrl,
        wsUrl: this.graphqlWsUrl,
        token: getToken(),
        onConnected: () => {
          console.log('GraphQL client connected');
          this.isGraphQLConnected = true;
          this.notifyListeners({ type: 'graphql', status: 'connected' });
          this.processOfflineQueue();
        },
        onDisconnected: () => {
          console.log('GraphQL client disconnected');
          this.isGraphQLConnected = false;
          this.notifyListeners({ type: 'graphql', status: 'disconnected' });
        },
        onError: (error) => {
          console.error('GraphQL client error:', error);
          this.notifyListeners({ type: 'graphql', status: 'error', error });
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing GraphQL client:', error);
      // Fall back to legacy WebSocket if GraphQL initialization fails
      if (options.useLegacyWebSocket) {
        this.connectWebSocket();
      } else {
        this.fallbackToPolling();
      }
      return false;
    }
  }
  
  /**
   * Connect to WebSocket server
   * @returns {WebSocket} The WebSocket connection
   */
  connectWebSocket() {
    try {
      const ws = new WebSocket(this.websocketUrl);
      
      ws.addEventListener('open', () => {
        console.log('WebSocket connection established');
        this.isWebSocketConnected = true;
        this.reconnectAttempts = 0;
        this.clearPolling();
        this.processOfflineQueue();
        this.notifyListeners({ type: 'websocket', status: 'connected' });
        
        // Authenticate if token is available
        const token = getToken();
        if (token) {
          this.send({
            type: 'authenticate',
            token: token
          }, 'websocket');
        }
      });
      
      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners({ type: 'message', data });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      ws.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        this.isWebSocketConnected = false;
        this.handleWebSocketDisconnect();
      });
      
      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        this.isWebSocketConnected = false;
      });
      
      this.ws = ws;
      return ws;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.fallbackToPolling();
      return null;
    }
  }
  
  /**
   * Handle WebSocket disconnection
   */
  handleWebSocketDisconnect() {
    // Try to reconnect with exponential backoff
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.isOnline) {
      const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 30000);
      console.log(`WebSocket disconnected. Reconnecting in ${delay/1000} seconds...`);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
        this.connectWebSocket();
        this.reconnectAttempts++;
      }, delay);
    } else if (this.isOnline) {
      console.log('Maximum reconnection attempts reached. Falling back to polling.');
      this.fallbackToPolling();
    } else {
      console.log('Device is offline. Enabling offline mode.');
      this.enableOfflineMode();
    }
    
    this.notifyListeners({ type: 'websocket', status: 'disconnected' });
  }
  
  /**
   * Fallback to REST API polling when WebSocket is unavailable
   */
  fallbackToPolling() {
    if (this.pollInterval) {
      return; // Already polling
    }
    
    console.log('Falling back to polling for updates');
    
    this.pollInterval = setInterval(async () => {
      if (!this.isOnline) {
        console.log('Device is offline, pausing polling');
        return;
      }
      
      try {
        // Poll for new data
        const token = getToken();
        if (!token) {
          console.log('No authentication token, skipping poll');
          return;
        }
        
        const response = await fetch(`${this.restApiUrl}/updates`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Polling failed with status ${response.status}`);
        }
        
        const data = await response.json();
        this.handlePolledData(data);
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    }, 10000); // Poll every 10 seconds
    
    this.notifyListeners({ type: 'polling', status: 'started' });
  }
  
  /**
   * Clear polling interval
   */
  clearPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.notifyListeners({ type: 'polling', status: 'stopped' });
    }
  }
  
  /**
   * Enable offline mode
   */
  enableOfflineMode() {
    console.log('Enabling offline mode');
    // Get data from IndexedDB
    this.loadOfflineData();
    this.notifyListeners({ type: 'connection', status: 'offline' });
  }
  
  /**
   * Load data from IndexedDB for offline use
   */
  async loadOfflineData() {
    try {
      // This would be implemented with IndexedDB
      // For now, we'll just notify that offline data is loaded
      this.notifyListeners({ 
        type: 'offlineData', 
        status: 'loaded', 
        message: 'Using cached data for offline use'
      });
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }
  
  /**
   * Process queued messages when reconnected
   */
  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) {
      return;
    }
    
    console.log(`Processing ${this.offlineQueue.length} queued messages`);
    
    while (this.offlineQueue.length > 0 && (this.isGraphQLConnected || this.isWebSocketConnected || this.isOnline)) {
      const { message, method } = this.offlineQueue.shift();
      
      // Determine best available method, preferring GraphQL
      let preferredMethod = 'auto';
      if (method === 'graphql' && this.isGraphQLConnected) {
        preferredMethod = 'graphql';
      } else if (method === 'websocket' && this.isWebSocketConnected) {
        preferredMethod = 'websocket';
      }
      
      await this.send(message, preferredMethod);
    }
    
    this.notifyListeners({ 
      type: 'offlineQueue', 
      status: 'processed',
      remaining: this.offlineQueue.length
    });
  }
  
  /**
   * Send a message using the best available method
   * @param {Object} message - The message to send
   * @param {string} preferredMethod - Preferred communication method ('graphql', 'websocket', 'rest', 'auto')
   * @returns {Promise<Object>} Response data or status
   */
  async send(message, preferredMethod = 'auto') {
    if (!this.isOnline) {
      console.log('Device is offline, queueing message for later delivery');
      this.offlineQueue.push({ message, method: preferredMethod });
      this.notifyListeners({ 
        type: 'offlineQueue', 
        status: 'added',
        count: this.offlineQueue.length
      });
      return { queued: true, offline: true };
    }
    
    // Determine best method based on connection state and preference
    let method = preferredMethod;
    
    if (method === 'auto') {
      // Prioritize GraphQL, then WebSocket, then REST
      if (this.isGraphQLConnected) {
        method = 'graphql';
      } else if (this.isWebSocketConnected) {
        method = 'websocket';
      } else {
        method = 'rest';
      }
    }
    
    // Handle method not available scenarios
    if (method === 'graphql' && !this.isGraphQLConnected) {
      console.log('GraphQL requested but not connected, falling back to WebSocket/REST');
      method = this.isWebSocketConnected ? 'websocket' : 'rest';
    }
    
    if (method === 'websocket' && !this.isWebSocketConnected) {
      console.log('WebSocket requested but not connected, falling back to REST');
      method = 'rest';
    }
    
    try {
      if (method === 'graphql') {
        return await this.sendGraphQLMessage(message);
      } else if (method === 'websocket') {
        return this.sendWebSocketMessage(message);
      } else {
        return await this.sendRestMessage(message);
      }
    } catch (error) {
      console.error(`Error sending message via ${method}:`, error);
      
      // Try alternative methods if first method fails
      if (method === 'graphql' && this.isOnline) {
        console.log('Falling back to WebSocket/REST');
        try {
          if (this.isWebSocketConnected) {
            return this.sendWebSocketMessage(message);
          } else {
            return await this.sendRestMessage(message);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          this.offlineQueue.push({ message, method: 'rest' });
          return { error: true, message: 'Communication failed' };
        }
      } else if (method === 'websocket' && this.isOnline) {
        console.log('Falling back to REST API');
        try {
          return await this.sendRestMessage(message);
        } catch (fallbackError) {
          console.error('Fallback to REST also failed:', fallbackError);
          this.offlineQueue.push({ message, method: 'rest' });
          return { error: true, message: 'Communication failed' };
        }
      } else if (this.isOnline) {
        // Queue for retry later
        this.offlineQueue.push({ message, method });
        return { queued: true, error: true };
      }
      
      throw error;
    }
  }
  
  /**
   * Send a message via GraphQL
   * @param {Object} message - The message to send
   * @returns {Promise<Object>} Response data
   */
  async sendGraphQLMessage(message) {
    try {
      // Map WebSocket message types to GraphQL operations
      const operationType = this.getOperationTypeForMessage(message);
      const operationName = this.getOperationNameForMessage(message);
      const variables = this.getVariablesForMessage(message);
      
      let result;
      if (operationType === 'query') {
        result = await graphqlService.executeQuery(operationName, variables);
      } else if (operationType === 'mutation') {
        result = await graphqlService.executeMutation(operationName, variables);
      } else {
        throw new Error(`Unsupported GraphQL operation type: ${operationType}`);
      }
      
      return { ...result, sent: true, method: 'graphql' };
    } catch (error) {
      console.error('Error sending GraphQL message:', error);
      throw error;
    }
  }
  
  /**
   * Get GraphQL operation type for a message
   * @param {Object} message - The message
   * @returns {string} Operation type ('query' or 'mutation')
   */
  getOperationTypeForMessage(message) {
    // Default to mutation for most operations
    const queryTypes = ['fetch_data', 'get_user', 'get_mood_history', 'get_analytics'];
    return queryTypes.includes(message.type) ? 'query' : 'mutation';
  }
  
  /**
   * Get GraphQL operation name for a message
   * @param {Object} message - The message
   * @returns {string} GraphQL operation name
   */
  getOperationNameForMessage(message) {
    // Map message types to GraphQL operation names
    const operationMap = {
      'authenticate': 'verifyToken',
      'login': 'login',
      'register': 'register',
      'anonymousLogin': 'anonymousLogin',
      'logout': 'logout',
      'fetch_data': 'getUserProfile',
      'mood_update': 'createMoodEntry',
      'send_hug': 'sendHug',
      'request_hug': 'createHugRequest',
      'get_mood_history': 'getMoodsByUserId',
      'get_analytics': 'getMoodAnalytics',
      'create_group_hug': 'createGroupHug',
      'follow_user': 'followUser',
      'social_share': 'shareToSocial'
    };
    
    return operationMap[message.type] || message.type;
  }
  
  /**
   * Get GraphQL variables for a message
   * @param {Object} message - The message
   * @returns {Object} Variables for GraphQL operation
   */
  getVariablesForMessage(message) {
    // Extract variables from message
    if (message.data) {
      return message.data;
    }
    
    // Remove type field and use rest as variables
    const { type, ...variables } = message;
    return variables;
  }
  
  /**
   * Send a message via WebSocket
   * @param {Object} message - The message to send
   * @returns {Object} Status object
   */
  sendWebSocketMessage(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }
    
    try {
      const messageStr = JSON.stringify(message);
      this.ws.send(messageStr);
      return { sent: true, method: 'websocket' };
    } catch (error) {
      console.error('Error serializing or sending WebSocket message:', error);
      throw error;
    }
  }
  
  /**
   * Send a message via REST API
   * @param {Object} message - The message to send
   * @returns {Promise<Object>} Response data
   */
  async sendRestMessage(message) {
    const endpoint = this.getEndpointForMessageType(message.type);
    const method = this.getMethodForMessageType(message.type);
    
    try {
      const token = getToken();
      
      const response = await fetch(`${this.restApiUrl}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined
        },
        body: method !== 'GET' ? JSON.stringify(message.data || message) : undefined
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return { ...data, sent: true, method: 'rest' };
    } catch (error) {
      console.error('Error sending REST message:', error);
      throw error;
    }
  }
  
  /**
   * Get REST API endpoint for a message type
   * @param {string} messageType - Type of message
   * @returns {string} API endpoint
   */
  getEndpointForMessageType(messageType) {
    // Map WebSocket message types to REST endpoints
    const endpointMap = {
      'authenticate': '/auth/token',
      'mood_update': '/moods',
      'send_hug': '/hugs',
      'request_hug': '/hugs/request',
      'fetch_data': '/data', // Will need query parameters
      'create_group_hug': '/groups',
      'join_group_hug': '/groups/{id}/join',
      'follow_user': '/social/follow',
      'social_share': '/social/share'
    };
    
    return endpointMap[messageType] || '/action';
  }
  
  /**
   * Get HTTP method for a message type
   * @param {string} messageType - Type of message
   * @returns {string} HTTP method
   */
  getMethodForMessageType(messageType) {
    // Map WebSocket message types to HTTP methods
    const methodMap = {
      'authenticate': 'POST',
      'mood_update': 'POST',
      'send_hug': 'POST',
      'request_hug': 'POST',
      'fetch_data': 'GET',
      'create_group_hug': 'POST',
      'join_group_hug': 'POST',
      'follow_user': 'POST',
      'social_share': 'POST'
    };
    
    return methodMap[messageType] || 'POST';
  }
  
  /**
   * Handle connection status change
   * @param {boolean} isOnline - Whether device is online
   */
  handleConnectionChange(isOnline) {
    console.log(`Connection status changed: ${isOnline ? 'online' : 'offline'}`);
    this.isOnline = isOnline;
    
    if (isOnline) {
      // First attempt to reconnect GraphQL
      if (!this.isGraphQLConnected) {
        this.initializeGraphQL();
      }
      
      // Attempt to reconnect WebSocket as fallback
      if (!this.isWebSocketConnected && !this.isGraphQLConnected) {
        this.connectWebSocket();
      }
      
      // Process any queued messages
      this.processOfflineQueue();
    } else {
      // Enable offline mode
      this.enableOfflineMode();
      
      // Clear polling if active
      this.clearPolling();
    }
    
    this.notifyListeners({ type: 'connection', status: isOnline ? 'online' : 'offline' });
  }
  
  /**
   * Set up periodic network quality checks
   */
  setupConnectionQualityCheck() {
    // Check connection quality every minute
    setInterval(() => {
      this.checkConnectionQuality();
    }, 60000);
    
    // Initial check
    this.checkConnectionQuality();
  }
  
  /**
   * Check network connection quality
   */
  async checkConnectionQuality() {
    if (!this.isOnline) {
      this.connectionQuality = 'offline';
      return;
    }
    
    try {
      const startTime = Date.now();
      const response = await fetch('/connection-check', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      if (latency < 100) {
        this.connectionQuality = 'excellent';
      } else if (latency < 300) {
        this.connectionQuality = 'good';
      } else {
        this.connectionQuality = 'poor';
      }
      
      this.notifyListeners({ 
        type: 'connectionQuality', 
        quality: this.connectionQuality,
        latency
      });
    } catch (error) {
      console.error('Error checking connection quality:', error);
      this.connectionQuality = 'unknown';
    }
  }
  
  /**
   * Handle polled data from REST API
   * @param {Object} data - Data received from polling
   */
  handlePolledData(data) {
    if (!data || !data.updates) {
      return;
    }
    
    // Process each update type
    for (const update of data.updates) {
      this.notifyListeners({ 
        type: 'message', 
        data: update,
        source: 'polling'
      });
    }
  }
  
  /**
   * Add a listener for connection events
   * @param {Function} listener - Event listener callback
   * @returns {Function} Function to remove the listener
   */
  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Notify all listeners of an event
   * @param {Object} event - Event data
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }
  
  /**
   * Close all connections and clean up
   */
  cleanup() {
    // Close WebSocket connection if active
    if (this.ws) {
      this.ws.close();
    }
    
    // Close GraphQL connections
    if (this.isGraphQLConnected) {
      try {
        graphqlService.close();
      } catch (error) {
        console.error('Error closing GraphQL connections:', error);
      }
    }
    
    // Clear polling
    this.clearPolling();
    
    // Remove window event listeners
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
    
    // Clear listeners
    this.listeners = [];
  }
}

// Create singleton instance
const connectionManager = new ConnectionManager();

export default connectionManager;