#!/bin/bash
# FindYourPreSchool - Complete Startup Script
# Run this script from the project root directory

echo "================================================"
echo "FindYourPreSchool - Complete Setup & Startup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm found: $(npm --version)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    print_error "MySQL is not installed"
    exit 1
fi
print_success "MySQL found: $(mysql --version)"

echo ""
echo "================================================"
echo "Step 1: Setting up Backend"
echo "================================================"

# Backend setup
cd server

if [ ! -f ".env" ]; then
    print_info "Creating .env from template..."
    cp .env.example .env
    print_success ".env created - Please edit with your credentials"
    echo ""
    echo "Edit server/.env and set:"
    echo "  - DB_PASSWORD: Your MySQL password"
    echo "  - GOOGLE_MAPS_API_KEY: Your Google Maps API key"
    echo ""
    print_error "Please configure .env before continuing"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_success "Backend dependencies already installed"
fi

cd ..

echo ""
echo "================================================"
echo "Step 2: Setting up Database"
echo "================================================"

print_info "Note: Make sure MySQL is running"
print_info "You may need to enter your MySQL password..."

# Import database schema
if mysql -u root -p < database.sql 2>/dev/null; then
    print_success "Database schema imported"
else
    print_error "Failed to import database schema"
    print_info "Try running manually:"
    echo "  mysql -u root -p < database.sql"
    exit 1
fi

echo ""
echo "================================================"
echo "Step 3: Setting up Frontend"
echo "================================================"

cd client

if [ ! -f "index.html" ]; then
    print_error "index.html not found"
    exit 1
fi

print_info "Updating Google Maps API key in index.html..."
print_info "Make sure to replace YOUR_GOOGLE_MAPS_API_KEY in index.html"

if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_success "Frontend dependencies already installed"
fi

cd ..

echo ""
echo "================================================"
echo "Setup Complete! ✅"
echo "================================================"
echo ""
print_success "Your FindYourPreSchool is ready to run!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd server"
echo "  npm run dev"
echo "  Server will run on: http://localhost:5000"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd client"
echo "  npm run dev"
echo "  Frontend will run on: http://localhost:5173"
echo ""
echo "Then open your browser: http://localhost:5173"
echo ""
echo "================================================"
echo "Need help?"
echo "================================================"
echo "- Read: QUICKSTART.md (5-minute setup)"
echo "- Read: README.md (complete documentation)"
echo "- Test APIs: API_TESTING_GUIDE.md"
echo ""
