/**
 * Copy Reference Images
 * 
 * This script copies the reference human hug icons grid image to the necessary locations.
 * It ensures the image is available for both the icon processing scripts and the web server.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const iconsDir = __dirname;
const publicImagesDir = path.join(__dirname, '..', '..', '..', 'public', 'images');
const distImagesDir = path.join(__dirname, '..', '..', '..', 'dist', 'images');
const sourceImagePath = '/home/runner/workspace/attached_assets/ChatGPT Image Mar 27, 2025, 08_37_11 AM.png';
const referenceImageName = 'reference-human-hugs.png';

// Ensure directories exist
[publicImagesDir, distImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Copy to icons directory
try {
  fs.copyFileSync(sourceImagePath, path.join(iconsDir, referenceImageName));
  console.log(`Copied reference image to Icons directory`);
} catch (err) {
  console.error(`Error copying to Icons directory: ${err.message}`);
}

// Copy to public/images directory
try {
  fs.copyFileSync(sourceImagePath, path.join(publicImagesDir, referenceImageName));
  console.log(`Copied reference image to Public images directory`);
} catch (err) {
  console.error(`Error copying to Public images directory: ${err.message}`);
}

// Copy to dist/images directory
try {
  fs.copyFileSync(sourceImagePath, path.join(distImagesDir, referenceImageName));
  console.log(`Copied reference image to Distribution images directory`);
} catch (err) {
  console.error(`Error copying to Distribution images directory: ${err.message}`);
}

console.log('Reference image copying completed!');