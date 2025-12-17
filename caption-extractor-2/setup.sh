#!/bin/bash
# Setup script for Python caption extractor

echo "Setting up Python Caption Extractor..."

# Check if Python is installed
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "Error: Python is not installed. Please install Python 3.6 or higher."
    exit 1
fi

echo "Using Python: $PYTHON_CMD"

# Install dependencies
echo "Installing dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt

# Make extract.py executable
chmod +x extract.py

echo "Setup complete!"
echo ""
echo "Test the extractor with:"
echo "  $PYTHON_CMD extract.py <video_id> [language]"
