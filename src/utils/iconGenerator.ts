
// This is a utility file that can be used to generate icons from the source image.
// You can use this as a template if you want to programmatically generate icons.

import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

// Sizes for the icons as defined in manifest.json
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const sourceImagePath = path.resolve(__dirname, '../../public/lovable-uploads/69cf283f-1aa4-4154-ac5a-c6954cf0aaf1.png');
  const outputDir = path.resolve(__dirname, '../../public/icons');
  
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
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
  }
}

// This function can be called directly or imported and used elsewhere
if (require.main === module) {
  generateIcons();
}

export { generateIcons };
