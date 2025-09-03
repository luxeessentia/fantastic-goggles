// Next.js API: create a Stripe Checkout session
import { stripe } from '../../lib/stripe';
import { initFirebaseAdmin } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { items, email } = req.body || {};
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid items' });

    const line_items = items.map(it => ({
      price_data: {
        currency: 'usd',
        product_data: { name: it.title || it.id },
        unit_amount: it.price_cents || 1000
      },
      quantity: it.quantity || 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: email || undefined,
      success_url: process.env.SUCCESS_URL || process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/checkout/success',
      cancel_url: process.env.CANCEL_URL || process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/checkout/cancel'
    });

    // Optionally write order to Firestore if admin configured
    try {
      const admin = initFirebaseAdmin();
      if (admin) {
        const db = admin.firestore();
        await db.collection('orders').add({ stripeSessionId: session.id, email: email || null, items, status: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp() });
      }
    } catch (e) { console.warn('Could not write order to Firestore', e.message || e); }

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'server error' });
  }
}