import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

    const session = await getSession({req});

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      line_items: [
        { price: 'price_1L8E15GtisySEE90HEOLyxhR', quantity: 1 },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      mode: 'subscription'
    })

    return res.status(200).json({sessionId: stripeCheckoutSession.id})
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}