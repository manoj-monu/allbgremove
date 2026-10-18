import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_mock';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(rawBody, signature || '', STRIPE_WEBHOOK_SECRET);
      } else {
        event = JSON.parse(rawBody) as Stripe.Event;
      }
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle completed checkout session
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userEmail = session.customer_email || session.metadata?.userEmail;
      const planId = session.metadata?.planId || 'single-pass';

      console.log(`[Stripe Webhook] Automatic Activation for ${userEmail}, plan: ${planId}`);
      // In Firestore / backend, activate credits & update user plan here
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook handling error:', err);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
