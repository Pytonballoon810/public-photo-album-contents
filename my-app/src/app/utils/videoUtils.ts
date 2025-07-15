import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');

export interface VideoInfo {
  country: string;
  name: string;
  path: string;
  displayName: string;
  fileExtension: string;
}

// Cache videos for a short time to improve performance but allow updates
let videoCache: { videos: VideoInfo[], timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds cache

export function getAllVideos(): VideoInfo[] {
  try {
    // Check cache first
    if (videoCache && (Date.now() - videoCache.timestamp) < CACHE_DURATION) {
      return videoCache.videos;
    }

    if (!fs.existsSync(VIDEOS_DIR)) {
      console.log('Videos directory does not exist:', VIDEOS_DIR);
      return [];
    }

    const countries = fs.readdirSync(VIDEOS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const videos: VideoInfo[] = [];

    countries.forEach(country => {
      const countryDir = path.join(VIDEOS_DIR, country);
      try {
        const videoFiles = fs.readdirSync(countryDir)
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.wmv'].includes(ext);
          });

        videoFiles.forEach(videoFile => {
          const videoName = path.parse(videoFile).name;
          const fileExtension = path.extname(videoFile);
          videos.push({
            country,
            name: videoName,
            path: `/videos/${country}/${videoFile}`,
            displayName: videoName.replace(/[-_]/g, ' '),
            fileExtension
          });
        });
      } catch (error) {
        console.error(`Error reading country directory ${country}:`, error);
      }
    });

    // Update cache
    videoCache = { videos, timestamp: Date.now() };
    
    console.log(`Found ${videos.length} videos across ${countries.length} countries`);
    return videos;
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return [];
  }
}

// Clear cache function for manual refresh
export function clearVideoCache(): void {
  videoCache = null;
}

export function getVideoInfo(country: string, videoName: string): VideoInfo | null {
  const videos = getAllVideos();
  return videos.find(video => 
    video.country.toLowerCase() === country.toLowerCase() && 
    video.name.toLowerCase() === videoName.toLowerCase()
  ) || null;
}

export function getAllVideoRoutes() {
  const videos = getAllVideos();
  return videos.map(video => ({
    slug: [video.country, video.name]
  }));
}

export function getVideosFingerprint(): string {
  const videos = getAllVideos();
  const fingerprint = videos
    .map(v => `${v.country}:${v.name}`)
    .sort()
    .join('|');
  return fingerprint;
}
