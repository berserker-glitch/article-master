import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"
import { spawn } from "child_process"
import { join } from "path"

export const runtime = "nodejs"

/**
 * Python-based caption extractor fallback
 * This route calls a Python script to extract YouTube captions
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoID = searchParams.get("videoID")
  const lang = searchParams.get("lang") || "en"

  if (!videoID) {
    return NextResponse.json({ error: "Missing videoID" }, { status: 400 })
  }

  return new Promise<NextResponse>((resolve) => {
    // Path to the Python script
    const scriptPath = join(process.cwd(), "caption-extractor-2", "extract.py")
    
    // Try multiple Python commands in order of preference
    // In Nixpacks/Coolify, Python might be in different locations
    const pythonCommands = [
      "python3",
      "python",
      "/nix/store/*/bin/python3", // Nix store path (wildcard won't work, but shows intent)
      "/usr/bin/python3",
      "/usr/local/bin/python3",
    ]
    
    // For now, use python3 (most common in Linux/Coolify)
    // If this fails, the error handler will provide helpful feedback
    const pythonCmd = process.platform === "win32" ? "python" : "python3"
    
    // Spawn Python process
    const pythonProcess = spawn(pythonCmd, [scriptPath, videoID, lang], {
      cwd: process.cwd(),
      env: { 
        ...process.env, 
        PYTHONUNBUFFERED: "1",
        PATH: process.env.PATH || "/usr/bin:/usr/local/bin:/nix/store/*/bin"
      },
      shell: false, // Don't use shell to get better error messages
    })

    let stdout = ""
    let stderr = ""

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString()
    })

    pythonProcess.on("error", (error) => {
      // Provide helpful error message with troubleshooting steps
      const isENOENT = (error as NodeJS.ErrnoException).code === "ENOENT"
      const errorMessage = isENOENT
        ? `Python command '${pythonCmd}' not found. Python may not be installed or not in PATH.`
        : `Failed to execute Python script: ${error.message}`
      
      resolve(
        NextResponse.json(
          {
            error: errorMessage,
            details: error.message,
            suggestion: isENOENT
              ? "Python needs to be installed in the deployment environment. Check nixpacks.toml configuration and ensure Python is included in the build."
              : "Make sure Python is installed and youtube-transcript-api is installed (pip install youtube-transcript-api)",
            videoID,
            pythonCommand: pythonCmd,
            platform: process.platform,
            path: process.env.PATH,
            troubleshooting: {
              step1: "Verify nixpacks.toml includes python3 in nixPkgs",
              step2: "Check build logs for Python installation",
              step3: "Ensure pip install ran successfully during build",
              step4: "Try adding Python to PATH in environment variables"
            }
          },
          { status: 500 }
        )
      )
    })

    // Set a timeout (30 seconds) to prevent hanging
    const timeout = setTimeout(() => {
      pythonProcess.kill()
      resolve(
        NextResponse.json(
          {
            error: "Python script execution timed out",
            videoID,
            timeout: 30000,
          },
          { status: 504 }
        )
      )
    }, 30000)

    pythonProcess.on("close", (code) => {
      clearTimeout(timeout)
      
      if (code !== 0) {
        resolve(
          NextResponse.json(
            {
              error: `Python script failed with code ${code}`,
              stderr: stderr || "No error output",
              videoID,
            },
            { status: 500 }
          )
        )
        return
      }

      try {
        const result = JSON.parse(stdout.trim())
        
        if (result.error) {
          resolve(
            NextResponse.json(
              {
                error: result.error,
                videoID: result.video_id || videoID,
              },
              { status: 404 }
            )
          )
          return
        }

        if (result.subtitles && Array.isArray(result.subtitles)) {
          // Validate and filter subtitles
          const validSubtitles = result.subtitles.filter(
            (sub: any) =>
              sub &&
              typeof sub === "object" &&
              typeof sub.text === "string" &&
              sub.text.trim().length > 0
          )

          if (validSubtitles.length > 0) {
            resolve(
              NextResponse.json(
                {
                  subtitles: validSubtitles,
                  language: result.language,
                  source: "python-fallback",
                },
                { status: 200 }
              )
            )
            return
          }
        }

        resolve(
          NextResponse.json(
            {
              error: "No valid subtitles found",
              videoID,
            },
            { status: 404 }
          )
        )
      } catch (parseError) {
        resolve(
          NextResponse.json(
            {
              error: "Failed to parse Python script output",
              details: parseError instanceof Error ? parseError.message : String(parseError),
              stdout: stdout.substring(0, 500),
              videoID,
            },
            { status: 500 }
          )
        )
      }
    })
  })
}
