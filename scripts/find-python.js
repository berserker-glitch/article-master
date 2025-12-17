#!/usr/bin/env node
/**
 * Helper script to find Python executable
 * Can be used to verify Python is available
 */

const { execSync } = require("child_process");
const { existsSync } = require("fs");

const pythonCommands = ["python3", "python", "/usr/bin/python3", "/usr/local/bin/python3"];

console.log("Searching for Python...");

for (const cmd of pythonCommands) {
  try {
    const version = execSync(`${cmd} --version`, { encoding: "utf-8", stdio: "pipe" });
    console.log(`✓ Found: ${cmd} - ${version.trim()}`);
    
    // Check if youtube-transcript-api is installed
    try {
      execSync(`${cmd} -c "import youtube_transcript_api; print('youtube-transcript-api: OK')"`, {
        encoding: "utf-8",
        stdio: "pipe",
      });
      console.log(`✓ youtube-transcript-api is installed`);
    } catch {
      console.log(`✗ youtube-transcript-api is NOT installed`);
    }
    
    process.exit(0);
  } catch (error) {
    console.log(`✗ ${cmd} not found`);
  }
}

console.error("ERROR: Python not found!");
process.exit(1);
