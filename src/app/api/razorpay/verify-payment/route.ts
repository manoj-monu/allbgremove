import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { resolvePlan } from '../create-order/route';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TnAn3d4To4Q8Lg';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g10ACeieLyoHjM9d65znXrCb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userEmail,
      planKey,
    } = body;

    // 1. Mandatory Parameters Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay cryptographic verification parameters.' },
        { status: 400 }
      );
    }

    const email = (userEmail || '').toString().toLowerCase().trim();
    if (!email) {
      return NextResponse.json(
        { error: 'User email is required for payment verification.' },
        { status: 400 }
      );
    }

    // 2. CRYPTOGRAPHIC HMAC-SHA256 SIGNATURE VERIFICATION
    // Razorpay standard: hmac_sha256(order_id + "|" + payment_id, secret)
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expBuf = Buffer.from(expectedSignature, 'utf-8');
    const provBuf = Buffer.from(razorpay_signature, 'utf-8');
    const isSignatureValid = expBuf.length === provBuf.length && crypto.timingSafeEqual(expBuf, provBuf);

    if (!isSignatureValid) {
      console.error('SECURITY ALERT: Invalid Razorpay cryptographic signature provided!', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        providedSignature: razorpay_signature,
      });
      return NextResponse.json(
        { error: 'SECURITY ALERT: Payment signature verification failed. Tampered transaction rejected.' },
        { status: 400 }
      );
    }

    // 3. SERVER-TO-SERVER DIRECT CHECK WITH RAZORPAY REST API
    // Verify that the payment actually exists on Razorpay's bank servers and is captured
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpPayRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: 'GET',
      headers: { Authorization: authHeader },
    });

    if (!rzpPayRes.ok) {
      console.error('Razorpay Payment Verification API failed with status', rzpPayRes.status);
      return NextResponse.json(
        { error: 'Could not fetch payment confirmation from Razorpay banking server.' },
        { status: 502 }
      );
    }

    const rzpPayment = await rzpPayRes.json();

    // Check payment status and order ID match
    if (rzpPayment.order_id !== razorpay_order_id) {
      return NextResponse.json(
        { error: 'Payment does not match the generated order ID.' },
        { status: 400 }
      );
    }

    if (rzpPayment.status !== 'captured' && rzpPayment.status !== 'authorized') {
      return NextResponse.json(
        { error: `Payment is in non-completed status: ${rzpPayment.status}` },
        { status: 400 }
      );
    }

    // Resolve plan and verify amount matches
    const plan = resolvePlan(planKey || rzpPayment.notes?.planKey || rzpPayment.notes?.planName);
    const expectedAmountPaise = Math.round(plan.amount * 100);

    if (rzpPayment.amount < expectedAmountPaise) {
      return NextResponse.json(
        { error: `Paid amount (₹${rzpPayment.amount / 100}) is less than plan amount (₹${plan.amount})` },
        { status: 400 }
      );
    }

    // 4. GENERATE CRYPTOGRAPHICALLY SIGNED ACTIVATION TOKEN
    // Only our server knows RAZORPAY_KEY_SECRET, so no hacker can forge this token.
    const planExpires = plan.isUnlimited ? Date.now() + (plan.days * 24 * 60 * 60 * 1000) : null;
    const tokenPayload = {
      email: email,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      plan: plan.name,
      amount: plan.amount,
      credits: plan.credits,
      isUnlimited: plan.isUnlimited,
      planExpires: planExpires,
      verifiedAt: Date.now(),
      status: 'VERIFIED_ACTIVE',
    };

    const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    const tokenSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(payloadB64)
      .digest('hex');

    const signedActivationToken = `${payloadB64}.${tokenSignature}`;

    return NextResponse.json({
      success: true,
      verified: true,
      activationToken: signedActivationToken,
      activation: tokenPayload,
      message: 'Payment verified successfully and plan activated.',
    });
  } catch (error: any) {
    console.error('Verify-payment internal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
