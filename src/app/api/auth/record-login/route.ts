import { NextRequest, NextResponse } from 'next/server';

function parseDevice(ua: string): string {
  if (!ua) return 'Unknown Device';
  let device = 'Desktop';
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) device = 'Mobile';
  else if (/tablet/i.test(ua)) device = 'Tablet';

  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/chrome|crios/i.test(ua) && !/edg|opr/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return `${device} (${os} • ${browser})`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, userEmail, userName, sessionId } = body;

    // Detect client IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let ip = '127.0.0.1';

    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp.trim();
    }

    // Geolocation from Vercel edge headers
    const city = request.headers.get('x-vercel-ip-city') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    const country = request.headers.get('x-vercel-ip-country') || 'IN';
    const userAgent = request.headers.get('user-agent') || '';
    const device = parseDevice(userAgent);

    let location = 'India';
    if (city && region) {
      location = `${decodeURIComponent(city)}, ${region}, ${country}`;
    } else if (city) {
      location = `${decodeURIComponent(city)}, ${country}`;
    } else if (country) {
      location = country;
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: userId || '',
        userEmail: (userEmail || '').toLowerCase().trim(),
        userName: userName || 'Studio User',
        ip: ip,
        city: city ? decodeURIComponent(city) : '',
        region: region,
        country: country,
        location: location,
        device: device,
        userAgent: userAgent,
        sessionId: sessionId || '',
        timestamp: Date.now(),
        dateStr: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    });
  } catch (err: any) {
    console.error('Record login error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
