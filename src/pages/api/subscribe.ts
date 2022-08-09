import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from 'next-auth/react';
import { query as q } from 'faunadb';
import { fauna } from "../../services/fauna";

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

    const session = await getSession({req});

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    );

    let costumerId = user.data.stripe_customer_id;

    if (!costumerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      });
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_costumer_id: stripeCustomer.id,
            }
          }
        )
      )
  
      costumerId = stripeCustomer.id;
    }


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: costumerId,
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