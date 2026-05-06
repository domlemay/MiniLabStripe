'use client';

import { useState, useTransition } from 'react';
import { addToCart } from '@/app/actions/cart';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

type AddProductModalProps = {
  products: Product[];
};

export function AddProductModal({ products }: AddProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();

  function handleQuantityChange(productId: string, value: string) {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        for (const product of products) {
          const qty = quantities[product.id] ?? 0;
          if (qty > 0) {
            await addToCart(product.id, qty);
          }
        }
        setIsOpen(false);
        setQuantities({});
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Une erreur est survenue.');
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mb-6 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
      >
        + Ajouter un produit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Ajouter un produit</h2>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-700">{product.price.toFixed(2)} $ CAD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Qté</label>
                    <input
                      type="number"
                      min={0}
                      value={quantities[product.id] ?? 0}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 rounded-lg border px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => { setIsOpen(false); setQuantities({}); }}
                disabled={isPending}
                className="flex-1 rounded-lg border px-4 py-2 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isPending ? 'Mise à jour...' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
