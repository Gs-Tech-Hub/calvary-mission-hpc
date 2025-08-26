const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [
  72, 96, 128, 144, 152, 192, 384, 512
];

const sourceLogo = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if source logo exists
    if (!fs.existsSync(sourceLogo)) {
      console.log('Source logo not found. Creating placeholder icons...');
      await createPlaceholderIcons();
      return;
    }

    console.log('Generating PWA icons from logo...');

    // Generate icons for each size
    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceLogo)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: icon-${size}x${size}.png`);
    }

    // Generate additional icons for specific features
    await generateFeatureIcons();
    
    console.log('PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    // Fallback to placeholder icons
    await createPlaceholderIcons();
  }
}

async function createPlaceholderIcons() {
  console.log('Creating placeholder icons...');
  
  const placeholderSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#1f2937"/>
      <circle cx="256" cy="256" r="120" fill="#ffffff"/>
      <text x="256" y="280" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="80" font-weight="bold">C</text>
    </svg>
  `;

  for (const size of iconSizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(placeholderSvg))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated placeholder: icon-${size}x${size}.png`);
  }

  // Generate feature-specific icons
  await generateFeatureIcons();
}

async function generateFeatureIcons() {
  const features = [
    { name: 'live', color: '#ef4444', symbol: '▶' },
    { name: 'sermons', color: '#3b82f6', symbol: '📖' },
    { name: 'give', color: '#10b981', symbol: '💝' }
  ];

  for (const feature of features) {
    const svg = `
      <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <rect width="96" height="96" fill="${feature.color}" rx="16"/>
        <text x="48" y="60" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="32">${feature.symbol}</text>
      </svg>
    `;

    const outputPath = path.join(outputDir, `${feature.name}-96x96.png`);
    
    await sharp(Buffer.from(svg))
      .resize(96, 96)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated feature icon: ${feature.name}-96x96.png`);
  }
}

// Run the icon generation
generateIcons().catch(console.error);
