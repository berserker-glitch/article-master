#!/bin/bash
# Install Python dependencies for caption extractor
# This script is run during the build process in Coolify

set -e

echo "Installing Python dependencies for caption extractor..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PIP_CMD="pip"
else
    echo "Error: Python is not installed"
    exit 1
fi

echo "Using Python: $PYTHON_CMD"

# Install dependencies
$PIP_CMD install --upgrade pip
$PIP_CMD install -r caption-extractor-2/requirements.txt

echo "Python dependencies installed successfully!"
