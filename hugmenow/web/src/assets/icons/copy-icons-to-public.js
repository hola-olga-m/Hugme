/**
 * Copy Icons to Public Directory
 * 
 * This script ensures that all generated icon files are copied to the public directory
 * for the web server to access them.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  sourceDir: path.join(__dirname, 'png-icons'),
  targetDir: path.join(__dirname, '..', '..', '..', 'public', 'assets', 'icons', 'png-icons'),
};

// Ensure target directory exists
if (!fs.existsSync(config.targetDir)) {
  fs.mkdirSync(config.targetDir, { recursive: true });
  console.log(`Created target directory: ${config.targetDir}`);
}

/**
 * Copy all PNG icon files to public directory
 */
function copyIconsToPublic() {
  try {
    // Get all PNG files from the source directory
    const files = fs.readdirSync(config.sourceDir)
      .filter(file => file.endsWith('.png'))
      .filter(file => file.startsWith('human-')); // Only copy human icons

    // Copy each file to the target directory
    let copyCount = 0;
    for (const file of files) {
      const sourcePath = path.join(config.sourceDir, file);
      const targetPath = path.join(config.targetDir, file);
      
      fs.copyFileSync(sourcePath, targetPath);
      copyCount++;
    }
    
    console.log(`Successfully copied ${copyCount} icon files to public directory!`);
  } catch (error) {
    console.error('Error copying icons to public directory:', error);
  }
}

// Execute the function
copyIconsToPublic();