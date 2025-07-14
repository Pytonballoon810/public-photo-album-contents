import { NextRequest, NextResponse } from 'next/server';
import { generateQRCodes, cleanupQRCodes } from '../../utils/qrCodeUtils';

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    // Clean up orphaned QR codes first
    cleanupQRCodes();
    
    // Generate new QR codes
    const qrCodes = await generateQRCodes(baseUrl);
    
    return NextResponse.json({ 
      success: true, 
      message: `Generated ${qrCodes.length} QR codes`,
      qrCodes 
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate QR codes' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getExistingQRCodes } = await import('../../utils/qrCodeUtils');
    const qrCodes = getExistingQRCodes();
    
    return NextResponse.json({ 
      success: true, 
      qrCodes 
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}
