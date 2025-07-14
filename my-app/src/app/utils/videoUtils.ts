import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');

export interface VideoInfo {
  country: string;
  name: string;
  path: string;
  displayName: string;
}

export function getAllVideos(): VideoInfo[] {
  try {
    // Check if we can access the file system (for runtime vs build time)
    if (typeof window !== 'undefined') {
      // Client-side, return empty array
      return [];
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
          .filter(file => file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov'));

        videoFiles.forEach(videoFile => {
          const videoName = path.parse(videoFile).name;
          videos.push({
            country,
            name: videoName,
            path: `/videos/${country}/${videoFile}`,
            displayName: videoName.replace(/[-_]/g, ' ')
          });
        });
      } catch (error) {
        console.error(`Error reading country directory ${country}:`, error);
      }
    });

    return videos;
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return [];
  }
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
