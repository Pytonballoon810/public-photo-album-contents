# public-photo-album-contents

This project is meant as a method of publicly sharing photos in a way that is easy to access and navigate. It is designed to be used with a static site generator like Jekyll or Hugo, but can also be used with any web server that serves static files.

## Features

- Easy to navigate photo albums
- Responsive design
- Dynamic photo/video loading
- QR code generation for easy video sharing
- Auto-regeneration of QR codes when videos are added/removed

## Usage

1. Configure the `docker-compose.yml` file with your desired settings.
2. Set the `BASE_URL` environment variable in the docker-compose.yml to your actual domain/IP address.
3. Deploy using docker compose
4. Put the media files in the bind mount directory specified in the `docker-compose.yml` file.
5. Use the "Generate QR Codes" button on the main page to create QR codes for all videos.
6. QR codes will be saved to the `qr_codes` folder and can be extracted from the host system.

## QR Code Configuration

The QR codes are generated based on the `BASE_URL` environment variable. Make sure to set this to your actual domain or IP address:

```yaml
environment:
  - BASE_URL=https://your-domain.com  # Change this to your actual URL
```

QR codes are automatically generated when:

- The page loads and no QR codes exist
- You click the "Generate QR Codes" button
- Videos are added or removed (cleanup of orphaned QR codes)
