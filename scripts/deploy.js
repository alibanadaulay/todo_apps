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

// Function to deploy to Vercel
const deployToVercel = () => {
  console.log('Deploying to Vercel...');
  try {
    execSync('npx vercel --prod', { stdio: 'inherit' });
    console.log('Deployment to Vercel completed successfully!');
  } catch (error) {
    console.error('Deployment to Vercel failed:', error.message);
  }
};

// Function to deploy to Netlify
const deployToNetlify = () => {
  console.log('Deploying to Netlify...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    execSync('npx netlify deploy --prod', { stdio: 'inherit' });
    console.log('Deployment to Netlify completed successfully!');
  } catch (error) {
    console.error('Deployment to Netlify failed:', error.message);
  }
};

// Function to deploy to GitHub Pages
const deployToGitHubPages = () => {
  console.log('Deploying to GitHub Pages...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    execSync('npx gh-pages -d out', { stdio: 'inherit' });
    console.log('Deployment to GitHub Pages completed successfully!');
  } catch (error) {
    console.error('Deployment to GitHub Pages failed:', error.message);
  }
};

// Main function
const main = async () => {
  console.log('Todo App Deployment Script');
  console.log('=========================');
  console.log('1. Deploy to Vercel');
  console.log('2. Deploy to Netlify');
  console.log('3. Deploy to GitHub Pages');
  console.log('4. Exit');
  
  rl.question('Select deployment option (1-4): ', (answer) => {
    switch (answer) {
      case '1':
        deployToVercel();
        break;
      case '2':
        deployToNetlify();
        break;
      case '3':
        deployToGitHubPages();
        break;
      case '4':
        console.log('Exiting...');
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
    rl.close();
  });
};

main(); 