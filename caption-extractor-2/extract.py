#!/usr/bin/env python3
"""
YouTube Caption Extractor using youtube-transcript-api
This script extracts subtitles from YouTube videos and returns them as JSON.
"""

import sys
import json

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
except ImportError:
    print(json.dumps({"error": "youtube-transcript-api is not installed. Run: pip install youtube-transcript-api"}))
    sys.exit(1)

def extract_subtitles(video_id: str, lang: str = "en"):
    """
    Extract subtitles from a YouTube video.
    
    Args:
        video_id: YouTube video ID
        lang: Language code (default: "en")
    
    Returns:
        JSON string with subtitles array or error object
    """
    try:
        yt_api = YouTubeTranscriptApi()
        transcript_data = None
        transcript_lang = lang
        
        # Try to get transcript in the requested language
        try:
            # Use list to find available transcripts
            transcript_list = yt_api.list(video_id)
            
            # Try to find transcript in requested language
            try:
                transcript = transcript_list.find_transcript([lang])
                fetched = transcript.fetch()
                transcript_data = fetched
                transcript_lang = transcript.language
            except NoTranscriptFound:
                # Try auto-generated transcript
                try:
                    transcript = transcript_list.find_generated_transcript([lang])
                    fetched = transcript.fetch()
                    transcript_data = fetched
                    transcript_lang = transcript.language
                except NoTranscriptFound:
                    # Get any available transcript
                    for transcript in transcript_list:
                        fetched = transcript.fetch()
                        transcript_data = fetched
                        transcript_lang = transcript.language
                        break
        except TranscriptsDisabled:
            return json.dumps({
                "error": "Transcripts are disabled for this video",
                "video_id": video_id
            })
        except VideoUnavailable:
            return json.dumps({
                "error": "Video is unavailable",
                "video_id": video_id
            })
        except Exception as e:
            # Try direct fetch as fallback
            try:
                fetched = yt_api.fetch(video_id)
                transcript_data = fetched
                transcript_lang = "auto"
            except Exception as fetch_error:
                return json.dumps({
                    "error": f"Could not fetch transcript: {str(fetch_error)}",
                    "video_id": video_id,
                    "original_error": str(e)
                })
        
        if transcript_data is None:
            return json.dumps({
                "error": "No transcript data retrieved",
                "video_id": video_id
            })
        
        # Convert to our format: [{ start, dur, text }]
        subtitles = []
        for item in transcript_data:
            if isinstance(item, dict):
                subtitles.append({
                    "start": str(item.get("start", item.get("startTime", 0))),
                    "dur": str(item.get("duration", item.get("dur", 0))),
                    "text": str(item.get("text", item.get("textContent", ""))).strip()
                })
            else:
                # Handle object format
                subtitles.append({
                    "start": str(getattr(item, "start", 0)),
                    "dur": str(getattr(item, "duration", 0)),
                    "text": str(getattr(item, "text", "")).strip()
                })
        
        return json.dumps({
            "subtitles": subtitles,
            "language": transcript_lang
        })
        
    except Exception as e:
        return json.dumps({
            "error": str(e),
            "video_id": video_id,
            "error_type": type(e).__name__
        })

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing videoID argument"}))
        sys.exit(1)
    
    video_id = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "en"
    
    result = extract_subtitles(video_id, lang)
    print(result)
