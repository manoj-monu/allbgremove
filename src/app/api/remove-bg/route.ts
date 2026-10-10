import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(request: NextRequest) {
  try {
    // 1. Origin verification to prevent cross-site abuse
    const origin = request.headers.get('origin') || request.headers.get('referer');
    if (origin) {
      const url = new URL(origin);
      const host = url.hostname;
      const isAllowed = 
        host === 'allbgremove.com' ||
        host === 'www.allbgremove.com' ||
        host.endsWith('.vercel.app') ||
        host === 'localhost' ||
        host === '127.0.0.1';

      if (!isAllowed) {
        return NextResponse.json({ error: 'Forbidden: Unauthorized origin' }, { status: 403 });
      }
    }

    // 2. Parse and validate multipart form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Valid image file is required' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image exceeds maximum size limit (15MB)' }, { status: 400 });
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG and WebP are allowed' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const enhanceParam = searchParams.get('enhance');
    const enhance = enhanceParam === 'true' ? 'true' : 'false';

    // 3. Proxy to AI Backend securely
    const hfApiKey = process.env.HF_API_KEY || 'SUPER_SECRET_KEY_998877';
    const upstreamUrl = `https://manojkumarsh-allbgremove-api.hf.space/api/process-all?enhance=${enhance}`;

    const outgoingFormData = new FormData();
    outgoingFormData.append('file', file, 'upload.png');

    const response = await fetch(upstreamUrl, {
      method: 'POST',
      body: outgoingFormData,
      headers: {
        'x-api-key': hfApiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'AI processing service responded with code ' + response.status }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });

  } catch (error: any) {
    console.error('Secure Remove-BG API Error:', error);
    return NextResponse.json({ error: 'Internal server error while processing image' }, { status: 500 });
  }
}
