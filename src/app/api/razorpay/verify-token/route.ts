import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g10ACeieLyoHjM9d65znXrCb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, userEmail } = body;

    if (!token || typeof token !== 'string' || !token.includes('.')) {
      return NextResponse.json({ valid: false, error: 'Invalid token structure' }, { status: 400 });
    }

    const [payloadB64, providedSig] = token.split('.');
    if (!payloadB64 || !providedSig) {
      return NextResponse.json({ valid: false, error: 'Malformed token' }, { status: 400 });
    }

    const expectedSig = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(payloadB64)
      .digest('hex');

    const expBuf = Buffer.from(expectedSig, 'utf-8');
    const provBuf = Buffer.from(providedSig, 'utf-8');
    const isValid = expBuf.length === provBuf.length && crypto.timingSafeEqual(expBuf, provBuf);

    if (!isValid) {
      return NextResponse.json({ valid: false, error: 'Token cryptographic signature verification failed' }, { status: 403 });
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));

    // Check email match if supplied
    if (userEmail) {
      const email = userEmail.toString().toLowerCase().trim();
      if (payload.email && payload.email.toLowerCase().trim() !== email) {
        return NextResponse.json({ valid: false, error: 'Token email mismatch' }, { status: 403 });
      }
    }

    // Check expiry
    if (payload.planExpires && payload.planExpires < Date.now()) {
      return NextResponse.json({ valid: false, expired: true, error: 'Subscription plan has expired' }, { status: 200 });
    }

    return NextResponse.json({
      valid: true,
      payload,
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error?.message || 'Verification failed' }, { status: 500 });
  }
}
