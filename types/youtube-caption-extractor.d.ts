declare module "youtube-caption-extractor" {
  export interface Subtitle {
    start: string
    dur: string
    text: string
  }

  export interface VideoDetails {
    title: string
    description: string
    subtitles: Subtitle[]
  }

  export function getSubtitles(options: {
    videoID: string
    lang?: string
  }): Promise<Subtitle[]>

  export function getVideoDetails(options: {
    videoID: string
    lang?: string
  }): Promise<VideoDetails>
}


