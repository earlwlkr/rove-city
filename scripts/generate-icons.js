#!/usr/bin/env node
// Run: node scripts/generate-icons.js
// Requires: npm install -D sharp
// Generates PNG icons from public/icons/favicon.svg
// Place generated files in public/icons/

const fs = require('fs');
const path = require('path');

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('sharp not installed. Run: npm install -D sharp');
    process.exit(1);
  }

  const svgPath = path.join(__dirname, '../public/icons/favicon.svg');
  const svgBuffer = fs.readFileSync(svgPath);
  const targets = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
  ];

  for (const { size, name } of targets) {
    const outPath = path.join(__dirname, `../public/icons/${name}`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
    console.log(`Generated ${outPath}`);
  }
}

main().catch(console.error);
