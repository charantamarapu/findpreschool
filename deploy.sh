#!/bin/bash

# Fast Deployment/Update Script
# Usage: ./deploy.sh
# Run this on the server to update the app after pushing changes to GitHub.

set -e # Exit on error

echo "========================================================"
echo "🚀 Starting Update Deployment"
echo "========================================================"

# 1. Pull latest code
echo "📥 Pulling latest changes from git..."
git pull origin main

# 2. Update Backend
echo "🔄 Updating Backend..."
cd server
npm install --production
# Restart the specific PM2 process
if pm2 describe findpreschool-api > /dev/null; then
    pm2 restart findpreschool-api
else
    echo "⚠️ PM2 process 'findpreschool-api' not found. Starting it..."
    pm2 start server.js --name "findpreschool-api"
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
