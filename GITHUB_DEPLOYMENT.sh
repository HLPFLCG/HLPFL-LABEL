#!/bin/bash

# HLPFL Records - Premium Investor Website GitHub Deployment Script
# This script automates the deployment process to GitHub Pages

echo "🚀 Starting HLPFL Records Website Deployment..."

# Configuration
REPO_URL="https://github.com/HLPFLCG/HLPFL-LABEL.git"
BRANCH_NAME="premium-investor-website"
TEMP_DIR="/tmp/hlpfl-deploy-$(date +%s)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_error "Curl is not installed. Please install Curl first."
        exit 1
    fi
    
    print_success "All dependencies are installed."
}

# Clone or pull repository
setup_repository() {
    print_status "Setting up repository..."
    
    # Create temporary directory
    mkdir -p "$TEMP_DIR"
    cd "$TEMP_DIR"
    
    # Clone repository
    if git clone "$REPO_URL" .; then
        print_success "Repository cloned successfully."
    else
        print_error "Failed to clone repository. Please check your credentials and repository URL."
        exit 1
    fi
    
    # Create and switch to new branch
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
    print_success "Switched to branch: $BRANCH_NAME"
}

# Copy website files
copy_files() {
    print_status "Copying website files..."
    
    # Get current script directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # Copy all files except the deployment script itself
    cp -r "$SCRIPT_DIR"/* . 2>/dev/null || {
        print_error "Failed to copy files. Make sure you're running this script from the website directory."
        exit 1
    }
    
    # Remove deployment script from target
    rm -f GITHUB_DEPLOYMENT.sh
    
    print_success "Files copied successfully."
}

# Download required JavaScript libraries
download_libraries() {
    print_status "Downloading JavaScript libraries..."
    
    # Create js directory if it doesn't exist
    mkdir -p js
    
    # Download AOS
    if curl -o js/aos.js https://unpkg.com/aos@2.3.4/dist/aos.js; then
        print_success "AOS library downloaded."
    else
        print_error "Failed to download AOS library."
        exit 1
    fi
    
    # Download Chart.js
    if curl -o js/chart.min.js https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js; then
        print_success "Chart.js library downloaded."
    else
        print_error "Failed to download Chart.js library."
        exit 1
    fi
    
    print_success "All libraries downloaded successfully."
}

# Commit and push changes
push_to_github() {
    print_status "Committing and pushing changes..."
    
    # Add all files
    git add .
    
    # Commit changes
    if git commit -m "Add premium investor website - $(date)"; then
        print_success "Changes committed successfully."
    else
        print_warning "No changes to commit or commit failed."
    fi
    
    # Push to GitHub
    if git push -u origin "$BRANCH_NAME"; then
        print_success "Changes pushed to GitHub successfully."
    else
        print_error "Failed to push to GitHub. Please check your authentication."
        exit 1
    fi
}

# Provide GitHub Pages setup instructions
setup_github_pages() {
    print_status "Setting up GitHub Pages..."
    
    echo ""
    print_success "🎉 Website deployed to GitHub!"
    echo ""
    echo -e "${YELLOW}Next steps to enable GitHub Pages:${NC}"
    echo "1. Go to: https://github.com/HLPFLCG/HLPFL-LABEL/settings/pages"
    echo "2. Under 'Build and deployment', select 'Deploy from a branch'"
    echo "3. Choose branch: $BRANCH_NAME"
    echo "4. Choose folder: / (root)"
    echo "5. Click 'Save'"
    echo ""
    echo -e "${GREEN}Your website will be available at:${NC}"
    echo "https://hlpflcg.github.io/HLPFL-LABEL/"
    echo ""
    echo -e "${BLUE}It may take a few minutes for the site to be available.${NC}"
}

# Cleanup
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
    print_success "Cleanup completed."
}

# Main deployment function
main() {
    echo ""
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  HLPFL Records - Premium Investor Website${NC}"
    echo -e "${BLUE}  GitHub Deployment Script${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    
    check_dependencies
    setup_repository
    copy_files
    download_libraries
    push_to_github
    setup_github_pages
    cleanup
    
    echo ""
    print_success "🚀 Deployment completed successfully!"
    echo ""
    echo -e "${YELLOW}Remember to:${NC}"
    echo "1. Enable GitHub Pages in repository settings"
    echo "2. Test the website once deployed"
    echo "3. Set up custom domain if needed"
    echo "4. Configure analytics and tracking"
    echo ""
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main "$@"