import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { planId, countryCode = 'US', userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required for checkout' },
        { status: 400 }
      );
    }

    // Pricing tiers (Digital Single vs Studio Unlimited)
    const prices: Record<string, { amount: number; currency: string; name: string }> = {
      'single-pass': { amount: 699, currency: 'usd', name: 'Digital Single & Print Sheet (1 Photo)' },
      'unlimited-pass': { amount: 1499, currency: 'usd', name: 'Studio Unlimited Pass (30 Days Fair Use)' }
    };

    const selectedPlan = prices[planId] || prices['single-pass'];

    // Create Stripe Checkout Session
    const origin = request.headers.get('origin') || 'https://allbgremove.com';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: selectedPlan.currency,
            product_data: {
              name: selectedPlan.name,
              description: 'Official Biometric 300 DPI Passport & Visa Photo Creator',
            },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing.html?payment=cancelled`,
      metadata: {
        userEmail,
        planId,
        countryCode,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err: any) {
    console.error('Stripe session creation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to initiate Stripe checkout' },
      { status: 500 }
    );
  }
}
