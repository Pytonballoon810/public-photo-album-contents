import { notFound } from 'next/navigation';
import { getAllVideos } from '../../utils/videoUtils';

interface VideoPageProps {
  params: Promise<{
    country: string;
    video: string;
  }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { country, video: videoName } = await params;
  
  // Debug logging
  console.log('Looking for video:', { country, videoName });
  
  const videos = getAllVideos();
  console.log('All videos found:', videos);
  
  const video = videos.find(
    v => v.country === country && v.name === videoName
  );
  
  console.log('Matched video:', video);

  if (!video) {
    console.log('Video not found, returning 404');
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* <h1>{video.displayName}</h1> */}
      <video 
        controls 
        width="100%" 
        style={{ maxWidth: '800px' }}
      >
        <source src={`/videos/${video.country}/${video.name}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Gallery
        </a>
      </p>
    </div>
  );
}
