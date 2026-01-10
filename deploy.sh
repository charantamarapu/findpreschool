#!/bin/bash

# Fast Deployment/Update Script
# Usage: ./deploy.sh
# Run this on the server to update the app after pushing changes to GitHub.

set -e # Exit on error

echo "========================================================"
echo "🚀 Starting Update Deployment"
echo "========================================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo ./deploy.sh)"
  exit 1
fi

# 1. Pull latest code
echo "📥 Pulling latest changes from git..."
git pull origin main

# 2. Update Backend
echo "🔄 Updating Backend..."
cd server
npm install --production
# Restart the specific PM2 process
if pm2 describe findyourpreschool-api > /dev/null; then
    pm2 restart findyourpreschool-api
else
    echo "⚠️ PM2 process 'findyourpreschool-api' not found. Starting it..."
    pm2 start server.js --name "findyourpreschool-api"
fi
cd ..

# 3. Update Frontend
echo "🏗️ Building Frontend..."
cd client
npm install
npm run build
cd ..

echo "========================================================"
echo "✅ Update Complete! Services restarted."
echo "========================================================"
