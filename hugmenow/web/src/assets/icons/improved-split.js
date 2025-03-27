/**
 * Improved Smart Hug Icons Splitter
 * 
 * This script intelligently processes multiple grid reference images and extracts
 * individual icons with smart grid detection and auto-naming capabilities.
 */

import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Configuration
const REFERENCE_DIR = path.resolve('./src/assets/reference/latest/');
const OUTPUT_DIR = path.resolve('./src/assets/icons/png-icons/');
const PUBLIC_OUTPUT_DIR = path.resolve('./public/assets/icons/png-icons/');
const PREFIX = 'purple';
const FRAMES = 6;

// Grid 1 Configuration - 6x5 grid
const GRID1_CONFIG = {
  filename: 'purple-grid-1.png',
  rows: 5,
  cols: 6,
  // Format: [row, column, name, variant]
  mapping: [
    [0, 0, 'Gentle'],
    [0, 1, 'Shy'],
    [0, 2, 'Soft'],
    [0, 3, 'Sweet'],
    [0, 4, 'Tender'],
    [0, 5, 'Cheerful'],
    [1, 0, 'Gentle', 2],
    [1, 1, 'Shy', 2],
    [1, 2, 'Soft', 2],
    [1, 3, 'Sweet', 2],
    [1, 4, 'Tender', 2],
    [1, 5, 'Cheerful', 2],
    [2, 0, 'Gentle', 3],
    [2, 1, 'Shy', 3],
    [2, 2, 'Soft', 3],
    [2, 3, 'Sweet', 3],
    [2, 4, 'Tender', 3],
    [2, 5, 'Cheerful', 3],
    [3, 0, 'Gentle', 4],
    [3, 1, 'Shy', 4],
    [3, 2, 'Soft', 4],
    [3, 3, 'Sweet', 4],
    [3, 4, 'FamilyHug'],
    [3, 5, 'Cheerful', 4],
    [4, 0, 'Gentle', 5],
    [4, 1, 'Shy', 5],
    [4, 2, 'Soft', 5],
    [4, 3, 'Sweet', 5],
    [4, 4, 'ParentHug'],
    [4, 5, 'Cheerful', 5]
  ]
};

// Grid 2 Configuration - 8x8 grid
const GRID2_CONFIG = {
  filename: 'purple-grid-2.png',
  rows: 8,
  cols: 8,
  // Format: [row, column, name, variant]
  mapping: [
    [0, 0, 'Friendly'],
    [0, 1, 'Calm'],
    [0, 2, 'Warm'],
    [0, 3, 'Caring'],
    [0, 4, 'Relaxed'],
    [0, 5, 'Gentle'],
    [0, 6, 'Cozy'],
    [0, 7, 'Soothing'],
    [1, 0, 'Friendly', 2],
    [1, 1, 'Calm', 2],
    [1, 2, 'Warm', 2],
    [1, 3, 'FriendHug'],
    [1, 4, 'Relaxed', 2],
    [1, 5, 'Gentle', 2],
    [1, 6, 'Cozy', 2],
    [1, 7, 'Soothing', 2],
    [2, 0, 'Glasses'],
    [2, 1, 'Cute'],
    [2, 2, 'Happy'],
    [2, 3, 'Empathetic'],
    [2, 4, 'Glasses', 2],
    [2, 5, 'Empathetic', 2],
    [2, 6, 'Glasses', 3],
    [2, 7, 'Cute', 2],
    [3, 0, 'Encouraging'],
    [3, 1, 'Playful'],
    [3, 2, 'Friendly', 3],
    [3, 3, 'LoveHug'],
    [3, 4, 'Encouraging', 2],
    [3, 5, 'Reassuring'],
    [3, 6, 'Comforting'],
    [3, 7, 'Playful', 2],
    [4, 0, 'Friendly', 4],
    [4, 1, 'Calm', 3],
    [4, 2, 'Warm', 3],
    [4, 3, 'Caring', 2],
    [4, 4, 'Delighted'],
    [4, 5, 'Gentle', 3],
    [4, 6, 'Cozy', 3],
    [4, 7, 'CuteHug'],
    [5, 0, 'Friendly', 5],
    [5, 1, 'Calm', 4],
    [5, 2, 'Warm', 4],
    [5, 3, 'FriendHug', 2],
    [5, 4, 'Delighted', 2],
    [5, 5, 'Gentle', 4],
    [5, 6, 'Cozy', 4],
    [5, 7, 'Soothing', 3],
    [6, 0, 'Happy', 2],
    [6, 1, 'Peaceful'],
    [6, 2, 'Calm', 5],
    [6, 3, 'Loving'],
    [6, 4, 'Affectionate'],
    [6, 5, 'Caring', 3],
    [6, 6, 'Adorable'],
    [6, 7, 'Happy', 3],
    [7, 0, 'Peaceful', 2],
    [7, 1, 'Soothing', 4],
    [7, 2, 'Calm', 6],
    [7, 3, 'Loving', 2],
    [7, 4, 'Adorable', 2],
    [7, 5, 'Caring', 4],
    [7, 6, 'Calm', 7],
    [7, 7, 'Peaceful', 3]
  ]
};

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true });

// Function to extract and save an icon from a grid
async function extractIcon(gridImage, row, col, iconName, variant, cellWidth, cellHeight) {
  const x = col * cellWidth;
  const y = row * cellHeight;
  
  const variantSuffix = variant ? variant : '';
  const displayName = `${iconName}${variantSuffix ? ` (V${variantSuffix})` : ''}`;
  console.log(`Processing ${displayName} at position [${row},${col}] (${x},${y})`);
  
  const canvas = createCanvas(cellWidth, cellHeight);
  const ctx = canvas.getContext('2d');
  
  // Extract the icon from the grid with a clean background (transparent)
  ctx.clearRect(0, 0, cellWidth, cellHeight);
  ctx.drawImage(gridImage, x, y, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight);
  
  // Generate file name with variant suffix if needed
  const fileName = `${PREFIX}-${iconName}${variantSuffix}.png`;
  
  // Save to both src and public directories
  const outputPath = path.join(OUTPUT_DIR, fileName);
  const publicOutputPath = path.join(PUBLIC_OUTPUT_DIR, fileName);
  
  // Create streams and save the images
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`  Icon saved: ${outputPath}`);
      
      // Copy to public directory
      fs.copyFile(outputPath, publicOutputPath, (err) => {
        if (err) {
          console.error(`  Error copying to public directory: ${err}`);
          reject(err);
        } else {
          console.log(`  Icon copied to public: ${publicOutputPath}`);
          resolve(outputPath);
        }
      });
    });
    
    out.on('error', (err) => {
      console.error(`  Error saving icon: ${err}`);
      reject(err);
    });
  });
}

// Function to create animated versions of an icon
async function createAnimatedFrames(iconPath, iconName, variant) {
  const variantSuffix = variant ? variant : '';
  const displayName = `${iconName}${variantSuffix ? ` (V${variantSuffix})` : ''}`;
  console.log(`Creating animation for ${displayName}...`);
  
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
          ctx.fillStyle = '#e9c8ff'; // Light purple glow
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
          let glowColor = '#dfb7ff'; // Default purple glow
          
          if (iconName.includes('Love') || iconName.includes('Affectionate')) {
            glowColor = '#ffb7b7'; // Pink for love types
          } else if (iconName.includes('Happy') || iconName.includes('Cheerful')) {
            glowColor = '#fffeb7'; // Yellow for happy types
          } else if (iconName.includes('Calm') || iconName.includes('Peaceful')) {
            glowColor = '#b7d4ff'; // Blue for calm types
          } else if (iconName.includes('Friend') || iconName.includes('Family')) {
            glowColor = '#b7ffcb'; // Green for relationship types
          }
          
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = glowColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(icon, 0, 0);
          break;
      }
      
      // Save the frame
      const baseName = `${PREFIX}-${iconName}${variantSuffix}`;
      const frameName = `${baseName}-animated_frame${frame}.png`;
      const framePath = path.join(OUTPUT_DIR, frameName);
      const publicFramePath = path.join(PUBLIC_OUTPUT_DIR, frameName);
      
      // Write to file
      const out = fs.createWriteStream(framePath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      await new Promise((resolve, reject) => {
        out.on('finish', () => {
          console.log(`    Frame ${frame} saved: ${framePath}`);
          
          // Copy to public directory
          fs.copyFile(framePath, publicFramePath, (err) => {
            if (err) {
              console.error(`    Error copying frame to public directory: ${err}`);
              reject(err);
            } else {
              console.log(`    Frame ${frame} copied to public: ${publicFramePath}`);
              resolve();
            }
          });
        });
        
        out.on('error', (err) => {
          console.error(`    Error saving frame: ${err}`);
          reject(err);
        });
      });
    }
    
    console.log(`  Animation complete for ${displayName}`);
  } catch (error) {
    console.error(`  Error processing animation for ${displayName}: ${error.message}`);
  }
}

// Function to process a grid image
async function processGridImage(gridConfig) {
  try {
    const imagePath = path.join(REFERENCE_DIR, gridConfig.filename);
    console.log(`\nProcessing grid image: ${imagePath}`);
    
    // Load the grid image
    const gridImage = await loadImage(imagePath);
    console.log(`Image loaded: ${gridImage.width}x${gridImage.height}`);
    
    // Calculate cell size
    const cellWidth = Math.floor(gridImage.width / gridConfig.cols);
    const cellHeight = Math.floor(gridImage.height / gridConfig.rows);
    console.log(`Cell size: ${cellWidth}x${cellHeight}`);
    
    // Process each icon defined in the mapping
    for (const [row, col, name, variant] of gridConfig.mapping) {
      try {
        // Extract and save the icon
        const iconPath = await extractIcon(gridImage, row, col, name, variant, cellWidth, cellHeight);
        
        // Create animated frames for the icon
        await createAnimatedFrames(iconPath, name, variant);
      } catch (error) {
        console.error(`Error processing icon at [${row},${col}] (${name}): ${error.message}`);
      }
    }
    
    console.log(`Grid processing completed successfully for ${gridConfig.filename}!`);
  } catch (error) {
    console.error(`Error processing grid ${gridConfig.filename}:`, error);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting improved smart icon splitting process...');
    
    // Process both grid images
    await processGridImage(GRID1_CONFIG);
    await processGridImage(GRID2_CONFIG);
    
    console.log('\nAll grids have been processed successfully!');
    
    // Generate icon list for gallery
    const processedIcons = [];
    for (const grid of [GRID1_CONFIG, GRID2_CONFIG]) {
      for (const [row, col, name, variant] of grid.mapping) {
        const variantSuffix = variant ? variant : '';
        processedIcons.push({
          name,
          variant: variantSuffix,
          filename: `${PREFIX}-${name}${variantSuffix}.png`,
          animationPrefix: `${PREFIX}-${name}${variantSuffix}-animated_frame`
        });
      }
    }
    
    // Save the icon list as JSON for easy import
    const iconListPath = path.join(OUTPUT_DIR, 'purple-icons-list.json');
    fs.writeFileSync(iconListPath, JSON.stringify(processedIcons, null, 2));
    console.log(`Icon list saved to ${iconListPath}`);
    
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the script
main();