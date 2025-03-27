import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the PNG icons directory in dist assets
const sourceDir = path.join(__dirname, 'src', 'assets', 'icons', 'png');
const destDir = path.join(__dirname, 'dist', 'assets', 'icons', 'png');

// Create destination directories if they don't exist
if (!fs.existsSync(path.join(__dirname, 'dist', 'assets'))) {
  fs.mkdirSync(path.join(__dirname, 'dist', 'assets'));
}

if (!fs.existsSync(path.join(__dirname, 'dist', 'assets', 'icons'))) {
  fs.mkdirSync(path.join(__dirname, 'dist', 'assets', 'icons'));
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

// Copy PNG files
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
  if (file.endsWith('.png')) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
    console.log(`Copied ${file} to assets/icons/png/`);
  }
});

console.log('All PNG assets copied successfully!');