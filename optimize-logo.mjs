import sharp from 'sharp';
import { readFileSync } from 'fs';

const input = 'public/images/logo-icon.png';
const buffer = readFileSync(input);

// Resize to max 200px width and convert to WebP
await sharp(buffer)
  .resize({ width: 200, height: 200, fit: 'inside' })
  .webp({ quality: 85 })
  .toFile('public/images/logo-icon.webp');

// Also keep a small PNG for favicon compatibility
await sharp(buffer)
  .resize({ width: 200, height: 200, fit: 'inside' })
  .png({ compressionLevel: 9 })
  .toFile('public/images/logo-icon-opt.png');

console.log('Done. Check public/images/ for new files.');
