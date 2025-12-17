# Coolify Deployment Setup

This guide explains how to set up the Python caption extractor in Coolify.

## Automatic Setup (Recommended)

The project is configured to automatically install Python dependencies during the build process using:

1. **nixpacks.toml** - Configures Nixpacks to install Python 3 and pip
2. **package.json prebuild script** - Runs a Node.js script to install Python dependencies
3. **Dockerfile** (optional) - Alternative Docker-based build

## How It Works

### During Build:

1. **Nixpacks detects** the `nixpacks.toml` file
2. **Installs Python 3** and pip via Nix packages
3. **Runs install phase** which:
   - Installs Node.js dependencies with `bun install`
   - Installs Python dependencies with `pip3 install -r caption-extractor-2/requirements.txt`
4. **Builds the Next.js app** with `bun run build`

### At Runtime:

- The Python script is available at `caption-extractor-2/extract.py`
- The API route `/api/subtitles-python` spawns a Python process to run the extractor
- If Python is not available, the app will continue to work but the Python fallback won't function

## Manual Setup (If Automatic Fails)

If the automatic setup doesn't work, you can add a build command in Coolify:

### Build Command:
```bash
bun install && pip3 install -r caption-extractor-2/requirements.txt && bunx --bun prisma generate && bun run build
```

### Start Command:
```bash
bun run start
```

## Environment Variables

No additional environment variables are needed for the Python extractor. It runs independently.

## Troubleshooting

### Python Not Found Error

If you see "Python not found" errors:

1. **Check Coolify build logs** - Look for Python installation messages
2. **Verify nixpacks.toml** - Ensure it's in the root directory
3. **Check Python path** - The script tries `python3` first, then `python`

### Dependencies Not Installing

If `youtube-transcript-api` fails to install:

1. **Check build logs** - Look for pip install errors
2. **Verify requirements.txt** - Ensure it exists at `caption-extractor-2/requirements.txt`
3. **Try manual install** - Add to build command: `pip3 install youtube-transcript-api`

## Testing

After deployment, test the Python extractor:

```bash
curl "https://your-domain.com/api/subtitles-python?videoID=B30j5lHO2xQ&lang=en"
```

Or test it will automatically fallback when the JavaScript extractor fails.
