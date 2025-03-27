/**
 * Simple Split for Human Hug Icons
 * 
 * This script is a simplified version that just extracts each icon from the grid
 * without creating animations.
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

// Main function
async function main() {
  try {
    console.log('Starting simple icon splitting process...');
    
    // Load the image
    console.log(`Loading image: ${INPUT_IMAGE}`);
    const image = await loadImage(INPUT_IMAGE);
    console.log(`Image loaded: ${image.width}x${image.height}`);
    
    // Calculate cell size based on grid dimensions
    const cellWidth = Math.floor(image.width / 6);
    const cellHeight = Math.floor(image.height / 4);
    console.log(`Cell size: ${cellWidth}x${cellHeight}`);
    
    // Process each defined hug type
    for (const [hugType, row, col, variant] of HUG_TYPES) {
      // Calculate coordinates
      const x = col * cellWidth;
      const y = row * cellHeight;
      
      console.log(`Processing ${hugType} at position [${row},${col}] (${x},${y})`);
      
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
    console.error('Error in icon splitting process:', error);
  }
}

// Run the script
main();