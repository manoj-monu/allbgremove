import { NextRequest, NextResponse } from 'next/server';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TnAn3d4To4Q8Lg';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g10ACeieLyoHjM9d65znXrCb';

export interface PlanConfig {
  key: string;
  name: string;
  amount: number; // in INR
  credits: number;
  isUnlimited: boolean;
  days: number;
}

export const AUTHORIZED_PLANS: Record<string, PlanConfig> = {
  unlimited_99: {
    key: 'unlimited_99',
    name: '1 Month Unlimited Plan',
    amount: 99,
    credits: 9999,
    isUnlimited: true,
    days: 30,
  },
  unlimited_199: {
    key: 'unlimited_199',
    name: '3 Months Unlimited Plan',
    amount: 199,
    credits: 9999,
    isUnlimited: true,
    days: 90,
  },
  unlimited_499: {
    key: 'unlimited_499',
    name: '1 Year Unlimited Plan',
    amount: 499,
    credits: 9999,
    isUnlimited: true,
    days: 365,
  },
  credits_29: {
    key: 'credits_29',
    name: '10 Credits Starter',
    amount: 29,
    credits: 10,
    isUnlimited: false,
    days: 365,
  },
  credits_49: {
    key: 'credits_49',
    name: '30 Credits Pro',
    amount: 49,
    credits: 30,
    isUnlimited: false,
    days: 365,
  },
};

export function resolvePlan(requestedKeyOrName?: string): PlanConfig {
  if (!requestedKeyOrName) return AUTHORIZED_PLANS.unlimited_99;

  const needle = requestedKeyOrName.toLowerCase().trim();
  if (AUTHORIZED_PLANS[needle]) return AUTHORIZED_PLANS[needle];

  for (const plan of Object.values(AUTHORIZED_PLANS)) {
    if (plan.name.toLowerCase() === needle || needle.includes(plan.name.toLowerCase()) || plan.key === needle) {
      return plan;
    }
  }

  // Safe default: 1 Month Unlimited
  return AUTHORIZED_PLANS.unlimited_99;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { planKey, userEmail, userName } = body;

    const email = (userEmail || '').toString().toLowerCase().trim();
    if (!email) {
      return NextResponse.json(
        { error: 'User email is required to initiate secure payment.' },
        { status: 400 }
      );
    }

    const plan = resolvePlan(planKey);
    const amountInPaise = Math.round(plan.amount * 100);

    // Call official Razorpay Orders API
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const orderPayload = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      notes: {
        planKey: plan.key,
        planName: plan.name,
        userEmail: email,
        userName: userName || '',
        platform: 'allbgremove.com',
      },
    };

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!rzpRes.ok) {
      const errData = await rzpRes.json().catch(() => ({}));
      console.error('Razorpay Create Order API error:', errData);
      return NextResponse.json(
        { error: 'Failed to create official Razorpay order', details: errData },
        { status: 502 }
      );
    }

    const order = await rzpRes.json();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      plan: {
        key: plan.key,
        name: plan.name,
        amount: plan.amount,
        credits: plan.credits,
        isUnlimited: plan.isUnlimited,
      },
    });
  } catch (error: any) {
    console.error('Create-order internal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
