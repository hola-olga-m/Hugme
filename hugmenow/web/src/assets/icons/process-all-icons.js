/**
 * Process All Hug Icons
 * 
 * This script runs the complete process of generating all hug icons:
 * 1. Split the human reference grid image into individual icons
 * 2. Split the animal reference grid image into individual icons
 * 3. Create animated versions of each icon
 * 4. Copy all icons to the public directory for web access
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the scripts
const splitHumanIconsScript = path.join(__dirname, 'split-human-icons.js');
const splitAnimalIconsScript = path.join(__dirname, 'split-animal-icons.js');
const createAnimatedHumanIconsScript = path.join(__dirname, 'create-animated-human-icons.js');
const copyIconsToPublicScript = path.join(__dirname, 'copy-icons-to-public.js');

console.log('Starting all hug icons processing...');

// Run split-human-icons.js first
console.log('Step 1: Splitting human reference grid into individual icons...');
exec(`node --experimental-modules ${splitHumanIconsScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error splitting human icons: ${error.message}`);
    // Continue to next step even if there's an error
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  console.log(stdout || 'Human icon splitting completed (no output).');
  
  // Then run split-animal-icons.js
  console.log('Step 2: Splitting animal reference grid into individual icons...');
  exec(`node --experimental-modules ${splitAnimalIconsScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error splitting animal icons: ${error.message}`);
      // Continue to next step even if there's an error
    }
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    
    console.log(stdout || 'Animal icon splitting completed (no output).');
    
    // Run create-animated-human-icons.js
    console.log('Step 3: Creating animated versions of the human icons...');
    exec(`node --experimental-modules ${createAnimatedHumanIconsScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating animated icons: ${error.message}`);
        // Continue to the next step even if there's an error
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      console.log(stdout || 'Icon animation completed (no output).');
      
      // Finally, copy all icons to the public directory
      console.log('Step 4: Copying all icons to the public directory...');
      exec(`node --experimental-modules ${copyIconsToPublicScript}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error copying icons to public: ${error.message}`);
          return;
        }
        
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        
        console.log(stdout || 'Icon copying completed (no output).');
        console.log('All hug icons processing completed successfully!');
      });
    });
  });
});