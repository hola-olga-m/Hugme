import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';
import { showNotification } from '../../utils/notifications';

const ARHugView = () => {
  const [hug, setHug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [deviceSupportsAR, setDeviceSupportsAR] = useState(false);
  const [arActive, setArActive] = useState(false);
  const [arError, setArError] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.7);
  const [arEffects, setArEffects] = useState([]);
  const [arMode, setArMode] = useState('position'); // position, follow, anchor
  const [showControls, setShowControls] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [orientation, setOrientation] = useState('portrait');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  const { hugId } = useParams();
  const { user } = useContext(UserContext);
  const { getHugById } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Check device capabilities and load hug data on mount
  useEffect(() => {
    const checkDeviceCapabilities = async () => {
      // Check if device supports AR (just a simplified check for camera and device orientation)
      const supportsAR = 'mediaDevices' in navigator && 
                         'getUserMedia' in navigator.mediaDevices &&
                         'DeviceOrientationEvent' in window;
      
      setDeviceSupportsAR(supportsAR);
      
      if (!supportsAR) {
        setArError('Your device does not support AR experiences');
        setIsLoading(false);
        return;
      }
      
      try {
        // Load hug data
        const hugData = await getHugById(hugId);
        setHug(hugData);
        
        // Listen for device orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        handleOrientationChange();
        
      } catch (error) {
        console.error('Error loading hug data:', error);
        setArError('Failed to load hug data');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDeviceCapabilities();
    
    return () => {
      // Clean up
      stopCamera();
      window.removeEventListener('orientationchange', handleOrientationChange);
      cancelAnimationFrame(animationRef.current);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [hugId, getHugById]);
  
  // Handle orientation changes
  const handleOrientationChange = () => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    setOrientation(isPortrait ? 'portrait' : 'landscape');
  };
  
  // Request camera permission and start AR
  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Initialize canvas with video dimensions
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
      }
      
      setCameraPermission(true);
      setArActive(true);
      
      // Auto-hide controls after a few seconds
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      
      // Set up AR effects based on hug type
      setupArEffects();
      
      // Start animation loop
      startAnimationLoop();
      
      // Haptic feedback when AR starts
      playHapticFeedback('success');
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setArError('Unable to access camera. Please check permissions.');
      setCameraPermission(false);
      setArActive(false);
    }
  };
  
  // Stop camera and AR
  const stopAR = () => {
    stopCamera();
    setArActive(false);
    cancelAnimationFrame(animationRef.current);
    playHapticFeedback('selection');
  };
  
  // Clean up camera resources
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // Set up AR effects based on hug type
  const setupArEffects = () => {
    if (!hug || !hug.hugType) return;
    
    const effectsMap = {
      bear: ['hearts', 'sparkles', 'arms'],
      side: ['gentle-glow', 'stars', 'arms'],
      healing: ['healing-glow', 'sparkles', 'pulse'],
      group: ['confetti', 'stars', 'group-silhouette'],
      comforting: ['soft-glow', 'tears', 'arms'],
      excited: ['confetti', 'sparkles', 'jumping'],
      calming: ['gentle-waves', 'breathing', 'arms'],
      friendly: ['stars', 'gentle-glow', 'hands'],
      celebratory: ['confetti', 'fireworks', 'party-hat']
    };
    
    const effects = effectsMap[hug.hugType] || ['hearts', 'sparkles'];
    setArEffects(effects);
  };
  
  // Animation loop for AR effects
  const startAnimationLoop = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    
    const renderFrame = () => {
      // Draw video frame to canvas
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      
      // Apply AR effects
      if (arActive && arEffects.length > 0) {
        renderArEffects(ctx);
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(renderFrame);
    };
    
    renderFrame();
  };
  
  // Render AR effects on canvas
  const renderArEffects = (ctx) => {
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Render different effects based on arEffects array
    arEffects.forEach(effect => {
      switch (effect) {
        case 'hearts':
          renderHearts(ctx, width, height);
          break;
        case 'sparkles':
          renderSparkles(ctx, width, height);
          break;
        case 'arms':
          renderHugArms(ctx, width, height);
          break;
        case 'confetti':
          renderConfetti(ctx, width, height);
          break;
        case 'gentle-glow':
          renderGlow(ctx, width, height, 'gentle');
          break;
        case 'healing-glow':
          renderGlow(ctx, width, height, 'healing');
          break;
        case 'stars':
          renderStars(ctx, width, height);
          break;
        case 'fireworks':
          renderFireworks(ctx, width, height);
          break;
        default:
          // No effect
          break;
      }
    });
  };
  
  // Effect renderers
  const renderHearts = (ctx, width, height) => {
    // Simple heart drawing example
    const now = Date.now();
    const heartCount = 5;
    const size = Math.min(width, height) * 0.1;
    
    ctx.fillStyle = 'rgba(255, 0, 100, 0.7)';
    
    for (let i = 0; i < heartCount; i++) {
      const x = width * 0.5 + Math.sin((now / 1000) + i) * width * 0.2;
      const y = height * 0.3 + Math.cos((now / 1000) + i) * height * 0.1 - Math.sin(now / 2000) * height * 0.1;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 30, size / 30);
      
      // Draw heart shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -10, -15, 0, 0, 10);
      ctx.bezierCurveTo(15, 0, 10, -10, 0, 0);
      ctx.fill();
      
      ctx.restore();
    }
  };
  
  const renderSparkles = (ctx, width, height) => {
    const now = Date.now();
    const sparkleCount = 15;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.7;
      const size = 2 + Math.sin(now / 500 + i) * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const renderHugArms = (ctx, width, height) => {
    // Simplified hug arms visualization
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = width * 0.02;
    ctx.lineCap = 'round';
    
    const centerX = width / 2;
    const armY = height * 0.6;
    const now = Date.now();
    const armOpenAmount = Math.sin(now / 2000) * 0.1 + 0.9; // Arms slowly open and close
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(centerX - width * 0.1, armY);
    ctx.quadraticCurveTo(
      centerX - width * 0.3 * armOpenAmount,
      armY - height * 0.15,
      centerX - width * 0.4 * armOpenAmount,
      armY - height * 0.05
    );
    ctx.stroke();
    
    // Right arm
    ctx.beginPath();
    ctx.moveTo(centerX + width * 0.1, armY);
    ctx.quadraticCurveTo(
      centerX + width * 0.3 * armOpenAmount,
      armY - height * 0.15,
      centerX + width * 0.4 * armOpenAmount,
      armY - height * 0.05
    );
    ctx.stroke();
  };
  
  const renderConfetti = (ctx, width, height) => {
    const now = Date.now();
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
      const x = (i / confettiCount) * width + Math.sin(now / 1000 + i) * width * 0.1;
      const y = ((now / 2000) % 1 + i / confettiCount) * height % height;
      const size = width * 0.01;
      
      // Random confetti color
      const hue = (i * 20) % 360;
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.7)`;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(now / 500 + i);
      
      // Draw confetti piece
      ctx.fillRect(-size / 2, -size / 2, size, size);
      
      ctx.restore();
    }
  };
  
  const renderGlow = (ctx, width, height, type) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const now = Date.now();
    const maxRadius = Math.min(width, height) * 0.4;
    const pulseAmount = Math.sin(now / 1000) * 0.2 + 0.8;
    const radius = maxRadius * pulseAmount;
    
    let gradient;
    
    if (type === 'healing') {
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(100, 255, 200, 0.7)');
      gradient.addColorStop(0.5, 'rgba(100, 255, 200, 0.3)');
      gradient.addColorStop(1, 'rgba(100, 255, 200, 0)');
    } else {
      // Gentle glow
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  
  const renderStars = (ctx, width, height) => {
    const now = Date.now();
    const starCount = 20;
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.6;
      const scale = 0.3 + Math.sin(now / 1000 + i) * 0.2 + 0.5;
      const size = width * 0.01 * scale;
      
      ctx.fillStyle = 'rgba(255, 255, 100, 0.7)';
      
      // Draw 5-point star
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(now / 5000);
      
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = angle + Math.PI / 5;
        
        if (j === 0) {
          ctx.moveTo(Math.cos(angle) * size, Math.sin(angle) * size);
        } else {
          ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }
        
        ctx.lineTo(
          Math.cos(innerAngle) * size * 0.4,
          Math.sin(innerAngle) * size * 0.4
        );
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  };
  
  const renderFireworks = (ctx, width, height) => {
    const now = Date.now();
    const fireworkCount = 3;
    
    for (let i = 0; i < fireworkCount; i++) {
      const timeOffset = i * 1000;
      const timeSinceExplosion = (now + timeOffset) % 3000;
      
      if (timeSinceExplosion < 1500) {
        const explosionProgress = timeSinceExplosion / 1500;
        const centerX = width * (0.3 + i * 0.3);
        const centerY = height * 0.3;
        const radius = Math.min(width, height) * 0.15 * explosionProgress;
        const particleCount = 20;
        
        for (let j = 0; j < particleCount; j++) {
          const angle = (j / particleCount) * Math.PI * 2;
          const distance = radius * (0.5 + Math.sin(j) * 0.5);
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          const size = width * 0.005 * (1 - explosionProgress);
          
          // Fade out as explosion progresses
          const alpha = 1 - explosionProgress;
          
          // Random colors
          const hue = (i * 120 + j * 5) % 360;
          ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };
  
  // Toggle control visibility
  const toggleControls = () => {
    setShowControls(!showControls);
    
    if (showControls) {
      // If showing controls, set a timeout to hide them
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
    
    playHapticFeedback('selection');
  };
  
  // Toggle AR mode (position, follow, anchor)
  const changeArMode = () => {
    const modes = ['position', 'follow', 'anchor'];
    const currentIndex = modes.indexOf(arMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setArMode(modes[nextIndex]);
    playHapticFeedback('selection');
    
    // Show brief notification about mode change
    showNotification('AR Mode Changed', `Switched to ${modes[nextIndex]} mode`);
  };
  
  // Adjust overlay opacity
  const adjustOpacity = (amount) => {
    setOverlayOpacity(prev => {
      const newValue = Math.max(0, Math.min(1, prev + amount));
      return newValue;
    });
    playHapticFeedback('selection');
  };
  
  // Tutorial steps
  const tutorialSteps = [
    {
      title: 'Welcome to AR Hugs!',
      text: 'Experience an immersive hug in your real environment',
      action: 'Next',
    },
    {
      title: 'Find a Good Space',
      text: 'Point your camera at a well-lit area where you want to see your hug',
      action: 'Next',
    },
    {
      title: 'Interact with Your Hug',
      text: 'Tap the screen to show/hide controls, or use the overlay slider to adjust intensity',
      action: 'Next',
    },
    {
      title: 'Ready to Begin',
      text: 'Tap Start to begin your AR hug experience',
      action: 'Start AR',
    }
  ];
  
  // Navigate through tutorial
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      startAR();
    }
    
    playHapticFeedback('selection');
  };
  
  // Skip tutorial
  const skipTutorial = () => {
    setShowTutorial(false);
    startAR();
    playHapticFeedback('selection');
  };
  
  // Handle capture screenshot
  const captureScreenshot = () => {
    if (!canvasRef.current) return;
    
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ar-hug-${new Date().getTime()}.png`;
      link.click();
      
      playHapticFeedback('success');
      showNotification('Screenshot Saved', 'Your AR hug moment has been captured');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };
  
  // Share experience
  const shareExperience = () => {
    if (!navigator.share) {
      showNotification('Share Not Supported', 'Your device does not support sharing');
      return;
    }
    
    navigator.share({
      title: 'My AR Hug Experience',
      text: 'Check out this amazing AR hug I received!',
      url: window.location.href
    }).then(() => {
      playHapticFeedback('success');
    }).catch(error => {
      console.error('Error sharing:', error);
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`ar-container loading theme-${theme}`}>
        <div className="loading-spinner"></div>
        <h2>Preparing AR Experience</h2>
        <p>Setting up your immersive hug...</p>
      </div>
    );
  }
  
  // Error state
  if (arError || !deviceSupportsAR) {
    return (
      <div className={`ar-container error theme-${theme}`}>
        <div className="ar-error">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>AR Not Available</h2>
          <p>{arError || 'Your device does not support AR experiences'}</p>
          <div className="error-actions">
            <button 
              className="try-again-button"
              onClick={() => {
                setArError(null);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
            >
              <i className="fas fa-redo"></i>
              Try Again
            </button>
            
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`ar-container theme-${theme} ${orientation}`}>
      {/* Video element (hidden, used as source for canvas) */}
      <video 
        ref={videoRef}
        className="ar-video" 
        playsInline
        autoPlay
        muted
      />
      
      {/* Canvas for AR rendering */}
      <canvas 
        ref={canvasRef}
        className="ar-canvas"
        onClick={toggleControls}
      />
      
      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <h2>{tutorialSteps[tutorialStep].title}</h2>
            <p>{tutorialSteps[tutorialStep].text}</p>
            
            <div className="tutorial-progress">
              {tutorialSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`progress-dot ${index === tutorialStep ? 'active' : ''}`}
                />
              ))}
            </div>
            
            <div className="tutorial-actions">
              <button className="skip-tutorial" onClick={skipTutorial}>
                Skip
              </button>
              <button className="next-tutorial" onClick={nextTutorialStep}>
                {tutorialSteps[tutorialStep].action}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AR Controls */}
      {!showTutorial && (
        <div className={`ar-controls ${showControls ? 'visible' : 'hidden'}`}>
          <div className="top-controls">
            <button 
              className="back-button"
              onClick={() => {
                stopAR();
                navigate(-1);
              }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            
            <div className="hug-info">
              {hug && (
                <span>{hug.hugTypeName || 'AR Hug'}</span>
              )}
            </div>
            
            <button 
              className="mode-button"
              onClick={changeArMode}
            >
              <i className={`fas fa-${
                arMode === 'position' ? 'map-marker-alt' : 
                arMode === 'follow' ? 'crosshairs' : 
                'thumbtack'
              }`}></i>
            </button>
          </div>
          
          <div className="side-controls">
            <button 
              className="opacity-up"
              onClick={() => adjustOpacity(0.1)}
            >
              <i className="fas fa-plus"></i>
            </button>
            
            <div className="opacity-slider">
              <div 
                className="opacity-fill"
                style={{ height: `${overlayOpacity * 100}%` }}
              ></div>
            </div>
            
            <button 
              className="opacity-down"
              onClick={() => adjustOpacity(-0.1)}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
          
          <div className="bottom-controls">
            <button 
              className="screenshot-button"
              onClick={captureScreenshot}
            >
              <i className="fas fa-camera"></i>
            </button>
            
            <button 
              className="toggle-ar-button"
              onClick={arActive ? stopAR : startAR}
            >
              <i className={`fas fa-${arActive ? 'stop' : 'play'}`}></i>
            </button>
            
            <button 
              className="share-button"
              onClick={shareExperience}
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* AR Status Indicators */}
      {arActive && !showControls && (
        <div className="ar-status-indicators">
          <div className="ar-mode-indicator">
            <i className={`fas fa-${
              arMode === 'position' ? 'map-marker-alt' : 
              arMode === 'follow' ? 'crosshairs' : 
              'thumbtack'
            }`}></i>
          </div>
        </div>
      )}
      
      {/* Camera permission request screen */}
      {!cameraPermission && !arActive && !showTutorial && (
        <div className="permission-request">
          <div className="permission-card">
            <div className="permission-icon">
              <i className="fas fa-camera"></i>
            </div>
            <h2>Camera Access Needed</h2>
            <p>
              To experience AR hugs, we need access to your camera.
              This will allow virtual elements to appear in your real world.
            </p>
            <button className="allow-button" onClick={startAR}>
              Allow Camera Access
            </button>
            <button 
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARHugView;