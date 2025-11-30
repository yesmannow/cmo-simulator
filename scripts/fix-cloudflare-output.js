#!/usr/bin/env node

/**
 * Post-build script to ensure Cloudflare Pages can find the functions
 * OpenNext Cloudflare creates worker.js, but we need to ensure functions directory exists
 */

const fs = require('fs');
const path = require('path');

const openNextDir = path.join(process.cwd(), '.open-next');

if (!fs.existsSync(openNextDir)) {
  console.error('Error: .open-next directory not found');
  process.exit(1);
}

// Check if worker.js exists
const workerPath = path.join(openNextDir, 'worker.js');
if (fs.existsSync(workerPath)) {
  console.log('✓ Found worker.js');

  // Create functions directory if it doesn't exist
  const functionsDir = path.join(openNextDir, 'functions');
  if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true });
    console.log('✓ Created functions directory');
  }

  // Create a _routes.json file if it doesn't exist
  const routesPath = path.join(openNextDir, '_routes.json');
  if (!fs.existsSync(routesPath)) {
    const routesConfig = {
      version: 1,
      include: ['/*'],
      exclude: ['/static/*', '/_next/static/*', '/_next/image*', '/favicon.ico']
    };
    fs.writeFileSync(routesPath, JSON.stringify(routesConfig, null, 2));
    console.log('✓ Created _routes.json');
  }

  console.log('✓ Cloudflare Pages output structure ready');
} else {
  console.warn('Warning: worker.js not found in .open-next directory');
}

