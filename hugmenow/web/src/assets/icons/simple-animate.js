/**
 * Simple Animator for Human Hug Icons
 * 
 * This script creates animated versions of the icons that were extracted
 * by the simple-split.js script.
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

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true });

// Main function to create animated versions of all icons
async function main() {
  try {
    console.log('Starting animation creation process...');
    
    // Get all human hug icon files
    const iconFiles = fs.readdirSync(INPUT_DIR)
      .filter(file => file.startsWith(`${PREFIX}-`) && !file.includes('animated') && !file.includes('frame'));
    
    console.log(`Found ${iconFiles.length} icons to animate`);
    
    // Process each icon
    for (const iconFile of iconFiles) {
      console.log(`Creating animation for ${iconFile}...`);
      const iconPath = path.join(INPUT_DIR, iconFile);
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
    
    console.log('Animation creation process completed!');
  } catch (error) {
    console.error('Error in animation process:', error);
  }
}

// Run the script
main();