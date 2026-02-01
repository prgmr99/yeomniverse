import { createCheckout } from '@hyo/services/lemonsqueezy';
import { type NextRequest, NextResponse } from 'next/server';

interface CheckoutRequest {
  email: string;
  plan: 'basic' | 'pro';
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json(
        { error: 'Email and plan are required' },
        { status: 400 },
      );
    }

    if (plan !== 'basic' && plan !== 'pro') {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "basic" or "pro"' },
        { status: 400 },
      );
    }

    const variantId =
      plan === 'basic'
        ? process.env.LEMON_SQUEEZY_BASIC_VARIANT_ID
        : process.env.LEMON_SQUEEZY_PRO_VARIANT_ID;

    if (!variantId) {
      console.error(`Missing variant ID for plan: ${plan}`);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    if (!storeId) {
      console.error('Missing LEMON_SQUEEZY_STORE_ID');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const checkoutUrl = await createCheckout({
      email,
      variantId,
      successUrl: `${request.nextUrl.origin}/dashboard?checkout=success`,
      cancelUrl: `${request.nextUrl.origin}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
