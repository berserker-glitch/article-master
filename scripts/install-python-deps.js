#!/usr/bin/env node
/**
 * Install Python dependencies for caption extractor
 * This script runs during the build process in Coolify
 */

const { execSync } = require("child_process");
const { existsSync } = require("fs");
const { join } = require("path");

const requirementsPath = join(__dirname, "..", "caption-extractor-2", "requirements.txt");

console.log("Installing Python dependencies for caption extractor...");

// Check if requirements.txt exists
if (!existsSync(requirementsPath)) {
  console.warn("Warning: requirements.txt not found, skipping Python dependency installation");
  process.exit(0);
}

try {
  // Check for Python
  let pythonCmd = "python3";
  let pipCmd = "pip3";

  try {
    execSync("python3 --version", { stdio: "ignore" });
  } catch {
    try {
      execSync("python --version", { stdio: "ignore" });
      pythonCmd = "python";
      pipCmd = "pip";
    } catch {
      console.warn("Warning: Python not found. Python caption extractor will not be available.");
      console.warn("To enable it, install Python 3.6+ in your deployment environment.");
      process.exit(0);
    }
  }

  console.log(`Using Python: ${pythonCmd}`);

  // Upgrade pip
  try {
    execSync(`${pipCmd} install --upgrade pip`, { stdio: "inherit" });
  } catch (error) {
    console.warn("Warning: Failed to upgrade pip, continuing anyway...");
  }

  // Install dependencies
  console.log("Installing youtube-transcript-api...");
  execSync(`${pipCmd} install --no-cache-dir -r "${requirementsPath}"`, {
    stdio: "inherit",
    cwd: join(__dirname, ".."),
  });

  console.log("Python dependencies installed successfully!");
} catch (error) {
  console.error("Error installing Python dependencies:", error.message);
  console.warn("Warning: Python caption extractor may not work, but the app will continue to build.");
  // Don't fail the build if Python deps fail
  process.exit(0);
}
