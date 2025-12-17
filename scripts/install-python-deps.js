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

  // Check if we're in a Nix environment (externally managed)
  // If so, create a virtual environment to install packages
  const venvPath = join(__dirname, "..", ".venv");
  let useVenv = false;

  try {
    // Try to create a virtual environment
    execSync(`${pythonCmd} -m venv "${venvPath}"`, { stdio: "ignore" });
    useVenv = true;
    console.log("Created virtual environment for Python packages");
  } catch (error) {
    // If venv creation fails, try without it (might work in some environments)
    console.warn("Warning: Could not create virtual environment, trying system install...");
  }

  let finalPipCmd = pipCmd;
  if (useVenv) {
    // Use pip from the virtual environment
    const venvPip = process.platform === "win32" 
      ? join(venvPath, "Scripts", "pip")
      : join(venvPath, "bin", "pip");
    finalPipCmd = venvPip;
  }

  // Upgrade pip
  try {
    execSync(`${finalPipCmd} install --upgrade pip`, { stdio: "inherit" });
  } catch (error) {
    console.warn("Warning: Failed to upgrade pip, continuing anyway...");
  }

  // Install dependencies
  console.log("Installing youtube-transcript-api...");
  try {
    execSync(`${finalPipCmd} install --no-cache-dir -r "${requirementsPath}"`, {
      stdio: "inherit",
      cwd: join(__dirname, ".."),
    });
  } catch (error) {
    // If virtual env approach fails, try with --break-system-packages as last resort
    if (useVenv) {
      console.warn("Virtual environment install failed, trying with --break-system-packages...");
      execSync(`${pipCmd} install --break-system-packages --no-cache-dir -r "${requirementsPath}"`, {
        stdio: "inherit",
        cwd: join(__dirname, ".."),
      });
    } else {
      throw error;
    }
  }

  console.log("Python dependencies installed successfully!");
} catch (error) {
  console.error("Error installing Python dependencies:", error.message);
  console.warn("Warning: Python caption extractor may not work, but the app will continue to build.");
  // Don't fail the build if Python deps fail
  process.exit(0);
}
