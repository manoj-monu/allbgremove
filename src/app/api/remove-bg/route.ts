import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { searchParams } = new URL(request.url);
    const enhance = searchParams.get('enhance') || 'false';

    const response = await fetch(
      `https://manojkumarsh-allbgremove-api.hf.space/api/process-all?enhance=${enhance}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'x-api-key': 'SUPER_SECRET_KEY_998877',
        }
      }
    );

    if (!response.ok) {
      return new NextResponse('HuggingFace API Error: ' + response.status, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
