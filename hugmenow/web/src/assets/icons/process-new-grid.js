/**
 * Process New Grid Image
 * 
 * This script processes the newest hug icon reference grid in a single step:
 * 1. Splits the grid into individual icons
 * 2. Creates animated versions of each icon
 * 3. Copies all results to the public directory
 */

import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Configuration
const GRID_IMAGE_PATH = path.resolve('./src/assets/reference/new-human-grid.png');
const OUTPUT_DIR = path.resolve('./src/assets/icons/png-icons/');
const PUBLIC_OUTPUT_DIR = path.resolve('./public/assets/icons/png-icons/');
const PREFIX = 'human';
const CELL_SIZE = 256; // Size of each cell in the grid
const FRAMES = 6; // Number of animation frames

// Icon mapping for the grid - [row, col, name]
const ICON_MAPPING = [
  [0, 0, 'BearHug'],
  [0, 1, 'Supporting'],
  [0, 2, 'Comforting'],
  [0, 3, 'Loving'],
  [0, 4, 'Celebrating'],
  [0, 5, 'Festive'],
  [3, 0, 'Caring'],
  [3, 1, 'Teasing1'],
  [2, 2, 'Teasing2'],
  [3, 3, 'Inviting1'],
  [3, 4, 'Inviting2'],
  [3, 5, 'Moody']
];

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true });

// Function to extract and save an icon from the grid
async function extractIcon(gridImage, row, col, iconName) {
  const x = col * CELL_SIZE;
  const y = row * CELL_SIZE;
  
  console.log(`Processing ${iconName} at position [${row},${col}] (${x},${y})`);
  
  const canvas = createCanvas(CELL_SIZE, CELL_SIZE);
  const ctx = canvas.getContext('2d');
  
  // Extract the icon from the grid
  ctx.drawImage(gridImage, x, y, CELL_SIZE, CELL_SIZE, 0, 0, CELL_SIZE, CELL_SIZE);
  
  // Save the extracted icon
  const iconPath = path.join(OUTPUT_DIR, `${PREFIX}-${iconName}.png`);
  const out = fs.createWriteStream(iconPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Icon saved: ${iconPath}`);
      
      // Copy to public directory
      const publicIconPath = path.join(PUBLIC_OUTPUT_DIR, `${PREFIX}-${iconName}.png`);
      fs.copyFile(iconPath, publicIconPath, (err) => {
        if (err) {
          console.error(`Error copying icon to public directory: ${err}`);
          reject(err);
        } else {
          console.log(`Icon copied to public: ${publicIconPath}`);
          resolve(iconPath);
        }
      });
    });
    
    out.on('error', (err) => {
      console.error(`Error saving icon: ${err}`);
      reject(err);
    });
  });
}

// Function to create animated versions of an icon
async function createAnimatedFrames(iconPath, iconName) {
  console.log(`Creating animation for ${iconName}...`);
  
  try {
    // Load the icon
    const icon = await loadImage(iconPath);
    
    // Create animation frames
    for (let frame = 1; frame <= FRAMES; frame++) {
      const canvas = createCanvas(icon.width, icon.height);
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply animation effect based on frame number
      switch (frame) {
        case 1: // Normal size
          ctx.drawImage(icon, 0, 0);
          break;
          
        case 2: // Slight glow effect
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = '#ffccff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(icon, 0, 0);
          break;
          
        case 3: // Scaled up (breathing effect)
          const scale1 = 1.05;
          const offsetUp = (icon.width * (scale1 - 1)) / 2;
          ctx.drawImage(
            icon, 
            -offsetUp, -offsetUp, 
            icon.width * scale1, icon.height * scale1
          );
          break;
          
        case 4: // Stronger glow effect
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(icon, 0, 0);
          break;
          
        case 5: // Scaled down (breathing effect)
          const scale2 = 0.96;
          const offsetDown = (icon.width * (1 - scale2)) / 2;
          ctx.drawImage(
            icon,
            offsetDown, offsetDown,
            icon.width * scale2, icon.height * scale2
          );
          break;
          
        case 6: // Custom glow based on hug type
          // Determine color based on icon name
          let glowColor = '#ffbbbb'; // Default pink glow
          
          if (iconName.includes('Moody')) {
            glowColor = '#bbbbff'; // Blue for moody
          } else if (iconName.includes('Celebrating') || iconName.includes('Festive')) {
            glowColor = '#ffffbb'; // Yellow for celebration
          } else if (iconName.includes('Caring')) {
            glowColor = '#bbffbb'; // Green for caring
          }
          
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = glowColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(icon, 0, 0);
          break;
      }
      
      // Save the frame
      const frameName = `${PREFIX}-${iconName}-animated_frame${frame}.png`;
      const framePath = path.join(OUTPUT_DIR, frameName);
      const publicFramePath = path.join(PUBLIC_OUTPUT_DIR, frameName);
      
      // Write to file
      const out = fs.createWriteStream(framePath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      await new Promise((resolve, reject) => {
        out.on('finish', () => {
          console.log(`  Frame ${frame} saved: ${framePath}`);
          
          // Copy to public directory
          fs.copyFile(framePath, publicFramePath, (err) => {
            if (err) {
              console.error(`  Error copying frame to public directory: ${err}`);
              reject(err);
            } else {
              console.log(`  Frame ${frame} copied to public: ${publicFramePath}`);
              resolve();
            }
          });
        });
        
        out.on('error', (err) => {
          console.error(`  Error saving frame: ${err}`);
          reject(err);
        });
      });
    }
    
    console.log(`Animation complete for ${iconName}`);
  } catch (error) {
    console.error(`Error processing animation for ${iconName}: ${error.message}`);
  }
}

// Main function to process the grid
async function main() {
  try {
    console.log('Starting grid processing...');
    console.log(`Loading image: ${GRID_IMAGE_PATH}`);
    
    // Load the grid image
    const gridImage = await loadImage(GRID_IMAGE_PATH);
    console.log(`Image loaded: ${gridImage.width}x${gridImage.height}`);
    console.log(`Cell size: ${CELL_SIZE}x${CELL_SIZE}`);
    
    // Process each icon defined in the mapping
    for (const [row, col, name] of ICON_MAPPING) {
      try {
        // Extract and save the icon
        const iconPath = await extractIcon(gridImage, row, col, name);
        
        // Create animated frames for the icon
        await createAnimatedFrames(iconPath, name);
      } catch (error) {
        console.error(`Error processing icon at [${row},${col}] (${name}): ${error.message}`);
      }
    }
    
    console.log('Grid processing completed successfully!');
  } catch (error) {
    console.error('Error in grid processing:', error);
  }
}

// Run the script
main();