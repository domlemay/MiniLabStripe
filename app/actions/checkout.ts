'use server';

import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createCheckoutSessionSchema = z.object({
  cartId: z.string().min(1, 'cartId est obligatoire'),
});

type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<void> {
  const parsed = createCheckoutSessionSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const { cartId } = parsed.data;

  const userId = 'demo-user-id';

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error('Panier introuvable');
  }

  if (cart.items.length === 0) {
    throw new Error('Votre panier est vide');
  }

  const lineItems = cart.items.map((item) => {
    const priceInCents = Math.round(Number(item.product.price) * 100);

    if (priceInCents <= 0) {
      throw new Error(`Prix invalide pour le produit : ${item.product.name}`);
    }

    return {
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.product.name,
          description: item.product.description ?? undefined,
        },
        unit_amount: priceInCents,
      },
      quantity: item.quantity,
    };
  });

  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error('APP_URL est manquante dans .env.local');
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
    metadata: {
      cartId: cart.id,
      userId,
    },
    locale: 'fr',
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe n'a pas retourné d'URL de paiement");
  }

  redirect(checkoutSession.url);
}
