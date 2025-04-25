#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env.local exists and create it if not
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
  console.log('Creating .env.local from .env.example...');
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('.env.local created successfully.');
}

// Get the repository URL from git
const getRepoUrl = () => {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
    // Convert SSH URL to HTTPS URL if needed
    if (remoteUrl.startsWith('git@')) {
      return remoteUrl
        .replace('git@github.com:', 'https://github.com/')
        .replace('.git', '');
    }
    return remoteUrl;
  } catch (error) {
    console.error('Error getting repository URL:', error);
    process.exit(1);
  }
};

// Build the application
const build = () => {
  console.log('Building the application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

// Deploy to GitHub Pages
const deploy = () => {
  console.log('Deploying to GitHub Pages...');
  try {
    // Set the homepage in package.json
    const repoUrl = getRepoUrl();
    const homepage = `${repoUrl}/tree/main`;
    console.log(`Setting homepage to: ${homepage}`);
    
    // Deploy using gh-pages
    execSync('npm run deploy:github', { stdio: 'inherit' });
    console.log('Deployment completed successfully!');
    console.log(`Your site should be live at: ${repoUrl.replace('github.com', 'github.io')}`);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};

// Main function
const main = () => {
  console.log('Starting deployment process...');
  build();
  deploy();
  console.log('Deployment process completed!');
};

main(); 