import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import { playHapticFeedback } from '../../utils/haptics';
import Loading from '../common/Loading';
import { hugTypes } from '../../assets/hugTypes';

const HugAnimation = () => {
  const { currentUser } = useAuth();
  const { markHugAsSeen } = useHug();
  const navigate = useNavigate();
  const location = useLocation();
  const { hugId } = useParams();
  const animationContainerRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [hugData, setHugData] = useState(null);
  const [animationState, setAnimationState] = useState('pending'); // pending, playing, complete
  const [animationProgress, setAnimationProgress] = useState(0);
  const [error, setError] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [willAutoNavigate, setWillAutoNavigate] = useState(true);
  
  // Extract any query parameters (for direct loading)
  const searchParams = new URLSearchParams(location.search);
  const senderName = searchParams.get('sender') || 'Someone';
  const hugType = searchParams.get('type') || 'comfort';
  const message = searchParams.get('message') || '';
  const autoPlay = searchParams.get('autoplay') !== 'false';
  
  // Load hug data
  useEffect(() => {
    const loadHugData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would fetch the hug data from an API
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let data;
        
        if (hugId) {
          // If hugId is provided, fetch specific hug
          data = {
            id: hugId,
            sender: {
              id: 'user1',
              name: 'Alex Johnson',
              username: 'alexj',
              avatar: 'https://i.pravatar.cc/150?img=1',
            },
            recipient: {
              id: currentUser?.id || 'currentUser123',
              name: currentUser?.name || 'You',
            },
            hugType: 'comfort',
            message: 'Sending you positive vibes. Hope this brightens your day!',
            createdAt: new Date().toISOString(),
            seen: false
          };
        } else {
          // Use the query parameters for direct loading
          data = {
            id: 'direct-hug',
            sender: {
              id: 'direct-sender',
              name: senderName,
              username: 'direct',
              avatar: 'https://i.pravatar.cc/150?img=3',
            },
            recipient: {
              id: currentUser?.id || 'currentUser123',
              name: currentUser?.name || 'You',
            },
            hugType: hugType,
            message: message,
            createdAt: new Date().toISOString(),
            seen: false
          };
        }
        
        setHugData(data);
      } catch (error) {
        console.error('Failed to load hug data:', error);
        setError('Failed to load hug data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHugData();
  }, [hugId, currentUser, senderName, hugType, message]);
  
  // Start animation when data is loaded
  useEffect(() => {
    if (hugData && autoPlay && animationState === 'pending') {
      startAnimation();
    }
  }, [hugData, autoPlay, animationState]);
  
  // Control animation progress
  useEffect(() => {
    let animationTimer;
    
    if (animationState === 'playing') {
      animationTimer = setInterval(() => {
        setAnimationProgress(prev => {
          const newProgress = prev + 1;
          
          // Animation complete
          if (newProgress >= 100) {
            clearInterval(animationTimer);
            setAnimationState('complete');
            playHapticFeedback('success');
            
            // Mark hug as seen
            if (hugId) {
              markHugAsSeen(hugId);
            }
            
            // Auto navigate after completing animation
            if (willAutoNavigate) {
              setTimeout(() => {
                navigate('/dashboard');
              }, 3000);
            }
            
            return 100;
          }
          
          return newProgress;
        });
      }, 50); // Animation speed (50ms per tick)
      
      // Play haptic feedback at key moments
      if (animationProgress === 0) {
        playHapticFeedback('impact');
      } else if (animationProgress === 50) {
        playHapticFeedback('selection');
      }
    }
    
    return () => {
      if (animationTimer) {
        clearInterval(animationTimer);
      }
    };
  }, [animationState, animationProgress, hugId, markHugAsSeen, navigate, willAutoNavigate]);
  
  const startAnimation = () => {
    setAnimationState('playing');
    setShowControls(false);
    
    // Hide controls during animation, show again when complete
    setTimeout(() => {
      setShowControls(true);
    }, 5000);
  };
  
  const pauseAnimation = () => {
    setAnimationState('pending');
  };
  
  const replayAnimation = () => {
    setAnimationProgress(0);
    setAnimationState('playing');
    setShowControls(false);
    
    // Hide controls during animation, show again when complete
    setTimeout(() => {
      setShowControls(true);
    }, 5000);
  };
  
  const skipAnimation = () => {
    setAnimationProgress(100);
    setAnimationState('complete');
    
    // Mark hug as seen
    if (hugId) {
      markHugAsSeen(hugId);
    }
  };
  
  const handleAutoNavigateToggle = () => {
    setWillAutoNavigate(!willAutoNavigate);
  };
  
  const getHugTypeDetails = (type) => {
    return hugTypes[type] || {
      name: 'Comfort Hug',
      description: 'A gentle hug to provide comfort and support.',
      color: '#3498db',
      icon: 'heart'
    };
  };
  
  const handleSendHugBack = () => {
    navigate(`/hugs/send?recipientId=${hugData.sender.id}`);
  };
  
  if (isLoading) {
    return <Loading text="Loading hug..." />;
  }
  
  if (error) {
    return (
      <div className="hug-animation-error">
        <div className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!hugData) {
    return (
      <div className="hug-not-found">
        <div className="not-found-icon">
          <i className="fas fa-search"></i>
        </div>
        <h2>Hug not found</h2>
        <p>The hug you're looking for doesn't exist or has been removed.</p>
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  const hugTypeDetails = getHugTypeDetails(hugData.hugType);
  
  return (
    <div className="hug-animation-container">
      <div className="animation-header">
        <h1>Hug Received</h1>
        <p className="from-text">
          From <span className="sender-name">{hugData.sender.name}</span>
        </p>
      </div>
      
      <div 
        ref={animationContainerRef}
        className={`animation-stage ${animationState} ${hugData.hugType}`}
        style={{ backgroundColor: `${hugTypeDetails.color}22` /* Color with opacity */ }}
      >
        <div className="hug-type-icon" style={{ color: hugTypeDetails.color }}>
          <i className={`fas fa-${hugTypeDetails.icon}`}></i>
        </div>
        
        <div className="animation-elements">
          <div className="sender-avatar">
            <img 
              src={hugData.sender.avatar || 'https://i.pravatar.cc/150?img=3'} 
              alt={hugData.sender.name} 
            />
          </div>
          
          <div className="hug-animation-element">
            {animationState === 'pending' && (
              <div className="pending-animation">
                <i className="fas fa-heart"></i>
              </div>
            )}
            
            {animationState === 'playing' && (
              <div className="playing-animation">
                <div className="hug-particles">
                  {Array(12).fill(null).map((_, i) => (
                    <div 
                      key={i} 
                      className={`particle particle-${i + 1}`}
                      style={{ 
                        backgroundColor: hugTypeDetails.color,
                        animationDelay: `${i * 0.1}s` 
                      }}
                    >
                    </div>
                  ))}
                </div>
                <div className="hug-circle" style={{ borderColor: hugTypeDetails.color }}></div>
                <div className="hug-arms">
                  <div className="arm arm-left" style={{ backgroundColor: hugTypeDetails.color }}></div>
                  <div className="arm arm-right" style={{ backgroundColor: hugTypeDetails.color }}></div>
                </div>
              </div>
            )}
            
            {animationState === 'complete' && (
              <div className="complete-animation">
                <div className="hug-heart" style={{ color: hugTypeDetails.color }}>
                  <i className="fas fa-heart"></i>
                </div>
                <div className="completion-text">
                  <span className="hug-type-name">{hugTypeDetails.name}</span>
                  <span className="hug-received">received</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="recipient-avatar">
            <img 
              src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=7'} 
              alt={hugData.recipient.name} 
            />
          </div>
        </div>
        
        <div className="animation-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${animationProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {hugData.message && (
        <div className="hug-message">
          <p>"{hugData.message}"</p>
        </div>
      )}
      
      {showControls && (
        <div className="animation-controls">
          {animationState === 'pending' && (
            <button 
              className="start-btn"
              onClick={startAnimation}
            >
              <i className="fas fa-play"></i> Start
            </button>
          )}
          
          {animationState === 'playing' && (
            <>
              <button 
                className="pause-btn"
                onClick={pauseAnimation}
              >
                <i className="fas fa-pause"></i> Pause
              </button>
              
              <button 
                className="skip-btn"
                onClick={skipAnimation}
              >
                <i className="fas fa-forward"></i> Skip
              </button>
            </>
          )}
          
          {animationState === 'complete' && (
            <>
              <button 
                className="replay-btn"
                onClick={replayAnimation}
              >
                <i className="fas fa-redo"></i> Replay
              </button>
              
              <button 
                className="send-back-btn"
                onClick={handleSendHugBack}
              >
                <i className="fas fa-reply"></i> Send Hug Back
              </button>
            </>
          )}
        </div>
      )}
      
      {animationState === 'complete' && (
        <div className="hug-actions">
          <div className="auto-navigate-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={willAutoNavigate}
                onChange={handleAutoNavigateToggle}
              />
              <span className="toggle-switch"></span>
              <span>Auto navigate to dashboard</span>
            </label>
          </div>
          
          <button 
            className="dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            <i className="fas fa-home"></i> Go to Dashboard
          </button>
        </div>
      )}
      
      <div className="virality-feature">
        <div className="share-hug-card">
          <div className="share-header">
            <div className="share-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Share This Hug</h3>
          </div>
          <div className="share-content">
            <p>Share this hug moment with others!</p>
            <div className="share-platforms">
              <button className="platform-btn facebook">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="platform-btn twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="platform-btn instagram">
                <i className="fab fa-instagram"></i>
              </button>
              <button className="platform-btn whatsapp">
                <i className="fab fa-whatsapp"></i>
              </button>
            </div>
            <div className="share-link">
              <input
                type="text"
                readOnly
                value={`https://hugmood.com/share/${hugData.id || 'direct-hug'}`}
              />
              <button className="copy-btn">
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HugAnimation;