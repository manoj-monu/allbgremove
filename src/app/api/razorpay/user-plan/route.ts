import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { resolvePlan, AUTHORIZED_PLANS } from '../create-order/route';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TnAn3d4To4Q8Lg';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g10ACeieLyoHjM9d65znXrCb';

const AUTHORIZED_OWNER_EMAILS = [
  'passportphoto2026@gmail.com',
  'manoj.watkar61@gmail.com',
  'monusharma847224@gmail.com',
];

function isOwner(email: string): boolean {
  const e = (email || '').toLowerCase().trim();
  if (!e) return false;
  if (AUTHORIZED_OWNER_EMAILS.includes(e)) return true;
  if (e.includes('manoj.watkar') || e.includes('monusharma847224') || e.includes('passportphoto2026')) return true;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email') || '';
    const email = emailParam.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email query parameter required.' }, { status: 400 });
    }

    // 1. OWNER CHECK (LIFETIME UNLIMITED)
    if (isOwner(email)) {
      const planExpires = Date.now() + 3650 * 24 * 60 * 60 * 1000; // 10 years
      const tokenPayload = {
        email,
        paymentId: 'OWNER_PERMANENT_PASS',
        orderId: 'OWNER_ORDER',
        plan: 'Owner Lifetime Unlimited Pass',
        amount: 0,
        credits: 9999,
        isUnlimited: true,
        planExpires,
        verifiedAt: Date.now(),
        status: 'OWNER_ACTIVE',
      };
      const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
      const tokenSig = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(payloadB64).digest('hex');
      const activationToken = `${payloadB64}.${tokenSig}`;

      return NextResponse.json({
        success: true,
        isUnlimited: true,
        credits: 9999,
        plan: 'Owner Lifetime Unlimited Pass',
        planExpires,
        activationToken,
        isOwner: true,
      });
    }

    // 2. CHECK RAZORPAY DIRECTLY FOR CAPTURED PAYMENTS FOR THIS EMAIL
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpRes = await fetch(`https://api.razorpay.com/v1/payments?count=50`, {
      method: 'GET',
      headers: { Authorization: authHeader },
    });

    if (!rzpRes.ok) {
      return NextResponse.json({ success: false, error: 'Could not contact Razorpay' }, { status: 502 });
    }

    const rzpData = await rzpRes.json();
    const items = Array.isArray(rzpData.items) ? rzpData.items : [];

    // Find any captured payment belonging to this email
    const match = items.find((p: any) => {
      const pEmail = (p.email || p.notes?.userEmail || '').toLowerCase().trim();
      return pEmail === email && p.status === 'captured';
    });

    if (match) {
      const planName = match.notes?.planName || match.notes?.planKey || match.description || '1 Month Unlimited Plan';
      const plan = resolvePlan(planName);

      // Check payment age
      const paymentTimeMs = (match.created_at || Math.floor(Date.now() / 1000)) * 1000;
      const validityMs = (plan.days || 30) * 24 * 60 * 60 * 1000;
      const expiresAt = paymentTimeMs + validityMs;

      if (Date.now() < expiresAt) {
        // Payment is still valid and active!
        const tokenPayload = {
          email,
          paymentId: match.id,
          orderId: match.order_id,
          plan: plan.name,
          amount: plan.amount,
          credits: plan.credits,
          isUnlimited: plan.isUnlimited,
          planExpires: expiresAt,
          verifiedAt: Date.now(),
          status: 'VERIFIED_ACTIVE',
        };
        const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
        const tokenSig = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(payloadB64).digest('hex');
        const activationToken = `${payloadB64}.${tokenSig}`;

        return NextResponse.json({
          success: true,
          isUnlimited: plan.isUnlimited,
          credits: plan.credits,
          plan: plan.name,
          planExpires: expiresAt,
          paymentId: match.id,
          orderId: match.order_id,
          activationToken,
        });
      }
    }

    // No active paid plan found
    return NextResponse.json({
      success: true,
      isUnlimited: false,
      credits: 5,
      plan: 'Free Plan',
    });
  } catch (err: any) {
    console.error('Error in user-plan check:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
