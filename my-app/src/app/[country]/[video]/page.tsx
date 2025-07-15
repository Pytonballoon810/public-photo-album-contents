import { notFound } from 'next/navigation';
import { getAllVideos } from '../../lib/videoUtils';

interface VideoPageProps {
  params: Promise<{
    country: string;
    video: string;
  }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { country, video: videoName } = await params;
  
  const videos = getAllVideos();
  
  const video = videos.find(
    v => v.country === country && v.name === videoName
  );

  if (!video) {
    console.log('Video not found:', { country, videoName });
    console.log('Available videos:', videos.map(v => ({ country: v.country, name: v.name })));
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <video 
        controls 
        width="100%" 
        style={{ maxWidth: '800px' }}
      >
        <source src={video.path} type={`video/${video.fileExtension.slice(1)}`} />
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
