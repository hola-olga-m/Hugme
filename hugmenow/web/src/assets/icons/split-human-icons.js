/**
 * Split Human Hug Icons
 * 
 * This script splits the human hug icons grid image into individual PNGs.
 * It creates a set of hug type icons with different variations.
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
  inputImagePath: '/home/runner/workspace/attached_assets/ChatGPT Image Mar 27, 2025, 08_37_11 AM.png',
  outputDir: path.join(__dirname, 'png-icons'),
  GRID_ROWS: 4,
  GRID_COLS: 6,
  hugTypes: [
    'BearHug', 'Supporting', 'Comforting', 'Loving', 'Celebrating', 'Festive',
    'Caring', 'Teasing', 'Teasing2', 'Inviting', 'Inviting2', 'Moody'
  ],
  individualIconSize: 256, // Size of output icons in pixels
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`Created output directory: ${config.outputDir}`);
}

// Also save the reference image to public directory
const referenceImageName = 'reference-human-hugs.png';
const publicImagesDir = path.join(__dirname, '..', '..', '..', 'public', 'images');

// Create public/images directory if it doesn't exist
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log(`Created public images directory: ${publicImagesDir}`);
}

// Copy the reference image to public location
try {
  fs.copyFileSync(config.inputImagePath, path.join(publicImagesDir, referenceImageName));
  console.log(`Copied reference image to public directory`);
} catch (err) {
  console.error(`Error copying reference image to public: ${err.message}`);
  // Continue execution even if copy fails
}

/**
 * Split the grid image into individual icons
 */
async function splitGridImage() {
  try {
    const image = await loadImage(config.inputImagePath);
    
    // Calculate cell dimensions from the source image
    const cellWidth = image.width / config.GRID_COLS;
    const cellHeight = image.height / config.GRID_ROWS;
    
    // Canvas for the output icons
    const canvas = createCanvas(config.individualIconSize, config.individualIconSize);
    const ctx = canvas.getContext('2d');
    
    // Index to track which hug type we're processing
    let typeIndex = 0;
    
    // Generate two variations for each hug type
    for (let row = 0; row < config.GRID_ROWS; row++) {
      for (let col = 0; col < config.GRID_COLS; col++) {
        // Skip if we've processed all hug types
        if (typeIndex >= config.hugTypes.length) continue;
        
        const hugType = config.hugTypes[typeIndex];
        
        // Create individual icon
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw with slight scaling to fit properly
        ctx.drawImage(
          image,
          col * cellWidth, row * cellHeight, cellWidth, cellHeight,
          0, 0, config.individualIconSize, config.individualIconSize
        );
        
        // Save the icon with a clear filename
        const iconPath = path.join(config.outputDir, `human-${hugType}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(iconPath, buffer);
        
        console.log(`Created: ${iconPath}`);
        
        // Move to the next hug type
        typeIndex++;
      }
    }
    
    // Create additional variants for each type (4 variants total)
    for (const hugType of config.hugTypes) {
      // Create variants with different filenames
      for (let variant = 1; variant <= 2; variant++) {
        const sourceIconPath = path.join(config.outputDir, `human-${hugType}.png`);
        
        // Skip if the source doesn't exist
        if (!fs.existsSync(sourceIconPath)) continue;
        
        const variantIconPath = path.join(config.outputDir, `human-${hugType}-variant${variant}.png`);
        
        // Copy the original icon as a variant
        fs.copyFileSync(sourceIconPath, variantIconPath);
        console.log(`Created variant: ${variantIconPath}`);
      }
    }
    
    console.log('Icon splitting completed successfully!');
  } catch (error) {
    console.error('Error splitting icons:', error);
  }
}

// Execute the function
splitGridImage();