import { CheckoutButton } from './_components/CheckoutButton';
import { AddProductModal } from './_components/AddProductModal';
import prisma from '@/lib/prisma';

export default async function CartPage() {
  const [cart, products] = await Promise.all([
    prisma.cart.findFirst({
      where: { userId: 'demo-user-id' },
      include: {
        items: {
          include: { product: true },
        },
      },
    }),
    prisma.product.findMany(),
  ]);

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
  }));

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Votre panier</h1>

      <AddProductModal products={serializedProducts} />

      {!cart || cart.items.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide.</p>
      ) : (
        <>
          <section className="mb-6 space-y-4">
            {cart.items.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h2 className="font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  {(Number(item.product.price) * item.quantity).toFixed(2)} $ CAD
                </p>
              </article>
            ))}
          </section>

          <div className="mb-6 flex justify-between border-t pt-4 text-xl font-bold">
            <span>Total</span>
            <span>
              {cart.items
                .reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
                .toFixed(2)}{' '}
              $ CAD
            </span>
          </div>

          <CheckoutButton cartId={cart.id} disabled={cart.items.length === 0} />
        </>
      )}
    </main>
  );
}
