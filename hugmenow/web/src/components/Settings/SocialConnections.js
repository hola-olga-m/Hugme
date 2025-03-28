import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';
import { showNotification } from '../../utils/notifications';

const SocialConnections = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState({});
  const [friendsFromPlatforms, setFriendsFromPlatforms] = useState({});
  const [shareInProgress, setShareInProgress] = useState(false);
  const [shareContent, setShareContent] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [consentGiven, setConsentGiven] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { getConnectedPlatforms, connectSocialPlatform, disconnectSocialPlatform, 
          getFriendsFromPlatform, shareToSocial, generateInviteLink } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  
  // Social platforms
  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'fa-facebook-f',
      color: '#3b5998',
      connectConfig: {
        permissions: ['public_profile', 'email', 'user_friends'],
        promptText: 'We need permission to access your public profile and friend list to help you connect with friends already using HugMood.'
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: 'fa-telegram-plane',
      color: '#0088cc',
      connectConfig: {
        permissions: ['contacts'],
        promptText: 'We need permission to find your Telegram contacts who are already using HugMood.'
      }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'fa-twitter',
      color: '#1da1f2',
      connectConfig: {
        permissions: ['tweet', 'following'],
        promptText: 'We need permission to see your followers and to post hug shares on your behalf when you choose to share.'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'fa-instagram',
      color: '#c13584',
      connectConfig: {
        permissions: ['basic', 'user_profile', 'user_media'],
        promptText: 'We need permission to access your profile and to post hug shares to your stories when you choose to share.'
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'fa-whatsapp',
      color: '#25d366',
      connectConfig: {
        permissions: ['contacts'],
        promptText: 'We need permission to find your WhatsApp contacts who are already using HugMood.'
      }
    }
  ];
  
  // Initialize data
  useEffect(() => {
    const loadConnections = async () => {
      setIsLoading(true);
      
      try {
        // Get connected platforms
        const platforms = await getConnectedPlatforms(user.id);
        setConnectedPlatforms(platforms);
        
        // Generate invite link
        const link = await generateInviteLink(user.id);
        setInviteLink(link);
        
        // Check for sharing intent from navigation
        if (location.state?.shareContent) {
          setShareContent(location.state.shareContent);
          setShowShareModal(true);
        }
        
      } catch (error) {
        console.error('Error loading social connections:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConnections();
  }, [user.id, getConnectedPlatforms, generateInviteLink, location.state]);
  
  // Toggle platform connection
  const handleConnectPlatform = async (platform) => {
    if (connectedPlatforms[platform.id]) {
      // Disconnect platform
      try {
        await disconnectSocialPlatform(user.id, platform.id);
        
        // Update local state
        setConnectedPlatforms(prev => ({
          ...prev,
          [platform.id]: false
        }));
        
        playHapticFeedback('success');
        showNotification('Success', `Disconnected from ${platform.name}`);
        
      } catch (error) {
        console.error(`Error disconnecting ${platform.name}:`, error);
        showNotification('Error', `Failed to disconnect from ${platform.name}`);
      }
    } else {
      // Show connect modal
      setSelectedPlatform(platform);
      setShowConnectModal(true);
    }
  };
  
  // Connect platform with consent
  const connectWithConsent = async () => {
    if (!selectedPlatform || !consentGiven[selectedPlatform.id]) {
      return;
    }
    
    try {
      const result = await connectSocialPlatform(user.id, selectedPlatform.id);
      
      if (result.success) {
        // Update local state
        setConnectedPlatforms(prev => ({
          ...prev,
          [selectedPlatform.id]: true
        }));
        
        // Load friends from this platform
        loadFriendsFromPlatform(selectedPlatform.id);
        
        playHapticFeedback('success');
        showNotification('Success', `Connected to ${selectedPlatform.name}`);
      } else {
        showNotification('Error', result.error || `Failed to connect to ${selectedPlatform.name}`);
      }
      
    } catch (error) {
      console.error(`Error connecting ${selectedPlatform.name}:`, error);
      showNotification('Error', `Failed to connect to ${selectedPlatform.name}`);
    } finally {
      setShowConnectModal(false);
      setSelectedPlatform(null);
      setConsentGiven({});
    }
  };
  
  // Load friends from platform
  const loadFriendsFromPlatform = async (platformId) => {
    if (!connectedPlatforms[platformId]) {
      return;
    }
    
    try {
      const friends = await getFriendsFromPlatform(user.id, platformId);
      
      setFriendsFromPlatforms(prev => ({
        ...prev,
        [platformId]: friends
      }));
      
    } catch (error) {
      console.error(`Error loading friends from ${platformId}:`, error);
    }
  };
  
  // Toggle consent checkbox
  const toggleConsent = (platformId) => {
    setConsentGiven(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
    
    playHapticFeedback('selection');
  };
  
  // Cancel connection
  const cancelConnect = () => {
    setShowConnectModal(false);
    setSelectedPlatform(null);
    setConsentGiven({});
    playHapticFeedback('selection');
  };
  
  // Handle share to platform
  const handleShareToPlatform = async (platformId) => {
    if (!shareContent || !connectedPlatforms[platformId]) {
      return;
    }
    
    setShareInProgress(true);
    
    try {
      const result = await shareToSocial(
        user.id,
        platformId,
        shareContent.type,
        shareContent.id
      );
      
      if (result.success) {
        playHapticFeedback('success');
        showNotification('Success', `Shared to ${socialPlatforms.find(p => p.id === platformId)?.name}`);
      } else {
        showNotification('Error', result.error || 'Failed to share content');
      }
      
    } catch (error) {
      console.error(`Error sharing to ${platformId}:`, error);
      showNotification('Error', 'Failed to share content');
    } finally {
      setShareInProgress(false);
      setShowShareModal(false);
      setShareContent(null);
    }
  };
  
  // Copy invite link
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    playHapticFeedback('success');
    showNotification('Success', 'Invite link copied to clipboard');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`social-connections-container theme-${theme}`}>
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your social connections...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`social-connections-container theme-${theme}`}>
      <header className="page-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Social Connections</h1>
      </header>
      
      {/* Invite Friends */}
      <div className="invite-section">
        <h2>Invite Friends</h2>
        <p>Share HugMood with friends and family to grow your community</p>
        
        <div className="invite-link">
          <input
            type="text"
            value={inviteLink}
            readOnly
          />
          <button
            className="copy-button"
            onClick={copyInviteLink}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
        
        <div className="invite-options">
          <button
            className="share-button"
            onClick={() => {
              setShareContent({ type: 'invite', id: user.id });
              setShowShareModal(true);
            }}
          >
            <i className="fas fa-share-alt"></i>
            <span>Share Invite</span>
          </button>
        </div>
      </div>
      
      {/* Connected Platforms */}
      <div className="platforms-section">
        <h2>Connected Platforms</h2>
        
        <div className="platforms-grid">
          {socialPlatforms.map(platform => (
            <div
              key={platform.id}
              className={`platform-card ${connectedPlatforms[platform.id] ? 'connected' : ''}`}
            >
              <div 
                className="platform-icon"
                style={{ backgroundColor: platform.color }}
              >
                <i className={`fab ${platform.icon}`}></i>
              </div>
              
              <div className="platform-info">
                <h3>{platform.name}</h3>
                <p>
                  {connectedPlatforms[platform.id]
                    ? 'Connected'
                    : 'Not connected'
                  }
                </p>
              </div>
              
              <button
                className="toggle-connection-button"
                onClick={() => handleConnectPlatform(platform)}
              >
                {connectedPlatforms[platform.id] ? (
                  <i className="fas fa-unlink"></i>
                ) : (
                  <i className="fas fa-link"></i>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Friends from Platforms */}
      {Object.keys(friendsFromPlatforms).length > 0 && (
        <div className="platform-friends-section">
          <h2>Friends on HugMood</h2>
          
          {Object.entries(friendsFromPlatforms).map(([platformId, friends]) => (
            friends && friends.length > 0 && (
              <div key={platformId} className="platform-friends">
                <div className="platform-header">
                  <div 
                    className="platform-icon-small"
                    style={{ 
                      backgroundColor: socialPlatforms.find(p => p.id === platformId)?.color 
                    }}
                  >
                    <i className={`fab ${socialPlatforms.find(p => p.id === platformId)?.icon}`}></i>
                  </div>
                  <h3>
                    {socialPlatforms.find(p => p.id === platformId)?.name} Friends
                  </h3>
                </div>
                
                <div className="friends-list">
                  {friends.map(friend => (
                    <div key={friend.id} className="friend-item">
                      <div className="friend-avatar">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {friend.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div className="friend-name">{friend.name}</div>
                      
                      {friend.isFollowing ? (
                        <button 
                          className="friend-action following"
                          onClick={() => {
                            navigate('/mood/following');
                          }}
                        >
                          <i className="fas fa-user-check"></i>
                          <span>Following</span>
                        </button>
                      ) : (
                        <button 
                          className="friend-action follow"
                          onClick={() => {
                            // This would trigger a follow action in a real app
                            playHapticFeedback('selection');
                            
                            // For demo, just navigate to following page
                            navigate('/mood/following');
                          }}
                        >
                          <i className="fas fa-user-plus"></i>
                          <span>Follow</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
      
      {/* Connect Platform Modal */}
      {showConnectModal && selectedPlatform && (
        <div className="connect-modal">
          <div className="modal-overlay" onClick={cancelConnect}></div>
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={cancelConnect}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div 
              className="platform-icon-large"
              style={{ backgroundColor: selectedPlatform.color }}
            >
              <i className={`fab ${selectedPlatform.icon}`}></i>
            </div>
            
            <h2>Connect to {selectedPlatform.name}</h2>
            
            <div className="permissions-list">
              <h3>Required Permissions</h3>
              <ul>
                {selectedPlatform.connectConfig.permissions.map(permission => (
                  <li key={permission}>
                    <i className="fas fa-check"></i>
                    <span>{permission.replace('_', ' ')}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="permission-explanation">
              <i className="fas fa-info-circle"></i>
              <p>{selectedPlatform.connectConfig.promptText}</p>
            </div>
            
            <div className="consent-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={consentGiven[selectedPlatform.id] || false}
                  onChange={() => toggleConsent(selectedPlatform.id)}
                />
                <span>
                  I allow HugMood to access my {selectedPlatform.name} data as described above
                </span>
              </label>
            </div>
            
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={cancelConnect}
              >
                Cancel
              </button>
              
              <button
                className={`connect-button ${consentGiven[selectedPlatform.id] ? '' : 'disabled'}`}
                onClick={connectWithConsent}
                disabled={!consentGiven[selectedPlatform.id]}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && shareContent && (
        <div className="share-modal">
          <div className="modal-overlay" onClick={() => setShowShareModal(false)}></div>
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowShareModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <h2>Share to Social Media</h2>
            
            <p className="share-description">
              {shareContent.type === 'invite'
                ? 'Share an invite to HugMood with your social network'
                : shareContent.type === 'badge'
                ? 'Share this achievement with your social network'
                : shareContent.type === 'hug'
                ? 'Share this hug with your social network'
                : 'Share with your social network'
              }
            </p>
            
            <div className="share-platforms">
              {socialPlatforms.map(platform => (
                <button
                  key={platform.id}
                  className={`share-platform-button ${!connectedPlatforms[platform.id] ? 'disabled' : ''}`}
                  onClick={() => handleShareToPlatform(platform.id)}
                  disabled={!connectedPlatforms[platform.id] || shareInProgress}
                  style={{ backgroundColor: platform.color }}
                >
                  <i className={`fab ${platform.icon}`}></i>
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
            
            {shareInProgress && (
              <div className="share-progress">
                <div className="loading-spinner"></div>
                <p>Sharing to platform...</p>
              </div>
            )}
            
            <div className="share-note">
              <i className="fas fa-info-circle"></i>
              <p>
                You need to connect to a platform before you can share content. 
                Connect using the options above.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Privacy Notice */}
      <div className="privacy-notice">
        <i className="fas fa-shield-alt"></i>
        <p>
          HugMood values your privacy. We only access the information you explicitly allow,
          and we never post without your permission. See our 
          <button className="link-button" onClick={() => navigate('/privacy')}>Privacy Policy</button> 
          for details.
        </p>
      </div>
    </div>
  );
};

export default SocialConnections;