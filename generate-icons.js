const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Function to generate an icon
function generateIcon(size, color, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw colored square
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  
  // Save to file
  const out = fs.createWriteStream(path.join(iconsDir, filename));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Generated ${filename}`));
}

// Generate required icons
generateIcon(16, 'blue', 'icon16.png');
generateIcon(48, 'green', 'icon48.png');
generateIcon(128, 'red', 'icon128.png');
