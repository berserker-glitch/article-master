# Caption Extractor 2 (Python Fallback)

This is a Python-based fallback for extracting YouTube captions when the primary JavaScript extractor fails.

## Setup

### Automatic Setup

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. Install Python 3.6 or higher (if not already installed)

2. Install dependencies:
```bash
pip install -r requirements.txt
```

Or using pip3:
```bash
pip3 install -r requirements.txt
```

## Usage

### Standalone

```bash
python extract.py <video_id> [language_code]
```

Example:
```bash
python extract.py dQw4w9WgXcQ en
```

### Via API

The Python extractor is automatically called as a fallback when the primary JavaScript extractor fails. It's accessible via:

```
GET /api/subtitles-python?videoID=<video_id>&lang=<language>
```

## Output

Returns JSON with either:
- Success: `{"subtitles": [...], "language": "en"}`
- Error: `{"error": "...", "video_id": "..."}`

## Dependencies

- `youtube-transcript-api` - Python library for fetching YouTube transcripts

## Notes

- The script runs independently and doesn't require any external services
- It automatically falls back to available languages if the requested language isn't available
- The API route handles spawning the Python process and parsing the output
