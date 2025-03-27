/**
 * Process Icons Script
 * 
 * This script runs the icon splitting and animation creation processes in sequence.
 * It first splits the reference grid image into individual icons, then creates
 * animated versions of those icons.
 */

// Import the icon splitting functionality
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

// Grid layout configuration based on the reference image
const GRID_CONFIG = {
  // The reference image has 6 columns and 4 rows
  columns: 6,
  rows: 4,
  // Hug types across the top and bottom of the image
  columnLabels: ['BearHug', 'Supporting', 'Comforting', 'Loving', 'Celebrating', 'Festive'],
  bottomLabels: ['Caring', 'Teasing', 'Teasing', 'Inviting', 'Inviting', 'Moody']
};

// Output directory for individual PNG icons
const OUTPUT_DIR = path.resolve('./src/assets/icons/png-icons');

/**
 * Split the reference grid image into individual icons
 */
async function splitGridImage() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Load the reference grid image
    const gridImage = await loadImage('./src/assets/icons/reference-hugs.png');
    
    // Calculate the size of each individual icon
    const iconWidth = gridImage.width / GRID_CONFIG.columns;
    const iconHeight = gridImage.height / GRID_CONFIG.rows;
    
    // Create canvas for extracting individual icons
    const canvas = createCanvas(iconWidth, iconHeight);
    const ctx = canvas.getContext('2d');
    
    // Extract each icon from the grid
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      for (let col = 0; col < GRID_CONFIG.columns; col++) {
        // Clear canvas for new icon
        ctx.clearRect(0, 0, iconWidth, iconHeight);
        
        // Draw the specific portion of the grid image to the canvas
        ctx.drawImage(
          gridImage,
          col * iconWidth,   // Source X
          row * iconHeight,  // Source Y
          iconWidth,         // Source width
          iconHeight,        // Source height
          0,                 // Destination X
          0,                 // Destination Y
          iconWidth,         // Destination width
          iconHeight         // Destination height
        );
        
        // Determine the hug type based on column and position
        let hugType;
        if (row < 3) {
          // Icons in rows 0-2 use the column labels
          hugType = GRID_CONFIG.columnLabels[col];
        } else {
          // Icons in row 3 (the bottom row) use the bottom labels
          hugType = GRID_CONFIG.bottomLabels[col];
        }
        
        // Add a numeric suffix for variants of the same type
        const variantNumber = row + 1;
        const fileName = `${hugType}_${variantNumber}.png`;
        
        // Save the individual icon as a PNG
        const outputPath = path.join(OUTPUT_DIR, fileName);
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(outputPath, buffer);
        
        console.log(`Extracted: ${fileName}`);
      }
    }
    
    console.log('Icon extraction complete!');
    
    // Return a count of extracted icons
    return GRID_CONFIG.columns * GRID_CONFIG.rows;
  } catch (error) {
    console.error('Error splitting grid image:', error);
    throw error;
  }
}

// Configuration for animations
const ANIMATION_CONFIG = {
  framesCount: 30, // Number of frames per animation
  outputDir: OUTPUT_DIR,
  inputDir: OUTPUT_DIR,
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
    const iconPath = path.join(ANIMATION_CONFIG.inputDir, `${iconName}.png`);
    const baseIcon = await loadImage(iconPath);
    
    // Create a canvas matching the icon dimensions
    const canvas = createCanvas(baseIcon.width, baseIcon.height);
    const ctx = canvas.getContext('2d');
    
    // Create animation frames
    for (let frame = 0; frame < ANIMATION_CONFIG.framesCount; frame++) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scale factor (between 1.0 and 1.05)
      // This creates a gentle breathing effect
      const progress = frame / ANIMATION_CONFIG.framesCount;
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
      const outputPath = path.join(ANIMATION_CONFIG.outputDir, `${iconName}_frame${frame + 1}.png`);
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
    const iconPath = path.join(ANIMATION_CONFIG.inputDir, `${iconName}.png`);
    const baseIcon = await loadImage(iconPath);
    
    // Create a canvas matching the icon dimensions
    const canvas = createCanvas(baseIcon.width, baseIcon.height);
    const ctx = canvas.getContext('2d');
    
    // Create animation frames
    for (let frame = 0; frame < ANIMATION_CONFIG.framesCount; frame++) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate vertical offset (bouncing effect)
      // Max vertical movement is 5% of the height
      const progress = frame / ANIMATION_CONFIG.framesCount;
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
      const outputPath = path.join(ANIMATION_CONFIG.outputDir, `${iconName}_frame${frame + 1}.png`);
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
    const iconPath = path.join(ANIMATION_CONFIG.inputDir, `${iconName}.png`);
    const baseIcon = await loadImage(iconPath);
    
    // Create a canvas matching the icon dimensions
    const canvas = createCanvas(baseIcon.width, baseIcon.height);
    const ctx = canvas.getContext('2d');
    
    // Create animation frames
    for (let frame = 0; frame < ANIMATION_CONFIG.framesCount; frame++) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the base image
      ctx.drawImage(baseIcon, 0, 0);
      
      // Apply color pulse effect
      // The progress through the animation cycle
      const progress = frame / ANIMATION_CONFIG.framesCount;
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
      const outputPath = path.join(ANIMATION_CONFIG.outputDir, `${iconName}_frame${frame + 1}.png`);
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
 * Create animated versions of all icons
 */
async function createAnimatedIcons() {
  try {
    // Get list of all PNG icons
    const files = await fs.readdir(ANIMATION_CONFIG.inputDir);
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
      const animationType = ANIMATION_CONFIG.animationTypes[hugType] || 'breathing';
      
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

/**
 * Main process function
 */
async function processIcons() {
  try {
    console.log("Starting icon processing...");
    
    // Step 1: Split the grid image into individual icons
    console.log("Step 1: Splitting reference grid image into individual icons...");
    const iconCount = await splitGridImage();
    console.log(`Successfully split ${iconCount} icons from the grid image.`);
    
    // Step 2: Create animated versions of the icons
    console.log("Step 2: Creating animated versions of the icons...");
    await createAnimatedIcons();
    console.log("Animated icon creation complete.");
    
    console.log("Icon processing complete! All icons have been extracted and animated.");
  } catch (error) {
    console.error("Error during icon processing:", error);
  }
}

// Execute the process
processIcons();