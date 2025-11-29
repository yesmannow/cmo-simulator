#!/usr/bin/env node

/**
 * CMO Simulator CLI - Development Tools
 * Provides quick access to common development tasks
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const COMMANDS = {
  dev: {
    description: 'Start the development server',
    command: 'npm run dev'
  },
  build: {
    description: 'Build the application for production',
    command: 'npm run build'
  },
  lint: {
    description: 'Run ESLint to check code quality',
    command: 'npm run lint'
  },
  test: {
    description: 'Run Jest tests',
    command: 'npm run test'
  },
  typecheck: {
    description: 'Run TypeScript type checking',
    command: 'npx tsc --noEmit'
  },
  clean: {
    description: 'Clean build artifacts and node_modules',
    command: 'rm -rf .next node_modules'
  },
  reinstall: {
    description: 'Clean and reinstall dependencies',
    command: 'rm -rf node_modules package-lock.json && npm install'
  },
  setup: {
    description: 'Initial project setup',
    command: 'npm install && npm run build'
  }
};

function showHelp() {
  console.log('\n🎮 CMO Simulator CLI - Development Tools\n');
  console.log('Usage: node scripts/dev-cli.js <command>\n');
  console.log('Available commands:\n');
  
  Object.entries(COMMANDS).forEach(([name, info]) => {
    console.log(`  ${name.padEnd(12)} - ${info.description}`);
  });
  
  console.log('\nExamples:');
  console.log('  node scripts/dev-cli.js dev      # Start development server');
  console.log('  node scripts/dev-cli.js build    # Build for production');
  console.log('  node scripts/dev-cli.js lint     # Check code quality\n');
}

function runCommand(cmd) {
  console.log(`\n🚀 Running: ${cmd}\n`);
  
  try {
    execSync(cmd, { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    console.log('\n✅ Command completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Command failed with error');
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
const commandName = args[0];

if (!commandName || commandName === 'help' || commandName === '--help' || commandName === '-h') {
  showHelp();
  process.exit(0);
}

const command = COMMANDS[commandName];

if (!command) {
  console.error(`\n❌ Unknown command: ${commandName}`);
  showHelp();
  process.exit(1);
}

runCommand(command.command);
