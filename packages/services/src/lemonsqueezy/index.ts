const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

interface CheckoutOptions {
  email: string;
  variantId: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutResponse {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
}

interface SubscriptionResponse {
  data: {
    id: string;
    attributes: {
      status: string;
      urls: {
        customer_portal: string;
        update_payment_method: string;
      };
    };
  };
}

export async function createCheckout(
  options: CheckoutOptions,
): Promise<string> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    throw new Error('Missing Lemon Squeezy configuration');
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: options.email,
          },
          product_options: {
            redirect_url: options.successUrl,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: options.variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Lemon Squeezy API error:', error);
    throw new Error('Failed to create checkout');
  }

  const data: CheckoutResponse = await response.json();
  return data.data.attributes.url;
}

export async function cancelSubscription(
  subscriptionId: string,
): Promise<void> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Lemon Squeezy API key');
  }

  const response = await fetch(
    `${LEMONSQUEEZY_API_URL}/subscriptions/${subscriptionId}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            cancelled: true,
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Cancel subscription error:', error);
    throw new Error('Failed to cancel subscription');
  }
}

export async function resumeSubscription(
  subscriptionId: string,
): Promise<void> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Lemon Squeezy API key');
  }

  const response = await fetch(
    `${LEMONSQUEEZY_API_URL}/subscriptions/${subscriptionId}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            cancelled: false,
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Resume subscription error:', error);
    throw new Error('Failed to resume subscription');
  }
}

export async function getSubscription(subscriptionId: string): Promise<SubscriptionResponse['data']> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Lemon Squeezy API key');
  }

  const response = await fetch(
    `${LEMONSQUEEZY_API_URL}/subscriptions/${subscriptionId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Get subscription error:', error);
    throw new Error('Failed to get subscription');
  }

  const data: SubscriptionResponse = await response.json();
  return data.data;
}

export async function getCustomerPortalUrl(subscriptionId: string): Promise<string> {
  const subscription = await getSubscription(subscriptionId);
  return subscription.attributes.urls.customer_portal;
}
