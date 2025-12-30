#!/bin/bash

# GreenPlate Frontend Setup Script
# This script automates the installation process

echo "🌱 GreenPlate Frontend Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
echo "📋 Checking Prerequisites..."
echo ""

if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"
    
    # Check if version is >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${YELLOW}⚠${NC}  Warning: Node.js version 18 or higher is recommended"
        echo "   Current version: $NODE_VERSION"
        echo "   Please consider upgrading from https://nodejs.org/"
    fi
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo "   Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm is installed: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm is not installed"
    echo "   npm should come with Node.js. Please reinstall Node.js"
    exit 1
fi

echo ""
echo "📦 Installing Dependencies..."
echo ""

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓${NC} Dependencies installed successfully!"
else
    echo ""
    echo -e "${RED}✗${NC} Failed to install dependencies"
    echo "   Try running: npm cache clean --force && npm install"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Google Gemini API Key (optional)
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_API_KEY=your_google_api_key_here

# Backend API URL (if applicable)
VITE_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✓${NC} .env file created"
    echo "   Remember to add your Google API key if using AI features"
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo ""
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
package-lock.json

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
EOF
    echo -e "${GREEN}✓${NC} .gitignore file created"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "=============================="
echo "🚀 Next Steps:"
echo "=============================="
echo ""
echo "1. Start the development server:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. Open your browser to:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "3. (Optional) Add your Google API key to .env file"
echo ""
echo "4. Start coding! Edit files in Pages/ and Layouts/"
echo ""
echo "📚 Available commands:"
echo "   npm run dev       - Start development server"
echo "   npm run build     - Build for production"
echo "   npm run preview   - Preview production build"
echo "   npm run lint      - Check code quality"
echo "   npm run type-check - Run TypeScript checks"
echo ""
echo "For more details, see INSTALLATION.md"
echo ""
