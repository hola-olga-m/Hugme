/**
 * Social Sharing Service
 * Handles sharing content to various social media platforms
 */

import { sendWebSocketMessage } from './websocketService';

/**
 * Share content to a social platform
 * @param {WebSocket} socket - WebSocket connection
 * @param {string} platform - Social platform (facebook, twitter, instagram, etc.)
 * @param {Object} content - Content to share
 * @param {string} contentType - Type of content (hug, mood, achievement, etc.)
 * @returns {Promise<Object>} Result of the share operation
 */
export const shareToSocialPlatform = async (socket, platform, content, contentType) => {
  try {
    // Generate sharing URL and preview based on content type
    const shareData = generateShareData(platform, content, contentType);
    
    // Track share event via WebSocket
    sendWebSocketMessage(socket, {
      type: 'socialShare',
      data: {
        platform,
        contentType,
        contentId: content.id,
        timestamp: new Date().toISOString()
      }
    });
    
    // Open sharing dialog in browser/app
    if (shareData.method === 'url') {
      window.open(shareData.url, '_blank');
    } else if (shareData.method === 'navigator' && navigator.share) {
      await navigator.share(shareData.navigatorData);
    } else if (shareData.method === 'sdk') {
      await openPlatformSpecificDialog(platform, shareData.sdkData);
    }
    
    return { success: true, platform, contentType };
  } catch (error) {
    console.error(`Social sharing error (${platform}):`, error);
    return { success: false, error: error.message, platform, contentType };
  }
};

/**
 * Generate sharing data for a specific platform
 * @param {string} platform - Social platform
 * @param {Object} content - Content to share
 * @param {string} contentType - Type of content
 * @returns {Object} Sharing data including URLs and preview text
 */
const generateShareData = (platform, content, contentType) => {
  // Base URL for deep linking back to the app
  const baseAppUrl = window.location.origin;
  
  // Generate share text based on content type
  let shareText = '';
  let shareUrl = '';
  let shareImage = '';
  let shareTitle = 'HugMood - Connect through digital hugs';
  
  switch (contentType) {
    case 'hug':
      shareText = `I just sent a "${content.hugType}" hug on HugMood! Share your feelings through virtual hugs.`;
      shareUrl = `${baseAppUrl}/hug/${content.id}`;
      shareImage = content.previewImage || `${baseAppUrl}/img/hug-notification.svg`;
      break;
      
    case 'mood':
      shareText = `My mood today is ${content.mood}. Track your emotional journey with HugMood!`;
      shareUrl = `${baseAppUrl}/mood/share/${content.id}`;
      shareImage = content.moodImage || `${baseAppUrl}/img/mood-notification.svg`;
      break;
      
    case 'achievement':
      shareText = `I just earned the "${content.name}" badge on HugMood! Join me on this emotional wellness journey.`;
      shareUrl = `${baseAppUrl}/achievements/${content.id}`;
      shareImage = content.image || `${baseAppUrl}/img/achievements/${content.id}.svg`;
      break;
      
    case 'groupHug':
      shareText = `Join our group hug on HugMood! ${content.creatorName} has created a special moment to share.`;
      shareUrl = `${baseAppUrl}/group-hug/${content.id}`;
      shareImage = `${baseAppUrl}/img/group-notification.svg`;
      break;
      
    default:
      shareText = 'Check out HugMood - the app that lets you share your feelings through virtual hugs!';
      shareUrl = baseAppUrl;
      shareImage = `${baseAppUrl}/img/hug-notification.svg`;
  }
  
  // Add hashtags
  const hashtags = ['HugMood', 'VirtualHug', 'EmotionalWellness'];
  if (content.mood) {
    hashtags.push(`Mood${content.mood.replace(/\\s+/g, '')}`);
  }
  
  // Platform-specific formatting
  switch (platform) {
    case 'facebook':
      return {
        method: 'url',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
        navigatorData: {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        },
        sdkData: {
          quote: shareText,
          href: shareUrl,
          hashtag: `#${hashtags[0]}`,
        }
      };
      
    case 'twitter':
      return {
        method: 'url',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags.join(',')}`,
        navigatorData: {
          title: shareTitle,
          text: `${shareText} ${hashtags.map(h => `#${h}`).join(' ')}`,
          url: shareUrl,
        },
        sdkData: {
          text: shareText,
          url: shareUrl,
          hashtags: hashtags,
          via: 'HugMoodApp'
        }
      };
      
    case 'telegram':
      return {
        method: 'url',
        url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        navigatorData: {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        },
        sdkData: {
          text: shareText,
          url: shareUrl
        }
      };
      
    case 'whatsapp':
      return {
        method: 'url',
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        navigatorData: {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        },
        sdkData: {
          text: `${shareText} ${shareUrl}`
        }
      };
      
    case 'email':
      return {
        method: 'url',
        url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\\n\\n' + shareUrl)}`,
        navigatorData: {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        },
        sdkData: {
          subject: shareTitle,
          body: `${shareText}\\n\\n${shareUrl}`
        }
      };
      
    default:
      // Use Web Share API when available
      return {
        method: 'navigator',
        url: null,
        navigatorData: {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        },
        sdkData: null
      };
  }
};

/**
 * Open platform-specific sharing dialog using SDK
 * @param {string} platform - Social platform
 * @param {Object} data - SDK-specific data
 * @returns {Promise<any>} Result from the platform SDK
 */
const openPlatformSpecificDialog = async (platform, data) => {
  switch (platform) {
    case 'facebook':
      // This requires the Facebook SDK to be loaded
      if (window.FB) {
        return new Promise((resolve, reject) => {
          window.FB.ui({
            method: 'share',
            ...data
          }, response => {
            if (response && !response.error_message) {
              resolve(response);
            } else {
              reject(new Error(response?.error_message || 'Facebook share failed'));
            }
          });
        });
      }
      throw new Error('Facebook SDK not loaded');
      
    // Add other platform SDKs as needed
    
    default:
      throw new Error(`SDK sharing not implemented for ${platform}`);
  }
};

/**
 * Generate a shareable link for content
 * @param {string} contentType - Type of content
 * @param {string} contentId - ID of the content
 * @returns {string} Shareable link
 */
export const generateShareableLink = (contentType, contentId) => {
  const baseUrl = window.location.origin;
  let path = '';
  
  switch (contentType) {
    case 'hug':
      path = `/hug/${contentId}`;
      break;
    case 'mood':
      path = `/mood/share/${contentId}`;
      break;
    case 'achievement':
      path = `/achievements/${contentId}`;
      break;
    case 'groupHug':
      path = `/group-hug/${contentId}`;
      break;
    default:
      path = `/share/${contentType}/${contentId}`;
  }
  
  return `${baseUrl}${path}`;
};

/**
 * Load social media platform SDKs
 * @returns {Promise<void>}
 */
export const loadSocialMediaSDKs = async () => {
  // Example: Load Facebook SDK
  return new Promise((resolve) => {
    if (document.getElementById('facebook-jssdk')) {
      resolve();
      return;
    }
    
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID || '123456789',
        xfbml: true,
        version: 'v15.0'
      });
      resolve();
    };
    
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });
};

/**
 * Track sharing activity for rewards
 * @param {WebSocket} socket - WebSocket connection
 * @param {string} userId - User ID
 * @param {string} platform - Social platform
 * @returns {Promise<Object>} Share tracking result
 */
export const trackSharingActivity = async (socket, userId, platform) => {
  sendWebSocketMessage(socket, {
    type: 'trackSocialShare',
    data: {
      userId,
      platform,
      timestamp: new Date().toISOString()
    }
  });
  
  return { success: true };
};