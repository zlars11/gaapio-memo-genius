
// https://github.com/stripe/stripe-node#usage-with-typescript
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})
