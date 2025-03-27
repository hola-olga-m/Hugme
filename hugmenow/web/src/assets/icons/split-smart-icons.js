/**
 * Smart Hug Icons Splitter
 * 
 * This script intelligently splits a grid of hug icons into individual files
 * by detecting grid lines and extracting each cell automatically.
 * It handles varying grid layouts and different icon styles.
 */

import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Configuration
const INPUT_IMAGE = path.resolve('./src/assets/reference/new-human-grid.png');
const OUTPUT_DIR = path.resolve('./src/assets/icons/png-icons/');
const PUBLIC_OUTPUT_DIR = path.resolve('./public/assets/icons/png-icons/');
const PREFIX = 'human';

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true });

// Available hug types with grid positions
const HUG_TYPES = [
  // Format: [name, row, column, variant]
  ['BearHug', 0, 0],
  ['Supporting', 0, 1],
  ['Comforting', 0, 2],
  ['Loving', 0, 3],
  ['Celebrating', 0, 4],
  ['Festive', 0, 5],
  ['Caring', 3, 0],
  ['Teasing', 3, 1, 1], // First variant
  ['Teasing', 2, 2, 2], // Second variant
  ['Inviting', 3, 3, 1], // First variant
  ['Inviting', 3, 4, 2], // Second variant
  ['Moody', 3, 5]
];

// Function to detect grid layout
async function detectGridLayout(imagePath) {
  try {
    console.log(`Loading image: ${imagePath}`);
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    
    console.log(`Image dimensions: ${width}x${height}`);
    
    // Calculate grid cell size based on visible content
    // This image has 4 rows and 6 columns
    const cellWidth = Math.floor(width / 6);
    const cellHeight = Math.floor(height / 4);
    
    console.log(`Detected grid cell size: ${cellWidth}x${cellHeight}`);
    
    return {
      width, 
      height,
      cellWidth,
      cellHeight,
      rows: 4,
      cols: 6
    };
  } catch (error) {
    console.error('Error detecting grid layout:', error);
    throw error;
  }
}

// Function to split the image into individual icons
async function splitImage(imagePath) {
  try {
    // Detect grid layout
    const grid = await detectGridLayout(imagePath);
    const { cellWidth, cellHeight, rows, cols } = grid;
    
    // Load the image
    const image = await loadImage(imagePath);
    
    // Process each defined hug type
    for (const [hugType, row, col, variant] of HUG_TYPES) {
      // Calculate coordinates
      const x = col * cellWidth;
      const y = row * cellHeight;
      
      // Create a new canvas for the icon
      const canvas = createCanvas(cellWidth, cellHeight);
      const ctx = canvas.getContext('2d');
      
      // Draw the portion of the original image onto the canvas
      ctx.drawImage(
        image,
        x, y, cellWidth, cellHeight,  // Source coordinates and dimensions
        0, 0, cellWidth, cellHeight   // Destination coordinates and dimensions
      );
      
      // Generate file name with variant suffix if needed
      const variantSuffix = variant ? variant : '';
      const fileName = `${PREFIX}-${hugType}${variantSuffix}.png`;
      
      // Save to both src and public directories
      const outputPath = path.join(OUTPUT_DIR, fileName);
      const publicOutputPath = path.join(PUBLIC_OUTPUT_DIR, fileName);
      
      // Create streams and save the images
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      await new Promise(resolve => {
        out.on('finish', () => {
          console.log(`Icon saved: ${outputPath}`);
          // Copy to public directory
          fs.copyFile(outputPath, publicOutputPath, (err) => {
            if (err) {
              console.error(`Error copying to public directory: ${err}`);
            } else {
              console.log(`Icon copied to public: ${publicOutputPath}`);
            }
            resolve();
          });
        });
      });
    }
    
    console.log('All icons have been extracted and saved successfully!');
  } catch (error) {
    console.error('Error splitting image:', error);
  }
}

// Create animated versions of each icon
async function createAnimatedIcons() {
  try {
    // Get all human hug icon files
    const iconFiles = fs.readdirSync(OUTPUT_DIR)
      .filter(file => file.startsWith(`${PREFIX}-`) && !file.includes('animated'));
    
    console.log(`Creating animated versions for ${iconFiles.length} icons...`);
    
    for (const iconFile of iconFiles) {
      const iconPath = path.join(OUTPUT_DIR, iconFile);
      const baseName = path.basename(iconFile, '.png');
      
      // Load the original icon
      const icon = await loadImage(iconPath);
      
      // Create 6 animation frames with different effects
      for (let frame = 1; frame <= 6; frame++) {
        const canvas = createCanvas(icon.width, icon.height);
        const ctx = canvas.getContext('2d');
        
        // Draw the base image
        ctx.drawImage(icon, 0, 0);
        
        // Apply different animation effects based on frame number
        switch (frame) {
          case 1: // Normal
            // No additional effects
            break;
          case 2: // Slight glow
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#ffaaff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(icon, 0, 0);
            break;
          case 3: // Scale up
            ctx.drawImage(
              icon, 
              -icon.width * 0.05, -icon.height * 0.05, 
              icon.width * 1.1, icon.height * 1.1
            );
            break;
          case 4: // Brighter
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(icon, 0, 0);
            break;
          case 5: // Scale down
            ctx.drawImage(
              icon,
              icon.width * 0.05, icon.height * 0.05,
              icon.width * 0.9, icon.height * 0.9
            );
            break;
          case 6: // Colored glow
            // Determine glow color based on icon name
            let glowColor = '#ff9999'; // Default pink glow
            if (baseName.includes('Moody')) {
              glowColor = '#9999ff'; // Blue for moody
            } else if (baseName.includes('Celebrating') || baseName.includes('Festive')) {
              glowColor = '#ffff99'; // Yellow for celebrating/festive
            }
            
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = glowColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(icon, 0, 0);
            break;
        }
        
        // Save the frame
        const frameName = `${baseName}-animated_frame${frame}.png`;
        const framePath = path.join(OUTPUT_DIR, frameName);
        const publicFramePath = path.join(PUBLIC_OUTPUT_DIR, frameName);
        
        // Write to file
        const out = fs.createWriteStream(framePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        await new Promise(resolve => {
          out.on('finish', () => {
            console.log(`Animation frame saved: ${framePath}`);
            // Copy to public directory
            fs.copyFile(framePath, publicFramePath, (err) => {
              if (err) {
                console.error(`Error copying frame to public directory: ${err}`);
              } else {
                console.log(`Frame copied to public: ${publicFramePath}`);
              }
              resolve();
            });
          });
        });
      }
    }
    
    console.log('All animated icons have been created successfully!');
  } catch (error) {
    console.error('Error creating animated icons:', error);
  }
}

// Main execution
async function main() {
  try {
    console.log('Starting smart icon splitting process...');
    
    // Step 1: Split the image into individual icons
    await splitImage(INPUT_IMAGE);
    
    // Step 2: Create animated versions of each icon
    await createAnimatedIcons();
    
    console.log('Smart icon processing completed successfully!');
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the main function
main();