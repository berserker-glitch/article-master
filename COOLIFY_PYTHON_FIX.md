# Fixing Python Not Found in Coolify

If you're still getting "Python not found" errors, try these solutions:

## Solution 1: Use Dockerfile Instead of Nixpacks

If Nixpacks isn't working, you can force Coolify to use the Dockerfile:

1. In Coolify, go to your application settings
2. Under "Build Pack", select "Dockerfile" instead of "Nixpacks"
3. The Dockerfile will install Python and dependencies

## Solution 2: Add Python to Build Command

In Coolify, add this to your **Build Command**:

```bash
apt-get update && apt-get install -y python3 python3-pip && pip3 install -r caption-extractor-2/requirements.txt && bun install && bunx --bun prisma generate && bun run build
```

## Solution 3: Install Python via Environment Variable

Add this to your Coolify environment variables:

**Variable Name:** `NIXPACKS_PYTHON_VERSION`  
**Value:** `3.11`

## Solution 4: Manual Python Installation in Build

Add this to your **Build Command** in Coolify:

```bash
# Install Python
apt-get update && apt-get install -y python3 python3-pip

# Install Python dependencies
pip3 install -r caption-extractor-2/requirements.txt

# Continue with normal build
bun install && bunx --bun prisma generate && bun run build
```

## Solution 5: Check Build Logs

1. Go to your Coolify deployment logs
2. Look for Python installation messages
3. Check if `pip3 install` ran successfully
4. Verify Python is in the PATH

## Solution 6: Use Dockerfile (Recommended)

The Dockerfile approach is more reliable. To use it:

1. Make sure `Dockerfile` exists in your repo root
2. In Coolify, set Build Pack to "Dockerfile"
3. The Dockerfile will handle Python installation

## Verification

After deployment, test if Python is available:

```bash
# SSH into your container (if possible) or check logs
python3 --version
pip3 list | grep youtube-transcript-api
```

Or test the API endpoint:
```bash
curl "https://your-domain.com/api/subtitles-python?videoID=B30j5lHO2xQ&lang=en"
```

## If All Else Fails

The app will still work without Python - the JavaScript extractor will be used, and only the Python fallback won't function. The error messages will guide you on what's missing.
