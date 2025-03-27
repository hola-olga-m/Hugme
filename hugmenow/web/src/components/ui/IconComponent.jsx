import React from 'react';
import { motion } from 'framer-motion';
import happyFace from '../../assets/icons/happy-face.svg';
import hugIcon from '../../assets/icons/hug-icon.svg';
import moodTracker from '../../assets/icons/mood-tracker.svg';
import community from '../../assets/icons/community.svg';

// SVG data URIs for mood emojis
const moodEmojis = {
  verySad: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 45C40 45 45 40 50 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 45C70 45 75 40 80 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 85C40 85 60 75 80 85' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E`,
  
  sad: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 80C40 80 60 70 80 80' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E`,
  
  neutral: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 75C40 75 60 75 80 75' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E`,
  
  happy: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 70C40 70 60 80 80 70' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E`,
  
  veryHappy: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M35 45C35 45 40 40 45 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M75 45C75 45 80 40 85 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M35 65C35 65 60 90 85 65' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E`,
};

// Hearts SVG
const heart = `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23EC4899'/%3E%3C/svg%3E`;

// Fire SVG for streak
const fire = `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2c3 4 5 6 9 7-4 4-7 8-7 13H10c0-5-3-9-7-13 4-1 6-3 9-7z' fill='%23F59E0B'/%3E%3C/svg%3E`;

/**
 * Icon component for mood emojis and other SVG assets
 */
export const Icon = ({ type, score, size = 40, animate = true, ...props }) => {
  // Handle mood type with score
  if (type === 'mood' && score !== undefined) {
    let moodType;
    if (score === null) return <div style={{ width: size, height: size }}></div>;
    if (score >= 8.5) moodType = 'veryHappy';
    else if (score >= 7) moodType = 'happy';
    else if (score >= 5) moodType = 'neutral';
    else if (score >= 3) moodType = 'sad';
    else moodType = 'verySad';
    
    const src = moodEmojis[moodType];
    
    if (animate) {
      return (
        <motion.img 
          src={src}
          alt={`Mood level: ${moodType}`}
          width={size}
          height={size}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            type: "spring",
            damping: 10,
            stiffness: 100,
            delay: 0.3
          }}
          {...props}
        />
      );
    }
    
    return <img src={src} alt={`Mood level: ${moodType}`} width={size} height={size} {...props} />;
  }
  
  // Fixed icon types
  let src;
  let alt;
  
  switch (type) {
    case 'happyFace':
      src = happyFace;
      alt = 'Happy Face';
      break;
    case 'hugIcon':
      src = hugIcon;
      alt = 'Hug Icon';
      break;
    case 'moodTracker':
      src = moodTracker;
      alt = 'Mood Tracker';
      break;
    case 'community':
      src = community;
      alt = 'Community';
      break;
    case 'heart':
      src = heart;
      alt = 'Heart';
      break;
    case 'fire':
      src = fire;
      alt = 'Fire';
      break;
    default:
      return null;
  }
  
  if (animate) {
    return (
      <motion.img 
        src={src} 
        alt={alt}
        width={size}
        height={size}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          damping: 15,
          stiffness: 200,
          delay: 0.2
        }}
        {...props}
      />
    );
  }
  
  return <img src={src} alt={alt} width={size} height={size} {...props} />;
}

/**
 * Animated avatar component
 */
export const UserAvatar = ({ name, size = 40, bgColor = "#4F46E5", ...props }) => {
  const initial = name ? name[0].toUpperCase() : "?";
  
  return (
    <motion.div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bgColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size / 2,
        ...props.style
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        damping: 12,
        stiffness: 200,
        delay: 0.1
      }}
      {...props}
    >
      {initial}
    </motion.div>
  );
};

export default Icon;