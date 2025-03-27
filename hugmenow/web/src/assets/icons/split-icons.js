/**
 * Split Icons Script
 * 
 * This script splits the reference grid image into individual hug icons.
 * It processes the hug types visible in the grid: Bear Hug, Supporting, Comforting, 
 * Loving, Celebrating, Festive, Caring, Teasing, Inviting, and Moody.
 */

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

// Execute the split function
splitGridImage()
  .then(count => console.log(`Successfully extracted ${count} icons`))
  .catch(err => console.error('Failed to extract icons:', err));