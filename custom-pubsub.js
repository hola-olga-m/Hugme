/**
 * Custom PubSub Implementation for GraphQL Subscriptions
 * This provides a lightweight and compatible implementation for subscription events
 * that works with the graphql-subscriptions interface and graphql-ws WebSocket protocol
 */

import { EventEmitter } from 'events';

export class CustomPubSub {
  constructor() {
    this.emitter = new EventEmitter();
    this.subscriptions = new Map();
    this.subIdCounter = 0;
    
    // Increase max listeners to handle many subscriptions
    this.emitter.setMaxListeners(100);
  }

  /**
   * Publish an event to a specific channel
   * @param {string} triggerName - The channel/topic name
   * @param {any} payload - The data to publish
   * @returns {boolean} Success indicator
   */
  publish(triggerName, payload) {
    console.log(`[CustomPubSub] Publishing to ${triggerName}:`, 
      typeof payload === 'object' ? JSON.stringify(payload).substring(0, 100) + '...' : payload);
    this.emitter.emit(triggerName, payload);
    return true;
  }

  /**
   * Subscribe to events on a specific channel
   * @param {string} triggerName - The channel/topic name
   * @param {Function} onMessage - Callback function for messages
   * @returns {Promise<number>} Subscription ID
   */
  subscribe(triggerName, onMessage) {
    const subId = this.subIdCounter++;
    const listener = (payload) => {
      console.log(`[CustomPubSub] Event received on ${triggerName} (subscription ${subId})`);
      onMessage(payload);
    };
    
    console.log(`[CustomPubSub] Subscribing to ${triggerName} (subscription ${subId})`);
    this.emitter.on(triggerName, listener);
    this.subscriptions.set(subId, { triggerName, listener });
    
    return Promise.resolve(subId);
  }

  /**
   * Unsubscribe from a subscription
   * @param {number} subId - The subscription ID to unsubscribe
   */
  unsubscribe(subId) {
    const subInfo = this.subscriptions.get(subId);
    if (subInfo) {
      console.log(`[CustomPubSub] Unsubscribing from ${subInfo.triggerName} (subscription ${subId})`);
      this.emitter.removeListener(subInfo.triggerName, subInfo.listener);
      this.subscriptions.delete(subId);
      return true;
    }
    return false;
  }

  /**
   * Create an AsyncIterator for GraphQL subscriptions
   * This is the primary interface used by the GraphQL subscription resolvers
   * @param {string|string[]} triggers - The trigger name(s) to listen for
   * @returns {AsyncIterator} An async iterator compatible with GraphQL subscriptions
   */
  asyncIterator(triggers) {
    const triggerArray = Array.isArray(triggers) ? triggers : [triggers];
    console.log(`[CustomPubSub] Creating async iterator for:`, triggerArray);
    
    // This is our custom implementation of an AsyncIterator
    return {
      [Symbol.asyncIterator]() {
        const pullQueue = [];
        const pushQueue = [];
        const subIds = [];
        let isClosing = false;

        const pushValue = (value) => {
          console.log(`[CustomPubSub] pushValue called with:`, 
            typeof value === 'object' ? JSON.stringify(value).substring(0, 100) + '...' : value);
          if (pullQueue.length > 0) {
            const resolver = pullQueue.shift();
            resolver({ value, done: false });
          } else {
            pushQueue.push(value);
          }
        };

        const pullValue = () => {
          console.log(`[CustomPubSub] pullValue called, queue length: ${pushQueue.length}`);
          return new Promise(resolve => {
            if (pushQueue.length > 0) {
              const value = pushQueue.shift();
              resolve({ value, done: false });
            } else if (isClosing) {
              resolve({ value: undefined, done: true });
            } else {
              pullQueue.push(resolve);
            }
          });
        };

        // Register subscriptions for all triggers
        triggerArray.forEach(triggerName => {
          console.log(`[CustomPubSub] Registering subscription for ${triggerName}`);
          const onMessage = (payload) => {
            console.log(`[CustomPubSub] Message received for ${triggerName}:`, 
              typeof payload === 'object' ? JSON.stringify(payload).substring(0, 100) + '...' : payload);
            pushValue(payload);
          };
          
          this.subscribe(triggerName, onMessage)
            .then(subId => {
              console.log(`[CustomPubSub] Subscription ${subId} registered for ${triggerName}`);
              subIds.push(subId);
            });
        });

        return {
          next() {
            return pullValue();
          },
          return() {
            console.log(`[CustomPubSub] AsyncIterator return called, cleaning up subscriptions`);
            isClosing = true;
            subIds.forEach(subId => {
              this.unsubscribe && this.unsubscribe(subId);
            });
            return Promise.resolve({ value: undefined, done: true });
          },
          throw(error) {
            console.log(`[CustomPubSub] AsyncIterator throw called with error:`, error);
            isClosing = true;
            return Promise.reject(error);
          }
        };
      }
    };
  }
}