import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';

const ImmersiveHugPlayer = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { hugId } = useParams();
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hugData, setHugData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [visualizerIntensity, setVisualizerIntensity] = useState(50);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  
  // Animation state
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  
  // Load hug data
  useEffect(() => {
    const loadHugData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would fetch the hug data from an API
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock data
        const mockHugData = {
          id: hugId || 'immersive-hug-1',
          title: 'Ocean Calm',
          type: 'immersive',
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
          message: 'Take a moment to breathe and relax with this immersive ocean experience. I hope it brings you peace.',
          visualSettings: {
            colorPalette: ['#3498db', '#2980b9', '#1abc9c', '#16a085', '#2ecc71'],
            particleDensity: 50,
            speed: 0.5,
            backgroundGradient: ['#0a2342', '#2c3e50']
          },
          audioSettings: {
            audioUrl: 'https://sounds-mp3.s3.amazonaws.com/ocean-waves.mp3',
            volume: 0.7,
            loopAudio: true
          },
          createdAt: new Date().toISOString(),
          duration: 180 // seconds
        };
        
        setHugData(mockHugData);
        
        // Initialize visualizer once data is loaded
        if (canvasRef.current) {
          initializeVisualizer(mockHugData.visualSettings);
        }
        
        // Load audio if available
        if (audioRef.current && mockHugData.audioSettings?.audioUrl) {
          audioRef.current.src = mockHugData.audioSettings.audioUrl;
          audioRef.current.volume = mockHugData.audioSettings.volume || 0.7;
          audioRef.current.loop = mockHugData.audioSettings.loopAudio || true;
        }
      } catch (error) {
        console.error('Failed to load immersive hug data:', error);
        setError('Failed to load immersive experience. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHugData();
    
    // Clean up animation on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [hugId, currentUser]);
  
  // Initialize the visualizer with canvas
  const initializeVisualizer = (visualSettings) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initialize particles
    const particleCount = (visualSettings?.particleDensity || 50) * (canvas.width / 1000);
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: visualSettings?.colorPalette ? 
          visualSettings.colorPalette[Math.floor(Math.random() * visualSettings.colorPalette.length)] : 
          '#ffffff',
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.2 - 0.1,
        lastUpdate: 0
      });
    }
  };
  
  // Animation loop
  const animate = (time) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient
    if (hugData?.visualSettings?.backgroundGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, hugData.visualSettings.backgroundGradient[0]);
      gradient.addColorStop(1, hugData.visualSettings.backgroundGradient[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Update and draw particles
    for (const particle of particlesRef.current) {
      // Apply intensity factor
      const intensityFactor = visualizerIntensity / 50;
      
      // Update position
      particle.direction += particle.spin * deltaTime * 0.001 * intensityFactor;
      particle.x += Math.cos(particle.direction) * particle.speed * deltaTime * 0.1 * intensityFactor;
      particle.y += Math.sin(particle.direction) * particle.speed * deltaTime * 0.1 * intensityFactor;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      
      // Draw glow
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3 * intensityFactor;
      ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Continue animation loop if playing
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };
  
  // Start/stop the animation
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isPlaying, visualizerIntensity]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle audio
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle audio mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isAudioMuted;
    }
  }, [isAudioMuted]);
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    playHapticFeedback('selection');
    showControlsTemporarily();
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const container = document.querySelector('.immersive-player-container');
      if (container?.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    playHapticFeedback('selection');
    showControlsTemporarily();
  };
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Toggle mute
  const toggleMute = () => {
    setIsAudioMuted(!isAudioMuted);
    playHapticFeedback('selection');
    showControlsTemporarily();
  };
  
  // Handle intensity change
  const handleIntensityChange = (e) => {
    setVisualizerIntensity(Number(e.target.value));
    showControlsTemporarily();
  };
  
  // Show controls temporarily
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Hide controls after 3 seconds
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  };
  
  // Show controls on movement
  const handleMouseMove = () => {
    showControlsTemporarily();
  };
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle sharing
  const handleShare = () => {
    // In a real app, this would open a share dialog
    console.log('Sharing immersive hug experience');
    playHapticFeedback('selection');
  };
  
  if (isLoading) {
    return <Loading text="Loading immersive experience..." />;
  }
  
  if (error) {
    return (
      <div className="immersive-error">
        <div className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h2>Error Loading Experience</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-redo"></i> Retry
          </button>
          <button 
            className="back-btn"
            onClick={handleBack}
          >
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`immersive-player-container ${isPlaying ? 'playing' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="immersive-canvas"></canvas>
      
      <audio ref={audioRef} className="immersive-audio"></audio>
      
      {hugData && (
        <div className={`immersive-info ${showControls ? 'visible' : ''}`}>
          <div className="immersive-title">
            <h2>{hugData.title}</h2>
            <div className="from-text">From {hugData.sender.name}</div>
          </div>
          
          {hugData.message && (
            <div className="immersive-message">
              <p>{hugData.message}</p>
            </div>
          )}
        </div>
      )}
      
      <div className={`immersive-controls ${showControls ? 'visible' : ''}`}>
        <div className="top-controls">
          <button className="back-btn" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
          
          <div className="title-display">
            {hugData?.title || 'Immersive Experience'}
          </div>
          
          <button className="share-btn" onClick={handleShare}>
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
        
        <div className="center-controls">
          <button 
            className="play-pause-btn"
            onClick={togglePlay}
          >
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
          </button>
        </div>
        
        <div className="bottom-controls">
          <button 
            className="mute-btn"
            onClick={toggleMute}
          >
            <i className={`fas fa-volume-${isAudioMuted ? 'mute' : 'up'}`}></i>
          </button>
          
          <div className="intensity-slider">
            <span className="slider-label">Intensity</span>
            <input
              type="range"
              min="10"
              max="100"
              value={visualizerIntensity}
              onChange={handleIntensityChange}
              className="slider"
            />
          </div>
          
          <button 
            className="fullscreen-btn"
            onClick={toggleFullscreen}
          >
            <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
          </button>
        </div>
      </div>
      
      <div className="virality-feature">
        <div className="share-experience-card">
          <div className="share-header">
            <div className="share-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Share this Experience</h3>
          </div>
          <div className="share-content">
            <p>Share this immersive hug with others who might need it!</p>
            <div className="share-platforms">
              <button className="platform-btn">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="platform-btn">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="platform-btn">
                <i className="fab fa-instagram"></i>
              </button>
              <button className="platform-btn">
                <i className="fab fa-whatsapp"></i>
              </button>
            </div>
            <button className="create-own-btn">
              <i className="fas fa-magic"></i> Create Your Own
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHugPlayer;