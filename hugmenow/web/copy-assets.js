import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the PNG icons directory in dist assets
const sourceDir = path.join(__dirname, 'src', 'assets', 'icons', 'png');
const distDir = path.join(__dirname, 'dist');
const destDir = path.join(distDir, 'assets', 'icons', 'png');

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Ensure the assets directory exists
if (!fs.existsSync(path.join(distDir, 'assets'))) {
  console.log('Creating assets directory...');
  fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
}

// Ensure the icons directory exists
if (!fs.existsSync(path.join(distDir, 'assets', 'icons'))) {
  console.log('Creating icons directory...');
  fs.mkdirSync(path.join(distDir, 'assets', 'icons'), { recursive: true });
}

// Ensure the png directory exists
if (!fs.existsSync(destDir)) {
  console.log('Creating png directory...');
  fs.mkdirSync(destDir, { recursive: true });
}

// Verify source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory ${sourceDir} does not exist!`);
  process.exit(1);
}

// Copy PNG files
try {
  const files = fs.readdirSync(sourceDir);
  if (files.length === 0) {
    console.warn('No PNG files found in source directory!');
  } else {
    let copyCount = 0;
    
    files.forEach(file => {
      if (file.endsWith('.png')) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);
        
        try {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${file} to assets/icons/png/`);
          copyCount++;
        } catch (err) {
          console.error(`Error copying ${file}: ${err.message}`);
        }
      }
    });
    
    console.log(`Copied ${copyCount} PNG assets successfully!`);
  }
} catch (err) {
  console.error(`Error reading source directory: ${err.message}`);
  process.exit(1);
}