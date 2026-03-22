#!/usr/bin/env node
// Run: node scripts/generate-icons.js
// Requires: npm install -D sharp
// Generates PNG icons from public/icons/icon.svg
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

  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  for (const size of [192, 512]) {
    const outPath = path.join(__dirname, `../public/icons/icon-${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
    console.log(`Generated ${outPath}`);
  }
}

main().catch(console.error);
