/**
 * Run Smart Icon Splitter
 * 
 * This script is a simple entry point to run the smart icon splitter directly,
 * which will automatically process the attached grid image.
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the process-all-icons.js script
const processAllIconsScript = path.join(__dirname, 'process-all-icons.js');

console.log('Running smart icon splitter...');

// Execute the process-all-icons.js script with the --smart flag
exec(`node --experimental-modules ${processAllIconsScript} --smart`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running smart icon splitter: ${error.message}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('Smart icon splitting process completed!');
});