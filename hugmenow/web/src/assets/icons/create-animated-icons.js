/**
 * Script to create animated versions of the hug icons
 * using frame-by-frame animation techniques
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

// Configuration
const CONFIG = {
  framesCount: 30, // Number of frames per animation
  outputDir: path.resolve('./src/assets/icons/png-icons'),
  inputDir: path.resolve('./src/assets/icons/png-icons'),
  // Animation mappings - which icons get which animation types
  animationTypes: {
    'BearHug': 'breathing',
    'Supporting': 'breathing',
    'Comforting': 'breathing',
    'Loving': 'pulsing',
    'Celebrating': 'bouncing',
    'Festive': 'bouncing',
    'Caring': 'breathing',
    'Teasing': 'breathing',
    'Inviting': 'breathing',
    'Moody': 'breathing'
  }
};

/**
 * Create a breathing animation effect for a hug icon
 * Creates a series of frames with subtle scaling
 */
async function createBreathingAnimation(iconName) {
  try {
    // Load the base icon
    const iconPath = path.join(CONFIG.inputDir, `${iconName}.png`);
    const baseIcon = await loadImage(iconPath);
    
    // Create a canvas matching the icon dimensions
    const canvas = createCanvas(baseIcon.width, baseIcon.height);
    const ctx = canvas.getContext('2d');
    
    // Create animation frames
    for (let frame = 0; frame < CONFIG.framesCount; frame++) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scale factor (between 1.0 and 1.05)
      // This creates a gentle breathing effect
      const progress = frame / CONFIG.framesCount;
      const scale = 1 + 0.05 * Math.sin(progress * Math.PI * 2);
      
      // Calculate position adjustments to keep centered during scaling
      const offsetX = (canvas.width - baseIcon.width * scale) / 2;
      const offsetY = (canvas.height - baseIcon.height * scale) / 2;
      
      // Draw the scaled image
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(baseIcon, -baseIcon.width / 2, -baseIcon.height / 2);
      ctx.restore();
      
      // Save the frame
      const outputPath = path.join(CONFIG.outputDir, `${iconName}_frame${frame + 1}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(outputPath, buffer);
      
      console.log(`Created: ${iconName}_frame${frame + 1}.png (Breathing)`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating breathing animation for ${iconName}:`, error);
    return false;
  }
}

/**
 * Create a bouncing animation effect for a hug icon
 * Creates a series of frames with vertical movement
 */
async function createBouncingAnimation(iconName) {
  try {
    // Load the base icon
    const iconPath = path.join(CONFIG.inputDir, `${iconName}.png`);
    const baseIcon = await loadImage(iconPath);
    
    // Create a canvas matching the icon dimensions
    const canvas = createCanvas(baseIcon.width, baseIcon.height);
    const ctx = canvas.getContext('2d');
    
    // Create animation frames
    for (let frame = 0; frame < CONFIG.framesCount; frame++) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate vertical offset (bouncing effect)
      // Max vertical movement is 5% of the height
      const progress = frame / CONFIG.framesCount;
      const verticalOffset = Math.abs(Math.sin(progress * Math.PI * 2)) * (baseIcon.height * 0.05);
      
      // Draw the image with vertical offset
      ctx.drawImage(
        baseIcon,
        0,                      // Source x
        0,                      // Source y
        baseIcon.width,         // Source width
        baseIcon.height,        // Source height
        0,                      // Destination x
        -verticalOffset,        // Destination y (negative moves up)
        baseIcon.width,         // Destination width
        baseIcon.height         // Destination height
      );
      
      // Save the frame
      const outputPath = path.join(CONFIG.outputDir, `${iconName}_frame${frame + 1}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(outputPath, buffer);
      
      console.log(`Created: ${iconName}_frame${frame + 1}.png (Bouncing)`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating bouncing animation for ${iconName}:`, error);
    return false;
  }
}

/**
 * Create a pulsing animation effect for a hug icon
 * Creates a series of frames with color pulsing
 */
async function createPulsingAnimation(iconName) {
  try {
    // Load the base icon
    const iconPath = path.join(CONFIG.inputDir, `${iconName}.png`);
    const baseIcon = await loadImage(iconPath);
    
    // Create a canvas matching the icon dimensions
    const canvas = createCanvas(baseIcon.width, baseIcon.height);
    const ctx = canvas.getContext('2d');
    
    // Create animation frames
    for (let frame = 0; frame < CONFIG.framesCount; frame++) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the base image
      ctx.drawImage(baseIcon, 0, 0);
      
      // Apply color pulse effect
      // The progress through the animation cycle
      const progress = frame / CONFIG.framesCount;
      // Pulsing intensity (0.0 to 0.3)
      const intensity = 0.3 * Math.sin(progress * Math.PI * 2);
      
      // Overlay a semi-transparent layer with pink/red tint
      ctx.save();
      ctx.globalAlpha = Math.max(0, intensity);
      ctx.fillStyle = '#ff6b8b'; // Pinkish/red color for heart/love themes
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'overlay';
      ctx.restore();
      
      // Save the frame
      const outputPath = path.join(CONFIG.outputDir, `${iconName}_frame${frame + 1}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(outputPath, buffer);
      
      console.log(`Created: ${iconName}_frame${frame + 1}.png (Pulsing)`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating pulsing animation for ${iconName}:`, error);
    return false;
  }
}

/**
 * Main function to process all icons and create animations
 */
async function createAnimatedIcons() {
  try {
    // Get list of all PNG icons
    const files = await fs.readdir(CONFIG.inputDir);
    const baseIcons = files.filter(file => 
      file.endsWith('.png') && !file.includes('_frame') && !file.includes('reference')
    );
    
    console.log(`Found ${baseIcons.length} base icons to animate`);
    
    // Process each icon
    for (const iconFile of baseIcons) {
      // Extract the icon name without extension
      const iconName = iconFile.replace('.png', '');
      
      // Determine the hug type (extract from filename, e.g., "BearHug_1" -> "BearHug")
      const hugType = iconName.split('_')[0];
      
      // Get the appropriate animation type for this hug type
      const animationType = CONFIG.animationTypes[hugType] || 'breathing';
      
      console.log(`Creating ${animationType} animation for ${iconName}`);
      
      // Create the animation based on type
      switch (animationType) {
        case 'breathing':
          await createBreathingAnimation(iconName);
          break;
        case 'bouncing':
          await createBouncingAnimation(iconName);
          break;
        case 'pulsing':
          await createPulsingAnimation(iconName);
          break;
        default:
          await createBreathingAnimation(iconName); // Default to breathing
      }
    }
    
    console.log('Animation creation complete!');
  } catch (error) {
    console.error('Error creating animated icons:', error);
  }
}

// Execute the animation creation
createAnimatedIcons();