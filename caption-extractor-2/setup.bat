@echo off
REM Setup script for Python caption extractor (Windows)

echo Setting up Python Caption Extractor...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.6 or higher.
    exit /b 1
)

echo Using Python: python

REM Install dependencies
echo Installing dependencies...
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo Error: Failed to install dependencies.
    exit /b 1
)

echo Setup complete!
echo.
echo Test the extractor with:
echo   python extract.py ^<video_id^> [language]
