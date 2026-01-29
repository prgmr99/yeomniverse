import { createServerClient } from '@hyo/services/supabase';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';

interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      user_email: string;
      customer_id: number;
      variant_id: number;
      status: string;
      current_period_start?: string;
      current_period_end?: string;
      cancelled?: boolean;
      renews_at?: string;
      ends_at?: string;
    };
    relationships?: {
      customer?: {
        data: {
          id: string;
        };
      };
    };
  };
}

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing LEMON_SQUEEZY_WEBHOOK_SECRET');
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');

  try {
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (signatureBuffer.length !== digestBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
  } catch {
    return false;
  }
}

async function handleDowngrade(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  newPlanName: 'free' | 'basic' | 'pro',
) {
  const { data: newPlan } = await supabase
    .from('plans')
    .select('max_watchlist')
    .eq('name', newPlanName)
    .single();

  if (!newPlan) {
    console.error(`Plan not found: ${newPlanName}`);
    return;
  }

  const { data: watchlists } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (!watchlists || watchlists.length <= newPlan.max_watchlist) {
    return;
  }

  const itemsToKeep = watchlists.slice(0, newPlan.max_watchlist);
  const itemsToDeactivate = watchlists.slice(newPlan.max_watchlist);

  if (itemsToDeactivate.length > 0) {
    const idsToDeactivate = itemsToDeactivate.map((w) => w.id);
    await supabase
      .from('watchlists')
      .update({ is_active: false })
      .in('id', idsToDeactivate);

    console.log(
      `Deactivated ${itemsToDeactivate.length} watchlist items for user ${userId} due to downgrade to ${newPlanName}`,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature || !verifySignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: WebhookEvent = JSON.parse(payload);
    const eventName = event.meta.event_name;

    console.log(`Received webhook event: ${eventName}`);

    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const email = event.data.attributes.user_email;
    const customerId = event.data.attributes.customer_id.toString();
    const variantId = event.data.attributes.variant_id.toString();
    const subscriptionId = event.data.id;

    let userId: string | null = null;

    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('auth_user_id')
      .eq('email', email)
      .single();

    userId = subscriber?.auth_user_id || null;

    switch (eventName) {
      case 'subscription_created': {
        const basicVariantId = process.env.LEMON_SQUEEZY_BASIC_VARIANT_ID;
        const proVariantId = process.env.LEMON_SQUEEZY_PRO_VARIANT_ID;

        let planName: 'basic' | 'pro';
        if (variantId === basicVariantId) {
          planName = 'basic';
        } else if (variantId === proVariantId) {
          planName = 'pro';
        } else {
          console.error(`Unknown variant ID: ${variantId}`);
          return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
        }

        const { data: plan } = await supabase
          .from('plans')
          .select('id')
          .eq('name', planName)
          .single();

        if (!plan) {
          console.error(`Plan not found: ${planName}`);
          return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        await supabase
          .from('subscribers')
          .upsert(
            {
              email,
              auth_user_id: userId,
              plan_id: plan.id,
              is_active: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'email' },
          );

        if (userId) {
          await supabase.from('subscriptions').insert({
            user_id: userId,
            plan_id: plan.id,
            ls_subscription_id: subscriptionId,
            ls_customer_id: customerId,
            ls_variant_id: variantId,
            status: 'active',
            current_period_start: event.data.attributes.current_period_start || null,
            current_period_end: event.data.attributes.current_period_end || null,
            cancel_at_period_end: false,
            retry_count: 0,
          });
        }

        console.log(`Created subscription for ${email} with plan ${planName}`);
        break;
      }

      case 'subscription_updated': {
        const status = event.data.attributes.status;
        const cancelled = event.data.attributes.cancelled || false;

        let subscriptionStatus: 'active' | 'cancelled' | 'past_due' | 'paused';
        if (cancelled) {
          subscriptionStatus = 'cancelled';
        } else if (status === 'active') {
          subscriptionStatus = 'active';
        } else if (status === 'past_due') {
          subscriptionStatus = 'past_due';
        } else if (status === 'paused') {
          subscriptionStatus = 'paused';
        } else {
          subscriptionStatus = 'active';
        }

        if (userId) {
          const { data: existingSubscription } = await supabase
            .from('subscriptions')
            .select('plan_id, ls_variant_id')
            .eq('user_id', userId)
            .eq('ls_subscription_id', subscriptionId)
            .single();

          const newVariantId = event.data.attributes.variant_id.toString();

          if (
            existingSubscription &&
            existingSubscription.ls_variant_id !== newVariantId
          ) {
            const basicVariantId = process.env.LEMON_SQUEEZY_BASIC_VARIANT_ID;
            const proVariantId = process.env.LEMON_SQUEEZY_PRO_VARIANT_ID;

            let newPlanName: 'basic' | 'pro';
            if (newVariantId === basicVariantId) {
              newPlanName = 'basic';
            } else if (newVariantId === proVariantId) {
              newPlanName = 'pro';
            } else {
              console.error(`Unknown variant ID: ${newVariantId}`);
              return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
            }

            const { data: newPlan } = await supabase
              .from('plans')
              .select('id, name')
              .eq('name', newPlanName)
              .single();

            if (newPlan) {
              await supabase
                .from('subscriptions')
                .update({
                  plan_id: newPlan.id,
                  ls_variant_id: newVariantId,
                  status: subscriptionStatus,
                  updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId)
                .eq('ls_subscription_id', subscriptionId);

              await supabase
                .from('subscribers')
                .update({
                  plan_id: newPlan.id,
                  updated_at: new Date().toISOString(),
                })
                .eq('email', email);

              await handleDowngrade(supabase, userId, newPlanName);

              console.log(`Updated subscription plan to ${newPlanName} for ${email}`);
            }
          } else {
            await supabase
              .from('subscriptions')
              .update({
                status: subscriptionStatus,
                current_period_start: event.data.attributes.current_period_start || null,
                current_period_end: event.data.attributes.current_period_end || null,
                cancel_at_period_end: cancelled,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', userId)
              .eq('ls_subscription_id', subscriptionId);

            console.log(`Updated subscription status to ${subscriptionStatus} for ${email}`);
          }
        }
        break;
      }

      case 'subscription_cancelled': {
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              cancel_at_period_end: true,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('ls_subscription_id', subscriptionId);
        }

        await supabase
          .from('subscribers')
          .update({
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email);

        console.log(`Cancelled subscription for ${email}`);
        break;
      }

      case 'subscription_payment_failed': {
        if (userId) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('retry_count')
            .eq('user_id', userId)
            .eq('ls_subscription_id', subscriptionId)
            .single();

          const newRetryCount = (subscription?.retry_count || 0) + 1;

          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              retry_count: newRetryCount,
              grace_period_start: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('ls_subscription_id', subscriptionId);

          await supabase.from('payment_logs').insert({
            subscription_id: subscription ? subscriptionId : null,
            ls_order_id: null,
            ls_invoice_id: null,
            amount: 0,
            currency: 'USD',
            status: 'failed',
            webhook_payload: JSON.parse(payload),
          });

          console.log(`Payment failed for ${email}, retry count: ${newRetryCount}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
