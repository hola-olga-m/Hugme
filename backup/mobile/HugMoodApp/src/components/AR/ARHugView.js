// ARHugView.js - AR Hug Viewing Component
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { ViroARSceneNavigator, ViroARScene, ViroAmbientLight, 
         ViroParticleEmitter, ViroNode, ViroAnimations } from '@viro-community/react-viro';

// This component handles the AR experience for viewing hugs
export default function ARHugView({ route, navigation }) {
  const [initialized, setInitialized] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [hugType, setHugType] = useState(route?.params?.hugType || 'standard');
  const [intensity, setIntensity] = useState(route?.params?.intensity || 'medium');
  const [showInfo, setShowInfo] = useState(true);
  const fadeAnim = new Animated.Value(1);

  // Handle AR scene loaded
  const handleSceneLoaded = () => {
    setInitialized(true);
    
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setShowInfo(false));
    }, 3000);
  };

  // Handle AR tracking changes
  const handleTrackingUpdated = (state, reason) => {
    if (state === 3) { // TRACKING_NORMAL
      setTracking(true);
    } else {
      setTracking(false);
    }
  };

  // AR Scene component
  const HugARScene = (props) => {
    return (
      <ViroARScene onTrackingUpdated={handleTrackingUpdated}>
        <ViroAmbientLight color="#ffffff" intensity={1.0} />
        
        {tracking && (
          <ViroNode position={[0, 0, -1]} dragType="FixedToWorld">
            <HugParticleEmitter hugType={hugType} intensity={intensity} />
          </ViroNode>
        )}
      </ViroARScene>
    );
  };

  // Configure particle system based on hug type and intensity
  const HugParticleEmitter = ({ hugType, intensity }) => {
    // Configure different particle systems based on hug type
    const particleConfig = getParticleConfig(hugType, intensity);
    
    return (
      <ViroParticleEmitter
        position={[0, 0, 0]}
        duration={3000}
        delay={0}
        visible={true}
        run={true}
        loop={true}
        {...particleConfig}
      />
    );
  };

  // Map hug types to particle system configurations
  const getParticleConfig = (hugType, intensity) => {
    const intensityMultiplier = getIntensityMultiplier(intensity);
    
    const configs = {
      standard: {
        image: {
          source: require('../../assets/particles/heart.png'),
          height: 0.1,
          width: 0.1,
        },
        particleCount: 100 * intensityMultiplier,
        spawnRate: 50 * intensityMultiplier,
        color: [[1, 0.3, 0.3, 1]],
        startScale: [[0.1, 0.1, 0.1]],
        endScale: [[0.3, 0.3, 0.3]],
        particleLifetime: [1.5, 2.5],
        maxDistance: 3,
        emissionRatePerSecond: [10, 15],
        spawnVolume: {
          shape: 'sphere',
          params: [0.7],
          spawnOnSurface: true,
        },
        acceleration: {x: 0, y: 0.1, z: 0},
      },
      
      warm: {
        image: {
          source: require('../../assets/particles/glow.png'),
          height: 0.15,
          width: 0.15,
        },
        particleCount: 80 * intensityMultiplier,
        spawnRate: 40 * intensityMultiplier,
        color: [[1, 0.7, 0.3, 1], [1, 0.5, 0.2, 1]],
        startScale: [[0.1, 0.1, 0.1]],
        endScale: [[0.4, 0.4, 0.4]],
        particleLifetime: [2, 3],
        maxDistance: 3.5,
        emissionRatePerSecond: [8, 12],
        spawnVolume: {
          shape: 'box',
          params: [1, 1, 1],
          spawnOnSurface: false,
        },
        acceleration: {x: 0, y: 0.05, z: 0},
      },
      
      healing: {
        image: {
          source: require('../../assets/particles/sparkle.png'),
          height: 0.1,
          width: 0.1,
        },
        particleCount: 120 * intensityMultiplier,
        spawnRate: 60 * intensityMultiplier,
        color: [[0.3, 0.8, 1, 1], [0.4, 0.9, 0.5, 1]],
        startScale: [[0.1, 0.1, 0.1]],
        endScale: [[0.3, 0.3, 0.3]],
        particleLifetime: [1.8, 2.8],
        maxDistance: 4,
        emissionRatePerSecond: [12, 18],
        spawnVolume: {
          shape: 'sphere',
          params: [1],
          spawnOnSurface: true,
        },
        acceleration: {x: 0, y: 0.2, z: 0},
      },
      
      energetic: {
        image: {
          source: require('../../assets/particles/star.png'),
          height: 0.1,
          width: 0.1,
        },
        particleCount: 150 * intensityMultiplier,
        spawnRate: 70 * intensityMultiplier,
        color: [[1, 0.8, 0.2, 1], [1, 0.5, 0, 1]],
        startScale: [[0.1, 0.1, 0.1]],
        endScale: [[0.2, 0.2, 0.2]],
        particleLifetime: [1, 2],
        maxDistance: 5,
        emissionRatePerSecond: [15, 20],
        spawnVolume: {
          shape: 'box',
          params: [1.5, 1.5, 1.5],
          spawnOnSurface: false,
        },
        acceleration: {x: 0, y: 0.3, z: 0},
        velocity: {
          initialRange: [
            [-2, -0.5, -2], 
            [2, 2, 2]
          ]
        },
      },
      
      calming: {
        image: {
          source: require('../../assets/particles/circle.png'),
          height: 0.1,
          width: 0.1,
        },
        particleCount: 70 * intensityMultiplier,
        spawnRate: 35 * intensityMultiplier,
        color: [[0.5, 0.5, 1, 1], [0.7, 0.7, 1, 1]],
        startScale: [[0.1, 0.1, 0.1]],
        endScale: [[0.4, 0.4, 0.4]],
        particleLifetime: [3, 4],
        maxDistance: 3,
        emissionRatePerSecond: [6, 10],
        spawnVolume: {
          shape: 'sphere',
          params: [1.2],
          spawnOnSurface: true,
        },
        acceleration: {x: 0, y: -0.05, z: 0},
      },
    };
    
    return configs[hugType] || configs.standard;
  };

  // Map intensity values to multipliers
  const getIntensityMultiplier = (intensity) => {
    const intensityMap = {
      gentle: 0.6,
      medium: 1.0,
      strong: 1.5,
      extreme: 2.0
    };
    
    return intensityMap[intensity] || 1.0;
  };

  // Register animations
  ViroAnimations.registerAnimations({
    rotate: {
      properties: {
        rotateY: "+=90",
      },
      duration: 2500,
    },
    orbit: {
      properties: {
        positionX: [-1, 0, 1, 0, -1],
        positionZ: [0, 1, 0, -1, 0],
      },
      easing: "Linear",
      duration: 5000,
    },
    pulse: {
      properties: {
        scaleX: [1.0, 1.2, 1.0],
        scaleY: [1.0, 1.2, 1.0],
        scaleZ: [1.0, 1.2, 1.0],
      },
      easing: "EaseInOut",
      duration: 1000,
    },
  });

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HugARScene,
        }}
        style={styles.arView}
        onInitialized={handleSceneLoaded}
      />
      
      {showInfo && (
        <Animated.View style={[styles.infoOverlay, { opacity: fadeAnim }]}>
          <Text style={styles.infoTitle}>AR Hug Experience</Text>
          <Text style={styles.infoText}>
            Move your phone around to scan your environment.
            The virtual hug will appear once tracking is established.
          </Text>
        </Animated.View>
      )}
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Exit AR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            // Take screenshot or record video
          }}
        >
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});