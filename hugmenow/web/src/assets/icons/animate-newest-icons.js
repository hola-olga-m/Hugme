/**
 * Animate Newest Human Hug Icons
 * 
 * This script creates animated versions of only the newest icons that were 
 * extracted by the simple-split.js script from the newest reference grid.
 */

import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Configuration
const INPUT_DIR = path.resolve('./src/assets/icons/png-icons/');
const OUTPUT_DIR = path.resolve('./src/assets/icons/png-icons/');
const PUBLIC_OUTPUT_DIR = path.resolve('./public/assets/icons/png-icons/');
const PREFIX = 'human';
const FRAMES = 6; // Number of animation frames to create for each icon

// Specific hug types from the newest reference grid
const NEWEST_HUG_TYPES = [
  'BearHug',
  'Supporting',
  'Comforting',
  'Loving',
  'Celebrating',
  'Festive',
  'Caring',
  'Teasing1',
  'Teasing2',
  'Inviting1',
  'Inviting2',
  'Moody'
];

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true });

// Main function to create animated versions of only the newest icons
async function main() {
  try {
    console.log('Starting animation creation for newest icons...');
    
    // Process each icon type from our focused list
    for (const hugType of NEWEST_HUG_TYPES) {
      const iconFile = `${PREFIX}-${hugType}.png`;
      const iconPath = path.join(INPUT_DIR, iconFile);
      
      // Check if icon exists before processing
      if (!fs.existsSync(iconPath)) {
        console.log(`Icon file ${iconFile} does not exist, skipping.`);
        continue;
      }
      
      console.log(`Creating animation for ${iconFile}...`);
      const baseName = path.basename(iconFile, '.png');
      
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
              
              if (baseName.includes('Moody')) {
                glowColor = '#bbbbff'; // Blue for moody
              } else if (baseName.includes('Celebrating') || baseName.includes('Festive')) {
                glowColor = '#ffffbb'; // Yellow for celebration
              } else if (baseName.includes('Caring')) {
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
          const frameName = `${baseName}-animated_frame${frame}.png`;
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
        
        console.log(`Animation complete for ${iconFile}`);
      } catch (error) {
        console.error(`Error processing ${iconFile}: ${error.message}`);
      }
    }
    
    console.log('Animation creation process for newest icons completed!');
  } catch (error) {
    console.error('Error in animation process:', error);
  }
}

// Run the script
main();