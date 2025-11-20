#!/bin/bash

# Deployment script for GitHub Pages
# Deploys both slides and Angular app

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build slides
echo -e "${BLUE}📊 Building slides...${NC}"
npm ci
npm run build

if [ ! -d "dist/vibing-the-future-with-angular" ]; then
    echo -e "${RED}❌ Slides build failed - dist/vibing-the-future-with-angular not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Slides built successfully${NC}"

# Build Angular app
echo -e "${BLUE}📱 Building Angular app...${NC}"
cd angular-webllm-app
npm ci
npm run build -- --base-href /vibing-the-future-with-angular/app/

if [ ! -d "dist/angular-webllm-app/browser" ]; then
    echo -e "${RED}❌ Angular app build failed - dist/angular-webllm-app/browser not found${NC}"
    exit 1
fi

cd ..
echo -e "${GREEN}✅ Angular app built successfully${NC}"

# Prepare deployment directory
echo -e "${BLUE}📦 Preparing deployment directory...${NC}"
rm -rf deploy
mkdir -p deploy

# Copy slides to root
cp -r dist/vibing-the-future-with-angular/* deploy/

# Copy Angular app to /app subdirectory
mkdir -p deploy/app
cp -r angular-webllm-app/dist/angular-webllm-app/browser/* deploy/app/

echo -e "${GREEN}✅ Deployment directory prepared${NC}"

# Deploy to GitHub Pages using gh-pages
echo -e "${BLUE}🌐 Deploying to GitHub Pages...${NC}"

# Use gh-pages package to deploy
npx gh-pages -d deploy -b gh-pages -m "Deploy slides and app"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🎉 Your site should be available at: https://ahsanayaz.github.io/vibing-the-future-with-angular/${NC}"
echo -e "${GREEN}📊 Slides: https://ahsanayaz.github.io/vibing-the-future-with-angular/${NC}"
echo -e "${GREEN}📱 App: https://ahsanayaz.github.io/vibing-the-future-with-angular/app/${NC}"
