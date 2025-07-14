import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { getAllVideos } from './videoUtils';

const QR_CODES_DIR = path.join(process.cwd(), 'public', 'qr_codes');

export interface QRCodeInfo {
  country: string;
  videoName: string;
  fileName: string;
  url: string;
}

export async function generateQRCodes(baseUrl: string): Promise<QRCodeInfo[]> {
  try {
    // Ensure QR codes directory exists
    if (!fs.existsSync(QR_CODES_DIR)) {
      fs.mkdirSync(QR_CODES_DIR, { recursive: true });
    }

    const videos = getAllVideos();
    const qrCodes: QRCodeInfo[] = [];

    for (const video of videos) {
      const videoUrl = `${baseUrl}/${video.country}/${video.name}`;
      const fileName = `${video.country}-${video.name}.png`;
      const filePath = path.join(QR_CODES_DIR, fileName);

      // Generate QR code as PNG
      await QRCode.toFile(filePath, videoUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      qrCodes.push({
        country: video.country,
        videoName: video.name,
        fileName,
        url: videoUrl
      });
    }

    console.log(`Generated ${qrCodes.length} QR codes`);
    return qrCodes;
  } catch (error) {
    console.error('Error generating QR codes:', error);
    throw error;
  }
}

export function getExistingQRCodes(): QRCodeInfo[] {
  try {
    if (!fs.existsSync(QR_CODES_DIR)) {
      return [];
    }

    const files = fs.readdirSync(QR_CODES_DIR)
      .filter(file => file.endsWith('.png'));

    const videos = getAllVideos();
    const qrCodes: QRCodeInfo[] = [];

    files.forEach(fileName => {
      // Parse filename: country-videoname.png
      const nameWithoutExt = path.parse(fileName).name;
      const parts = nameWithoutExt.split('-');
      
      if (parts.length >= 2) {
        const country = parts[0];
        const videoName = parts.slice(1).join('-');
        
        // Check if corresponding video still exists
        const video = videos.find(v => v.country === country && v.name === videoName);
        if (video) {
          qrCodes.push({
            country,
            videoName,
            fileName,
            url: `/${country}/${videoName}`
          });
        }
      }
    });

    return qrCodes;
  } catch (error) {
    console.error('Error reading existing QR codes:', error);
    return [];
  }
}

export function cleanupQRCodes(): void {
  try {
    if (!fs.existsSync(QR_CODES_DIR)) {
      return;
    }

    const videos = getAllVideos();
    const videoSet = new Set(videos.map(v => `${v.country}-${v.name}`));

    const files = fs.readdirSync(QR_CODES_DIR)
      .filter(file => file.endsWith('.png'));

    files.forEach(fileName => {
      const nameWithoutExt = path.parse(fileName).name;
      if (!videoSet.has(nameWithoutExt)) {
        const filePath = path.join(QR_CODES_DIR, fileName);
        fs.unlinkSync(filePath);
        console.log(`Deleted orphaned QR code: ${fileName}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up QR codes:', error);
  }
}
