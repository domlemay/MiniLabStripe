import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../app/generated/prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const product = await prisma.product.create({
    data: {
      name: 'T-shirt Next.js',
      description: 'Un t-shirt pour les développeurs Next.js',
      price: 29.99,
    },
  });

  const cart = await prisma.cart.create({
    data: {
      userId: 'demo-user-id',
      items: {
        create: {
          quantity: 2,
          productId: product.id,
        },
      },
    },
  });

  console.log('Produit créé :', product);
  console.log('Panier créé :', cart);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
