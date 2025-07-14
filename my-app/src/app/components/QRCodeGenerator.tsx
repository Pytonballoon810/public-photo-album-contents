'use client';

import { useState, useEffect } from 'react';

interface QRCodeInfo {
  country: string;
  videoName: string;
  fileName: string;
  url: string;
}

export default function QRCodeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [qrCodes, setQrCodes] = useState<QRCodeInfo[]>([]);
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);

  const generateQRCodes = async () => {
    setIsGenerating(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        setQrCodes(data.qrCodes || []);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Failed to generate QR codes');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchExistingQRCodes = async () => {
    try {
      const response = await fetch('/api/generate-qr');
      const data = await response.json();
      
      if (data.success) {
        setQrCodes(data.qrCodes || []);
        // Check if we need to auto-generate QR codes
        if (data.qrCodes.length === 0) {
          setShouldAutoGenerate(true);
        }
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      setShouldAutoGenerate(true);
    }
  };

  // Auto-generate QR codes if needed
  useEffect(() => {
    if (shouldAutoGenerate && !isGenerating) {
      generateQRCodes();
      setShouldAutoGenerate(false);
    }
  }, [shouldAutoGenerate, isGenerating]);

  // Fetch existing QR codes on component mount
  useEffect(() => {
    fetchExistingQRCodes();
  }, []);

  return (
    <div style={{ 
      margin: '2rem 0', 
      padding: '1rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'var(--gray-alpha-100)'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>QR Code Generator</h3>
      <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Generate QR codes for all videos to easily share direct links to each video.
      </p>
      
      <button
        onClick={generateQRCodes}
        disabled={isGenerating}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: isGenerating ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}
      >
        {isGenerating ? 'Generating QR Codes...' : 'Generate QR Codes'}
      </button>

      {message && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem',
          backgroundColor: message.includes('Error') ? '#fee' : '#efe',
          color: message.includes('Error') ? '#c33' : '#363',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {qrCodes.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Generated QR Codes ({qrCodes.length}):</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {qrCodes.map((qr) => (
              <div key={qr.fileName} style={{ 
                textAlign: 'center', 
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}>
                <img 
                  src={`/qr_codes/${qr.fileName}`} 
                  alt={`QR code for ${qr.country} - ${qr.videoName}`}
                  style={{ width: '150px', height: '150px', marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                  <strong>{qr.country}</strong><br/>
                  {qr.videoName.replace(/[-_]/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
