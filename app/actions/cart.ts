'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export async function addToCart(productId: string, quantity: number) {
  const parsed = addToCartSchema.safeParse({ productId, quantity });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const userId = 'demo-user-id';

  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: parsed.data.quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: parsed.data.quantity,
      },
    });
  }

  revalidatePath('/cart');
}
