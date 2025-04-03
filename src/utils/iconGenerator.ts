
// This is a utility file that can be used to generate icons from the source image.
// You can use this in a Node.js environment to generate icons.

import fs from 'fs';
import path from 'path';

// Define sizes for the icons as defined in manifest.json
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * This function needs to be run in a Node.js environment with the canvas package installed.
 * It cannot be run directly in the browser.
 * 
 * Usage:
 * 1. Install canvas: npm install canvas
 * 2. Run this file with Node.js
 */
async function generateIcons() {
  try {
    // Dynamic import to prevent browser errors
    const { createCanvas, loadImage } = await import('canvas');
    
    const sourceImagePath = path.resolve(__dirname, '../../public/lovable-uploads/e2d773ba-0e09-4901-8a3a-68e17dce87ab.png');
    const outputDir = path.resolve(__dirname, '../../public/icons');
    
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const sourceImage = await loadImage(sourceImagePath);
    
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw image to fit the canvas
      ctx.drawImage(sourceImage, 0, 0, size, size);
      
      // Save as PNG
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      console.log(`Generated icon at ${outputPath}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    console.error('Note: This script must be run in a Node.js environment with the canvas package installed.');
    console.error('It cannot be run directly in the browser.');
  }
}

// Only run if called directly with Node.js
if (typeof window === 'undefined' && require.main === module) {
  generateIcons();
}

export { generateIcons };
