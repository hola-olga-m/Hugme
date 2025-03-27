/**
 * Create Animated Human Hug Icons
 * 
 * This script generates animated versions of the human hug icons
 * by creating multiple frames with different effects.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  inputDir: path.join(__dirname, 'png-icons'),
  outputDir: path.join(__dirname, 'png-icons'),
  hugTypes: [
    'BearHug', 'Supporting', 'Comforting', 'Loving', 'Celebrating', 'Festive',
    'Caring', 'Teasing', 'Teasing2', 'Inviting', 'Inviting2', 'Moody'
  ],
  framesCount: 6, // Number of animation frames
  animationStyles: {
    // Different animation types for different hug types
    breathing: ['BearHug', 'Supporting', 'Comforting', 'Loving', 'Caring', 'Moody'],
    bouncing: ['Celebrating', 'Festive', 'Teasing', 'Teasing2'],
    glowing: ['Inviting', 'Inviting2']
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`Created output directory: ${config.outputDir}`);
}

/**
 * Generate animation frames for an icon with breathing effect
 * (Subtle scale up and down)
 */
async function createBreathingAnimation(iconPath, outputBaseName) {
  try {
    const image = await loadImage(iconPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < config.framesCount; i++) {
      // Calculate scale factor - oscillate between 0.95 and 1.05
      const progress = i / (config.framesCount - 1);
      const scale = 0.95 + 0.1 * Math.sin(progress * Math.PI);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image with scaling
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();
      
      // Save the frame
      const frameOutputPath = `${outputBaseName}_frame${i + 1}.png`;
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(frameOutputPath, buffer);
      
      console.log(`Created breathing animation frame: ${frameOutputPath}`);
    }
  } catch (error) {
    console.error(`Error creating breathing animation for ${iconPath}:`, error);
  }
}

/**
 * Generate animation frames for an icon with bouncing effect
 * (Move up and down)
 */
async function createBouncingAnimation(iconPath, outputBaseName) {
  try {
    const image = await loadImage(iconPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < config.framesCount; i++) {
      // Calculate vertical offset - oscillate between -10 and 10 pixels
      const progress = i / (config.framesCount - 1);
      const offset = -10 + 20 * Math.sin(progress * Math.PI);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image with vertical offset
      ctx.drawImage(image, 0, offset);
      
      // Save the frame
      const frameOutputPath = `${outputBaseName}_frame${i + 1}.png`;
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(frameOutputPath, buffer);
      
      console.log(`Created bouncing animation frame: ${frameOutputPath}`);
    }
  } catch (error) {
    console.error(`Error creating bouncing animation for ${iconPath}:`, error);
  }
}

/**
 * Generate animation frames for an icon with glowing/pulsing effect
 * (Change opacity and add glow)
 */
async function createGlowingAnimation(iconPath, outputBaseName) {
  try {
    const image = await loadImage(iconPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < config.framesCount; i++) {
      // Calculate glow intensity - oscillate between 0 and 1
      const progress = i / (config.framesCount - 1);
      const glowIntensity = 0.5 + 0.5 * Math.sin(progress * Math.PI);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the base image
      ctx.drawImage(image, 0, 0);
      
      // Add glow effect
      ctx.globalAlpha = glowIntensity * 0.3;
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `blur(${5 * glowIntensity}px)`;
      ctx.drawImage(image, 0, 0);
      
      // Reset context properties
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';
      
      // Save the frame
      const frameOutputPath = `${outputBaseName}_frame${i + 1}.png`;
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(frameOutputPath, buffer);
      
      console.log(`Created glowing animation frame: ${frameOutputPath}`);
    }
  } catch (error) {
    console.error(`Error creating glowing animation for ${iconPath}:`, error);
  }
}

/**
 * Process an icon to create animated frames
 */
async function processIcon(hugType) {
  const iconPath = path.join(config.inputDir, `human-${hugType}.png`);
  
  // Skip if icon doesn't exist
  if (!fs.existsSync(iconPath)) {
    console.warn(`Icon not found: ${iconPath}, skipping...`);
    return;
  }
  
  const outputBaseName = path.join(config.outputDir, `human-${hugType}-animated`);
  
  // Determine animation type based on hug type
  if (config.animationStyles.breathing.includes(hugType)) {
    await createBreathingAnimation(iconPath, outputBaseName);
  } else if (config.animationStyles.bouncing.includes(hugType)) {
    await createBouncingAnimation(iconPath, outputBaseName);
  } else if (config.animationStyles.glowing.includes(hugType)) {
    await createGlowingAnimation(iconPath, outputBaseName);
  } else {
    // Default to breathing animation
    await createBreathingAnimation(iconPath, outputBaseName);
  }
}

/**
 * Process all icons to create animated versions
 */
async function processAllIcons() {
  try {
    for (const hugType of config.hugTypes) {
      await processIcon(hugType);
    }
    console.log('All animated icons created successfully!');
  } catch (error) {
    console.error('Error processing icons:', error);
  }
}

// Execute the function
processAllIcons();