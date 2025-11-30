#!/usr/bin/env node

/**
 * Post-build script to ensure Cloudflare Pages can find the functions
 * OpenNext Cloudflare creates worker.js, but Cloudflare Pages needs functions directory
 * Since build output is .open-next, functions must be at .open-next/functions/
 */

const fs = require('fs');
const path = require('path');

const openNextDir = path.join(process.cwd(), '.open-next');
const functionsDir = path.join(openNextDir, 'functions');

if (!fs.existsSync(openNextDir)) {
  console.error('Error: .open-next directory not found');
  process.exit(1);
}

// Check if worker.js exists
const workerPath = path.join(openNextDir, 'worker.js');
if (fs.existsSync(workerPath)) {
  console.log('✓ Found worker.js');

  // Create functions directory inside .open-next (where Cloudflare Pages expects it)
  // Cloudflare Pages looks for functions relative to the build output directory
  if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true });
    console.log('✓ Created functions directory in .open-next');
  }

  // Copy worker.js to functions/_worker.js (Cloudflare Pages convention)
  const workerDest = path.join(functionsDir, '_worker.js');
  if (!fs.existsSync(workerDest)) {
    fs.copyFileSync(workerPath, workerDest);
    console.log('✓ Copied worker.js to .open-next/functions/_worker.js');
  } else {
    console.log('✓ functions/_worker.js already exists');
  }

  // Create a _routes.json file in .open-next if it doesn't exist
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
  process.exit(1);
}

