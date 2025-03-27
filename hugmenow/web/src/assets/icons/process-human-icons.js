/**
 * Process Human Hug Icons
 * 
 * This script runs the complete process of generating human hug icons:
 * 1. Split the reference grid image into individual icons
 * 2. Create animated versions of each icon
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the scripts
const splitIconsScript = path.join(__dirname, 'split-human-icons.js');
const createAnimatedIconsScript = path.join(__dirname, 'create-animated-human-icons.js');

console.log('Starting human hug icons processing...');

// Run split-human-icons.js first
console.log('Step 1: Splitting reference grid into individual icons...');
exec(`node --experimental-modules ${splitIconsScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error splitting icons: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('Icon splitting completed.');
  
  // Then run create-animated-human-icons.js
  console.log('Step 2: Creating animated versions of the icons...');
  exec(`node --experimental-modules ${createAnimatedIconsScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating animated icons: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('Icon animation completed.');
    console.log('Human hug icons processing completed successfully!');
  });
});